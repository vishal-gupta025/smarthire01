from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_email_on_job_creations(candidate_emails, job_title, company_name, salery_min, salery_max, location):
    for candidate_email in candidate_emails:
        send_mail(
            subject=f"New Jobs for you!",
            message=f"Dear Candidate,\n\nA new job '{job_title}' has been posted by {company_name} that matches your profile. The salary range is {salery_min} - {salery_max} and the location is {location}.\n\nBe sure to check it out!\n\nBest regards,\nSmartHire Team.",
            from_email=None,
        recipient_list=[candidate_email],
        fail_silently=False,
    )

    