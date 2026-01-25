from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_application_email(candidate_email, job_title, company_name):
    send_mail(
        subject=f"SmartHire Application: {job_title}",
        message=f"Your application has been send to {company_name} for the position of {job_title}. We will review your application and get back to you soon.\n\n The following items were sent to {company_name}.\n\nBest regards,\nSmartHire Team.",
        from_email=None,
        recipient_list=[candidate_email],
        fail_silently=False,
    )

@shared_task
def send_status_update_email(candidate_email, job_title, company_name, new_status):
    if new_status == 'under_review':
        send_mail(
            subject = f"Update from {company_name} regarding your application for {job_title}",
            message = f"Dear Candidate,\n\nYour application for the position of {job_title} is currently under review. We will keep you updated on the next steps.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            from_email = None,
            recipient_list = [candidate_email],
            fail_silently = False,
        )
    elif new_status == 'interview_scheduled':
        send_mail(
            subject = f"Interview Scheduled for {job_title}",
            message = f"Dear Candidate,\n\nWe are pleased to inform you that an interview has been scheduled for the position of {job_title}. Please check your email for further details.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            from_email = None,
            recipient_list = [candidate_email],
            fail_silently = False,
        )
    elif new_status == 'offered':
        send_mail(
            subject = f"Job Offer for {job_title}",
            message = f"Dear Candidate,\n\nCongratulations! We are excited to offer you the position of {job_title}. Please check your email for the official offer letter and further instructions.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            from_email = None,
            recipient_list = [candidate_email],
            fail_silently = False,
        )
    elif new_status == 'rejected':
        send_mail(
            subject = f"Application Update for {job_title}",
            message = f"Dear Candidate,\n\nWe appreciate your interest in the position of {job_title}. After careful consideration, we regret to inform you that we will not be moving forward with your application. We encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nRecruitment Team \n\n{company_name}.",
            from_email = None,
            recipient_list = [candidate_email],
            fail_silently = False,
        )
