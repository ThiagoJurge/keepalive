from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from zoneinfo import ZoneInfo  # Python 3.9+

db = SQLAlchemy()

def now_sp():
    return datetime.now(ZoneInfo("America/Sao_Paulo"))

class Host(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    ip = db.Column(db.String(100))
    port = db.Column(db.Integer)
    url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=now_sp)

    statuses = db.relationship("HostStatus", backref="host", lazy=True)

class HostStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey('host.id'), nullable=False)
    icmp_ok = db.Column(db.Boolean)
    port_open = db.Column(db.Boolean)
    http_ok = db.Column(db.Boolean)
    response_time = db.Column(db.Float)
    checked_at = db.Column(db.DateTime, default=now_sp)
