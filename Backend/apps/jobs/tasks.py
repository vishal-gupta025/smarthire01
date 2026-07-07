from celery import shared_task
from django.core.mail import send_mail
import logging


audit_logger = logging.getLogger("email_audit")


def _send_required_email(*, subject, message, candidate_email, event_type):
    if not candidate_email:
        audit_logger.error(
            "event=%s recipient=<missing> status=FAILED subject=%s reason=missing_recipient",
            event_type,
            subject,
        )
        raise ValueError("Candidate email is missing; cannot send email")

    try:
        sent_count = send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=[candidate_email],
            fail_silently=False,
        )

        if sent_count != 1:
            audit_logger.error(
                "event=%s recipient=%s status=FAILED subject=%s reason=smtp_not_accepted sent_count=%s",
                event_type,
                candidate_email,
                subject,
                sent_count,
            )
            raise RuntimeError(f"Email was not accepted by SMTP for recipient: {candidate_email}")

        audit_logger.info(
            "event=%s recipient=%s status=SUCCESS subject=%s sent_count=%s",
            event_type,
            candidate_email,
            subject,
            sent_count,
        )
    except Exception as exc:
        audit_logger.exception(
            "event=%s recipient=%s status=FAILED subject=%s reason=%s",
            event_type,
            candidate_email,
            subject,
            str(exc),
        )
        raise

@shared_task
def send_application_email(candidate_email, job_title, company_name):
    _send_required_email(
        subject=f"SmartHire Application: {job_title}",
        message=(
            f"Your application has been sent to {company_name} for the position of {job_title}. "
            "We will review your application and get back to you soon.\n\n"
            f"The following items were sent to {company_name}.\n\nBest regards,\nSmartHire Team."
        ),
        candidate_email=candidate_email,
        event_type="application_submitted",
    )

@shared_task
def send_status_update_email(candidate_email, job_title, company_name, new_status):
    normalized_status = (new_status or '').strip().lower()
    if normalized_status == 'accepted':
        normalized_status = 'offered'

    if normalized_status == 'under_review':
        _send_required_email(
            subject=f"Update from {company_name} regarding your application for {job_title}",
            message=f"Dear Candidate,\n\nYour application for the position of {job_title} is currently under review. We will keep you updated on the next steps.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            candidate_email=candidate_email,
            event_type="status_under_review",
        )
    elif normalized_status == 'interview_scheduled':
        _send_required_email(
            subject=f"Interview Scheduled for {job_title}",
            message=f"Dear Candidate,\n\nWe are pleased to inform you that an interview has been scheduled for the position of {job_title}. Please check your email for further details.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            candidate_email=candidate_email,
            event_type="status_interview_scheduled",
        )
    elif normalized_status == 'offered':
        _send_required_email(
            subject=f"Job Offer for {job_title}",
            message=f"Dear Candidate,\n\nCongratulations! We are excited to offer you the position of {job_title}. Please check your email for the official offer letter and further instructions.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            candidate_email=candidate_email,
            event_type="status_offered",
        )
    elif normalized_status == 'rejected':
        _send_required_email(
            subject=f"Application Update for {job_title}",
            message=f"Dear Candidate,\n\nWe appreciate your interest in the position of {job_title}. After careful consideration, we regret to inform you that we will not be moving forward with your application. We encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            candidate_email=candidate_email,
            event_type="status_rejected",
        )
    else:
        audit_logger.warning(
            "event=status_update recipient=%s status=SKIPPED subject=%s reason=unsupported_status new_status=%s",
            candidate_email,
            f"Status Update for {job_title}",
            normalized_status,
        )

@shared_task
def send_email_on_job_creations(candidate_emails, job_title, company_name, salery_min, salery_max, location):
    for candidate_email in candidate_emails:
        _send_required_email(
            subject="New Jobs for you!",
            message=f"Dear Candidate,\n\nA new job '{job_title}' has been posted by {company_name} that matches your profile. The salary range is {salery_min} - {salery_max} and the location is {location}.\n\nBe sure to check it out!\n\nBest regards,\nSmartHire Team.",
            candidate_email=candidate_email,
            event_type="job_created_notification",
        )