from celery import Celery

celery = Celery(
    'painel',
    broker='redis://redis:6379/0',
    backend='rpc://'
)

# Carrega explicitamente o módulo de tarefas
celery.conf.imports = ['tasks']
