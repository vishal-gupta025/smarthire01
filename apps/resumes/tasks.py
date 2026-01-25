from celery import shared_task
from apps.resumes.models import Resume, ResumeAnalysis
from apps.accounts.models import candidateProfile
from apps.resumes.services.extract_text import extract_resume_text
from apps.resumes.services.resume_parser import parse_resume_with_llm

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=10,
    retry_kwargs={"max_retries": 3},
    time_limit=60,
    soft_time_limit=50
)
def process_resume_task(self, resume_id):
    resume = Resume.objects.select_related("candidate").get(id=resume_id)
    profile = resume.candidate

    resume.status = "PROCESSING"
    resume.save(update_fields=["status"])

    text = extract_resume_text(resume.file.path)
    parsed = parse_resume_with_llm(text)

    profile.skills = ", ".join(parsed.skills)
    profile.education = "\n".join(
        f"{e.degree} at {e.institution} ({e.date_range})"
        for e in parsed.education if e.degree
    )
    profile.experience = "\n\n".join(
        f"{x.role} at {x.company} ({x.date_range})\n" +
        "\n".join(f"• {w}" for w in x.work_done)
        for x in parsed.experience if x.company
    )
    profile.save()

    ResumeAnalysis.objects.update_or_create(
        resume=resume,
        defaults={
            "extracted_skills": parsed.skills,
            "extracted_education": parsed.education,
            "extracted_experience": parsed.experience,
        }
    )

    resume.status = "COMPLETED"
    resume.save(update_fields=["status"])

    return {"resume_id": resume.id, "status": "COMPLETED"}
