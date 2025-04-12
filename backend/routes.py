from flask import Blueprint, request, jsonify
from models import db, Host, HostStatus
from sqlalchemy.orm import joinedload

bp = Blueprint('api', __name__)


@bp.route("/hosts", methods=["GET"])
def get_all_hosts():
    hosts = Host.query.options(joinedload(Host.statuses)).all()
    result = []

    for host in hosts:
        last_status = max(host.statuses, key=lambda s: s.checked_at, default=None)

        result.append({
            "id": host.id,
            "name": host.name,
            "ip": host.ip,
            "port": host.port,
            "url": host.url,
            "created_at": host.created_at.isoformat(),
            "last_status": {
                "icmp_ok": last_status.icmp_ok if last_status else None,
                "port_open": last_status.port_open if last_status else None,
                "http_ok": last_status.http_ok if last_status else None,
                "response_time": last_status.response_time if last_status else None,
                "checked_at": last_status.checked_at.isoformat() if last_status else None,
            }
        })

    return jsonify(result)


@bp.route("/hosts", methods=["POST"])
def add_host():
    data = request.json
    host = Host(name=data["name"], ip=data["ip"], port=data["port"], url=data["url"])
    db.session.add(host)
    db.session.commit()
    return jsonify({"message": "Host registrado com sucesso!"}), 201

@bp.route("/hosts/<int:host_id>/status", methods=["GET"])
def get_all_statuses(host_id):
    statuses = HostStatus.query.filter_by(host_id=host_id).order_by(HostStatus.checked_at.desc()).all()

    if not statuses:
        return jsonify({"error": "Status não encontrado"}), 404

    response_data = []
    for status in statuses:
        response_data.append({
            "id": status.id,
            "host_id": status.host_id,
            "icmp_ok": status.icmp_ok,
            "port_open": status.port_open,
            "http_ok": status.http_ok,
            "response_time": status.response_time,
            "checked_at": status.checked_at.isoformat()
        })

    return jsonify(response_data), 200
