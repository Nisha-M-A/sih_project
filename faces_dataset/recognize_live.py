import cv2
import face_recognition
import pickle
import numpy as np

# Load the saved face encodings and names
try:
    with open("face_encodings.dat", "rb") as f:
        known_face_encodings, known_face_names = pickle.load(f)
except FileNotFoundError:
    print("Error: 'face_encodings.dat' not found. Please run 'save_encodings.py' first.")
    exit()

# Initialize webcam
video_capture = cv2.VideoCapture(0)

# Check if webcam is opened correctly
if not video_capture.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Main loop to process video frames
while True:
    # Grab a single frame from the webcam
    ret, frame = video_capture.read()
    
    if not ret:
        break

    # Convert the image from BGR color (OpenCV) to RGB (face_recognition)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Find all face locations and face encodings in the current frame
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    # Loop through each face found in the frame
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # Compare the current face with all known faces
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        name = "Unknown"
        
        # If a match is found in the `known_face_encodings`
        if True in matches:
            # Find the best match
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]
        
        # Draw a rectangle and label on the face
        # Convert back to BGR for OpenCV
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Display the resulting image
    cv2.imshow('Face Recognition', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam and close all windows
video_capture.release()
cv2.destroyAllWindows()