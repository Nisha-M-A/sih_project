import os
import base64
import json
import pickle
from flask import Flask, request, jsonify
import face_recognition
import numpy as np

# --- Load the saved face encodings (training data) ---
try:
    with open("../face_encodings.dat", "rb") as f:
        known_face_encodings, known_face_names = pickle.load(f)
except FileNotFoundError:
    raise FileNotFoundError("Error: 'face_encodings.dat' not found. Please run 'save_encodings.py' first.")

# --- Flask App Setup ---
app = Flask(__name__)

# --- Function to perform facial recognition on a single image ---
def recognize_face_in_image(image_data):
    """
    Analyzes an image and returns the name of the recognized person.
    """
    try:
        # Decode the base64 image string
        image_np = face_recognition.load_image_file(image_data)
        
        # Find all face locations and encodings in the image
        face_locations = face_recognition.face_locations(image_np)
        face_encodings = face_recognition.face_encodings(image_np, face_locations)
        
        if not face_encodings:
            return {"name": "No face found"}

        # Compare the found face with known faces
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            
            # Find the best match
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]
                return {"name": name} # Return the first recognized name

        return {"name": "Unknown"} # If no match is found for any face

    except Exception as e:
        return {"error": str(e)}

# --- API Endpoint ---
@app.route('/recognize', methods=['POST'])
def recognize():
    """
    Receives a base64 encoded image and returns the recognized name.
    """
    try:
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # The image is received as a base64 string
        image_data = base64.b64decode(data['image'])

        # Call the facial recognition function
        result = recognize_face_in_image(image_data)

        if "error" in result:
            return jsonify(result), 500

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error: ' + str(e)}), 500

# --- Run the Flask app ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)