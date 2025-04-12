import requests


msg_port = (
                f"🚨 *Alerta: Porta Fechada*\n"
            )

requests.post(
                "http://localhost:3001/send-message", json={"message": msg_port}
            )
