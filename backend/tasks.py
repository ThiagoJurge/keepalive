from celery_worker import celery
from models import db, Host, HostStatus
from services import ping, check_port, check_http
from app import create_app
import requests

app = create_app()

@celery.task
def check_host_task(host_id):
    with app.app_context():
        host = Host.query.get(host_id)
        if not host:
            return

        icmp, icmp_resp_time = ping(host.ip)
        port = check_port(host.ip, host.port)
        http, _ = check_http(host.url)

        alerts = {
            not icmp: (
                "🔴 *ALERTA: HOST INACESSÍVEL (ICMP)* 🔴\n"
                "══════════════════════════════════\n"
                "• O host não respondeu ao ping (possivelmente offline)\n\n"
                "📌 *Informações do Host*\n"
                "-----------------------\n"
                f"• Nome: `{host.name}`\n"
                f"• IP: `{host.ip}`\n"
                "══════════════════════════════════"
            ),
            
            not port: (
                "🔴 *ALERTA: PORTA FECHADA* 🔴\n"
                "════════════════════════════\n"
                f"• A porta `{host.port}` está inacessível no host\n\n"
                "📌 *Informações do Host*\n"
                "-----------------------\n"
                f"• Nome: `{host.name}`\n"
                f"• IP: `{host.ip}`\n"
                f"• Porta: `{host.port}`\n"
                "════════════════════════════"
            ),
            
            not http: (
                "🔴 *ALERTA: APLICAÇÃO HTTP INDISPONÍVEL* 🔴\n"
                "══════════════════════════════════════\n\n"
                "📌 *Informações do Serviço*\n"
                "--------------------------\n"
                f"• Nome: `{host.name}`\n"
                f"• IP: `{host.ip}`\n"
                f"• URL: `{host.url}`\n"
                "══════════════════════════════════════"
            )
        }
        for condition, message in alerts.items():
            if condition:
                try:
                    requests.post("http://bot:3001/send-message", json={"message": message})
                except requests.exceptions.RequestException as e:
                    print(f"Erro ao enviar alerta: {e}")

        status = HostStatus(
            host_id=host.id,
            icmp_ok=icmp,
            port_open=port,
            http_ok=http,
            response_time=icmp_resp_time,
        )
        db.session.add(status)
        db.session.commit()
