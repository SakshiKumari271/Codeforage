from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app)

    @app.route('/')
    def home():
        return "CodeForage API is running!"

    # Register Blueprints
    from app.routes.verify_routes import verify_bp
    from app.routes.permutator_routes import permutator_bp
    from app.routes.draft_routes import draft_bp

    app.register_blueprint(verify_bp, url_prefix='/api')
    app.register_blueprint(permutator_bp, url_prefix='/api')
    app.register_blueprint(draft_bp, url_prefix='/api')

    return app
