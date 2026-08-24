from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return """
    <h1>Tech Genie Backend</h1>
    <p>The Flask server is running successfully.</p>
    """


@app.route("/api/health")
def health_check():
    return jsonify(
        {
            "application": "Tech Genie Creative & Data Lab",
            "status": "healthy",
            "message": "The Python backend is working."
        }
    )


if __name__ == "__main__":
    app.run(debug=True)