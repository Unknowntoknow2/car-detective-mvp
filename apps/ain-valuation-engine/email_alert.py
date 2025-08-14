import smtplib
from email.mime.text import MIMEText
import logging

def send_email_alert(subject, body, to_email):
    from_email = 'your_email@example.com'
    password = 'your_password'  # Use environment variable or secret manager in production
    smtp_server = 'smtp.example.com'
    smtp_port = 587

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(from_email, password)
            server.sendmail(from_email, [to_email], msg.as_string())
    except Exception as e:
        logging.error(f'Failed to send alert email: {e}')

if __name__ == '__main__':
    # Example usage
    send_email_alert('AIN Monitoring Alert', 'Test alert body', 'destination@example.com')
