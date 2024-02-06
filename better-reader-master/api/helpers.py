from django.core.mail import send_mail

from django.conf import settings


def send_forget_password_mail(email, token, client_url = "http://127.0.0.1:5173/"):
    print("Sending mail... [PENDING]")
    subject = "Password Reset Requested - Let's Get You Back on Track"
    message = f"""
    Hello there,
    
    We've received a request to reset your password, and we're here to help! There's no need to worry; simply click the link below to create a new password and regain access to your account:

    {client_url}reset-password/{token}

    If you didn't request this password reset, please disregard this email or contact our support team to ensure your account remains secure.

    Best regards,
    BetterReader"""
    #subject = "Password Reset Requested - Let's Get You Back on Track"
    #message = f'We heard that you lost your password. Sorry about that! But don’t worry! You can use this link to reset your password : {client_url}reset-password/{token}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    try:
        send_mail(subject, message, email_from,
                  recipient_list, fail_silently=False)
        print("Sending mail... [SUCCESS]")
    except Exception as e:
        print("Sending mail... [ERROR]")
        print("[ERROR]", e)
    return True
