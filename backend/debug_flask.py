from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import traceback

app = Flask(__name__)
CORS(app)

@app.route("/test", methods=["GET"])
def test():
    try:
        print("TEST: Endpoint called", file=sys.stderr, flush=True)
        sys.stderr.flush()
        return jsonify({"success": True, "message": "OK"})
    except Exception as e:
        print(f"TEST ERROR: {e}", file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr)
        sys.stderr.flush()
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print("Starting debug Flask app on port 5003...", file=sys.stderr, flush=True)
    sys.stderr.flush()
    app.run(host="127.0.0.1", port=5003, debug=False, use_reloader=False, threaded=False)
