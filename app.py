import os
import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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


if __name__ == "__main__":
    initialize_database()
    app.run(debug=True)