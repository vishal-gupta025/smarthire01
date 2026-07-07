from apps.accounts.models import candidateProfile
from apps.jobs.models import Job
from celery import shared_task


def _normalize_terms(value):
    if not value:
        return set()
    return {term.strip().lower() for term in value.split(",") if term.strip()}


def recommend_jobs_for_candidate(candidate, jobs=None, limit=10):
    candidate_skills = _normalize_terms(candidate.skills)
    if jobs is None:
        jobs = Job.objects.filter(job_status=True).select_related("recruiter")

    scored_jobs = []
    for job in jobs:
        required_skills = _normalize_terms(job.skills_required)
        if not required_skills:
            continue

        matched_skills = candidate_skills & required_skills
        if not matched_skills:
            continue

        score = round((len(matched_skills) / len(required_skills)) * 100, 2)
        reason = f"Matched skills: {', '.join(sorted(matched_skills))}"
        scored_jobs.append((job, score, reason))

    scored_jobs.sort(key=lambda item: (-item[1], -item[0].posted_at.timestamp()))
    return scored_jobs[:limit]


def find_matching_candidate_emails_for_job(job):
    job_skills = _normalize_terms(job.skills_required)
    if not job_skills:
        return []

    candidate_emails = []
    for candidate in candidateProfile.objects.select_related("user").all():
        candidate_skills = _normalize_terms(candidate.skills)
        if candidate_skills & job_skills:
            candidate_emails.append(candidate.user.email)

    return candidate_emails

@shared_task
def match_candidates_to_job(skils_required):
    required_skills = _normalize_terms(skils_required)
    candidates = candidateProfile.objects.all()
    matches = []

    for candidate in candidates:
        candidate_skills = _normalize_terms(candidate.skills)
        matched_skills = candidate_skills & required_skills
        if not matched_skills:
            continue

        score = round((len(matched_skills) / len(required_skills)) * 100, 2) if required_skills else 0
        matches.append(
            {
                "candidate_id": candidate.id,
                "candidate_name": candidate.full_name,
                "matched_skills": sorted(matched_skills),
                "score": score,
            }
        )

    return matches


