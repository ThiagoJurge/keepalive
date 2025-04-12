from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_size": 10,
        "max_overflow": 5,
        "pool_timeout": 30,
        "pool_recycle": 1800,
    } 
    db.init_app(app)

    app.register_blueprint(bp)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
