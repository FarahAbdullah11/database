from flask import Flask

app = Flask(__name__)

@app.route("/hello", methods=["GET"])
def hello():
    return {"message": "Hello World"}

if __name__ == "__main__":
    print("Starting minimal Flask app...")
    app.run(host="127.0.0.1", port=5002, debug=False, use_reloader=False)
