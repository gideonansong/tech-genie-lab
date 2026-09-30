import os
import sqlite3

from werkzeug.security import check_password_hash
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000"
    ]
)

os.makedirs(app.instance_path, exist_ok=True)

DATABASE_PATH = os.path.join(
    app.instance_path,
    "tech_genie.db"
)


def initialize_database():
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                interest TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


@app.route("/")
def home():
    return """
    <h1>Tech Genie Backend</h1>
    <p>The Flask server and SQLite database are running.</p>
    """


@app.route("/api/health")
def health_check():
    return jsonify(
        {
            "application": "Tech Genie Creative & Data Lab",
            "status": "healthy",
            "database": "SQLite",
            "message": "The Python backend is working."
        }
    )


@app.route("/api/contact", methods=["POST"])
def receive_contact():
    contact_data = request.get_json()

    if not contact_data:
        return jsonify(
            {
                "status": "error",
                "message": "No contact information was received."
            }
        ), 400

    name = contact_data.get("name", "").strip()
    email = contact_data.get("email", "").strip()
    interest = contact_data.get("interest", "").strip()
    message = contact_data.get("message", "").strip()

    if not name or not email or not interest or not message:
        return jsonify(
            {
                "status": "error",
                "message": "Please complete every contact field."
            }
        ), 400

    if "@" not in email or "." not in email:
        return jsonify(
            {
                "status": "error",
                "message": "Please provide a valid email address."
            }
        ), 400

    if len(message) < 10:
        return jsonify(
            {
                "status": "error",
                "message": "The message must contain at least 10 characters."
            }
        ), 400

    with sqlite3.connect(DATABASE_PATH) as connection:
        cursor = connection.execute(
            """
            INSERT INTO contacts (
                name,
                email,
                interest,
                message
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                name,
                email,
                interest,
                message
            )
        )

        contact_id = cursor.lastrowid

    return jsonify(
        {
            "status": "success",
            "message": f"Thank you, {name}. Your enquiry was saved.",
            "contact_id": contact_id
        }
    ), 201


@app.route("/api/contact-count")
def contact_count():
    with sqlite3.connect(DATABASE_PATH) as connection:
        result = connection.execute(
            "SELECT COUNT(*) FROM contacts"
        ).fetchone()

    return jsonify(
        {
            "total_contacts": result[0]
        }
    )

def admin_is_logged_in():
    return session.get("admin_logged_in", False)


@app.route("/api/contacts")
def get_contacts():
    if not admin_is_logged_in():
        return jsonify(
            {
                "status": "error",
                "message": "Administrator login required."
            }
        ), 401

    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.row_factory = sqlite3.Row

        contacts = connection.execute(
            """
            SELECT
                id,
                name,
                email,
                interest,
                message,
                created_at
            FROM contacts
            ORDER BY created_at DESC
            """
        ).fetchall()

    contact_list = []

    for contact in contacts:
        contact_list.append(dict(contact))

    return jsonify(
        {
            "contacts": contact_list,
            "total": len(contact_list)
        }
    )


@app.route("/api/analytics")
def get_analytics():
    if not admin_is_logged_in():
        return jsonify(
            {
                "status": "error",
                "message": "Administrator login required."
            }
        ), 401

    with sqlite3.connect(DATABASE_PATH) as connection:
        total_result = connection.execute(
            "SELECT COUNT(*) FROM contacts"
        ).fetchone()

        interest_results = connection.execute(
            """
            SELECT
                interest,
                COUNT(*) AS total
            FROM contacts
            GROUP BY interest
            ORDER BY total DESC
            """
        ).fetchall()

    analytics = []

    for interest, total in interest_results:
        analytics.append(
            {
                "interest": interest,
                "total": total
            }
        )

    most_requested = None

    if analytics:
        most_requested = analytics[0]["interest"]

    return jsonify(
        {
            "total_contacts": total_result[0],
            "most_requested": most_requested,
            "by_interest": analytics
        }
    )


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    login_data = request.get_json()

    if not login_data:
        return jsonify(
            {
                "status": "error",
                "message": "No login information was received."
            }
        ), 400

    username = login_data.get("username", "").strip()
    password = login_data.get("password", "")

    correct_username = os.getenv("ADMIN_USERNAME")
    password_hash = os.getenv("ADMIN_PASSWORD_HASH")

    if (
    username != correct_username
    or not password_hash
    or not check_password_hash(password_hash, password)
):
        return jsonify(
            {
                "status": "error",
                "message": "Incorrect username or password."
            }
        ), 401

    session["admin_logged_in"] = True

    return jsonify(
        {
            "status": "success",
            "message": "Login successful."
        }
    )


@app.route("/api/admin/status")
def admin_status():
    return jsonify(
        {
            "logged_in": session.get(
                "admin_logged_in",
                False
            )
        }
    )


@app.route("/api/admin/logout", methods=["POST"])
def admin_logout():
    session.clear()

    return jsonify(
        {
            "status": "success",
            "message": "You have been logged out."
        }
    )


if __name__ == "__main__":
    initialize_database()
    app.run(debug=True)