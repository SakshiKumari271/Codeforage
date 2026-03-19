import smtplib
import dns.resolver
import socket

def get_mx_record(domain):
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        mx_record = sorted([(r.preference, r.exchange.to_text()) for r in answers])[0][1]
        return mx_record.rstrip('.')
    except Exception as e:
        return None

def verify_email_smtp(email):
    domain = email.split('@')[-1]
    mx_record = get_mx_record(domain)
    
    details = {
        "email": email,
        "mx_record": mx_record or "None",
        "has_spf": False,
        "has_dmarc": False,
        "is_role_account": False,
        "is_free_provider": False,
        "smtp_banner": None
    }
    
    free_providers = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"]
    if domain.lower() in free_providers:
        details["is_free_provider"] = True
        
    role_accounts = ["admin", "info", "support", "sales", "contact", "marketing"]
    local_part = email.split('@')[0].lower()
    if local_part in role_accounts:
        details["is_role_account"] = True
        
    try:
        txt_records = dns.resolver.resolve(domain, 'TXT')
        details["has_spf"] = any('v=spf1' in str(r.strings) for r in txt_records)
    except Exception:
        pass
        
    try:
        dmarc_records = dns.resolver.resolve(f"_dmarc.{domain}", 'TXT')
        details["has_dmarc"] = any('v=DMARC1' in str(r.strings) for r in dmarc_records)
    except Exception:
        pass
    
    if not mx_record:
        details.update({"status": "Invalid", "reason": "No MX records found for domain"})
        return details

    try:
        server = smtplib.SMTP(timeout=10)
        code, message = server.connect(mx_record, 25)
        details["smtp_banner"] = message.decode('utf-8') if isinstance(message, bytes) else str(message)
        
        server.helo('localhost')
        server.mail('test@example.com')
        rcpt_code, rcpt_message = server.rcpt(email)
        server.quit()

        if rcpt_code == 250:
            details.update({"status": "Valid", "reason": "SMTP success"})
        else:
            details.update({"status": "Invalid", "reason": f"SMTP Error {rcpt_code}"})
            
    except socket.timeout:
        details.update({"status": "Error", "reason": "Connection Timed Out (ISP likely blocking Port 25)"})
    except Exception as e:
        details.update({"status": "Error", "reason": str(e)})
        
    return details