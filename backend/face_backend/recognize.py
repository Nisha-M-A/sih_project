import face_recognition
import numpy as np
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

ENCODINGS_DIR = 'encodings'

# Load or create encodings once on server start
known_face_encodings = []
known_face_names = []

def load_encodings():
    for file in os.listdir(ENCODINGS_DIR):
        if file.endswith(('.jpg', '.jpeg')):
            img_path = os.path.join(ENCODINGS_DIR, file)
            image = face_recognition.load_image_file(img_path)
            encodings = face_recognition.face_encodings(image)
            if encodings:
                known_face_encodings.append(encodings[0])
                known_face_names.append(os.path.splitext(file)[0])

load_encodings()

@app.route('/recognize', methods=['POST'])
def recognize():
    file = request.files['image']
    unknown_image = face_recognition.load_image_file(file)

    unknown_encodings = face_recognition.face_encodings(unknown_image)
    matches = []
    for unknown_encoding in unknown_encodings:
        results = face_recognition.compare_faces(known_face_encodings, unknown_encoding)
        match_names = [name for idx, name in enumerate(known_face_names) if results[idx]]
        matches.append(match_names)
    return jsonify(matches)

if __name__ == '__main__':
    app.run(port=6000)

@app.route('/recognize', methods=['POST'])
def recognize():
    file = request.files['image']
    unknown_image = face_recognition.load_image_file(file)
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    
    recognized_names = []
    for unknown_encoding in unknown_encodings:
        results = face_recognition.compare_faces(known_face_encodings, unknown_encoding)
        match_names = [known_face_names[i] for i, match in enumerate(results) if match]
        if match_names:
            recognized_names.extend(match_names)
            
    # Return unique recognized names, or empty list if none
    return jsonify(list(set(recognized_names)))


