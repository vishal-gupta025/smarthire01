import logging

from celery import shared_task
from apps.resumes.models import Resume, ResumeAnalysis
from apps.resumes.services.extract_text import extract_resume_text
from apps.resumes.services.resume_parser import parse_resume_with_llm


logger = logging.getLogger(__name__)

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

    try:
        resume.status = "PROCESSING"
        resume.save(update_fields=["status"])

        text = extract_resume_text(resume.file.path)
        parsed = parse_resume_with_llm(text)

        education_entries = [entry.model_dump(mode="json") for entry in parsed.education]
        experience_entries = [entry.model_dump(mode="json") for entry in parsed.experience]

        profile.skills = ", ".join(parsed.skills)
        profile.education = "\n".join(
            f"{e.get('degree')} at {e.get('institution')} ({e.get('date_range')})"
            for e in education_entries
            if e.get("degree")
        )
        profile.experience = "\n\n".join(
            f"{x.get('role')} at {x.get('company')} ({x.get('date_range')})\n"
            + "\n".join(f"• {work_item}" for work_item in x.get("work_done", []))
            for x in experience_entries
            if x.get("company")
        )
        profile.save()

        ResumeAnalysis.objects.update_or_create(
            resume=resume,
            defaults={
                "extracted_skills": parsed.skills,
                "extracted_education": education_entries,
                "extracted_experience": experience_entries,
            }
        )

        resume.status = "COMPLETED"
        resume.save(update_fields=["status"])

        return {"resume_id": resume.id, "status": "COMPLETED"}
    except Exception:
        resume.status = "FAILED"
        resume.save(update_fields=["status"])
        logger.exception("Resume processing failed for resume_id=%s", resume_id)
        raise
