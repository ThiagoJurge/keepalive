from app import create_app
from models import Host
from tasks import check_host_task
import time

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        while True:
            hosts = Host.query.all()
            for host in hosts:
                check_host_task.delay(host.id)
            time.sleep(30)
