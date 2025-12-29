#!/usr/bin/env python
import sys
sys.path.insert(0, 'd:\\FALL\'25 - Junior\\Database Systems - CSCI305\\project3\\database\\backend')

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="rawan123",
        database="Hospital"
    )

@app.route("/test", methods=["GET"])
def test():
    try:
        print("TEST: Received request")
        db = get_db()
        print("TEST: Connected to database")
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) FROM patients")
        count = cursor.fetchone()[0]
        cursor.close()
        db.close()
        print(f"TEST: Patient count = {count}")
        return jsonify({"success": True, "patientCount": count})
    except Exception as e:
        print(f"TEST ERROR: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask test app...")
    app.run(host="127.0.0.1", port=5001, debug=False, use_reloader=False)
