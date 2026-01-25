from django.core.mail import send_mail


def send_application_email(candidate_email, job_title, company_name):
    """Send email confirmation when a candidate applies for a job."""
    send_mail(
        subject=f"Application Received for {job_title} at {company_name}",
        message=f"Dear Candidate,\n\nThank you for applying for the position of {job_title}.\n\nWe have received your application and will review it shortly.\n\nBest regards,\n{company_name} Team.",
        from_email=None,
        recipient_list=[candidate_email],
        fail_silently=True,
    )


def send_status_update_email(candidate_email, job_title, new_status):
    """Send email notification when application status changes."""
    if new_status == 'under_review':
        send_mail(
            subject=f"Your Application for {job_title} is Under Review",
            message=f"Dear Candidate,\n\nYour application for the position of {job_title} is currently under review. We will keep you updated on the next steps.\n\nBest regards,\nRecruitment Team.",
            from_email=None,
            recipient_list=[candidate_email],
            fail_silently=True,
        )
    elif new_status == 'interview_scheduled':
        send_mail(
            subject=f"Interview Scheduled for {job_title}",
            message=f"Dear Candidate,\n\nWe are pleased to inform you that an interview has been scheduled for the position of {job_title}. Please check your email for further details.\n\nBest regards,\nRecruitment Team.",
            from_email=None,
            recipient_list=[candidate_email],
            fail_silently=True,
        )
    elif new_status == 'offered':
        send_mail(
            subject=f"Job Offer for {job_title}",
            message=f"Dear Candidate,\n\nCongratulations! We are excited to offer you the position of {job_title}. Please check your email for the official offer letter and further instructions.\n\nBest regards,\nRecruitment Team.",
            from_email=None,
            recipient_list=[candidate_email],
            fail_silently=True,
        )
    elif new_status == 'rejected':
        send_mail(
            subject=f"Application Update for {job_title}",
            message=f"Dear Candidate,\n\nWe appreciate your interest in the position of {job_title}. After careful consideration, we regret to inform you that we will not be moving forward with your application. We encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nRecruitment Team.",
            from_email=None,
            recipient_list=[candidate_email],
            fail_silently=True,
        )
