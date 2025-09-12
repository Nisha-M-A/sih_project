import face_recognition
import pickle
import os

# Create lists to store encodings and names
known_face_encodings = []
known_face_names = []

# Path to the directory containing known faces
known_faces_dir = "known_faces"

# Loop through each person's folder in the known_faces directory
for person_name in os.listdir(known_faces_dir):
    person_dir = os.path.join(known_faces_dir, person_name)
    if os.path.isdir(person_dir):
        print(f"Processing images for {person_name}...")
        # Loop through each image file in the person's folder
        for image_file in os.listdir(person_dir):
            if image_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(person_dir, image_file)
                image = face_recognition.load_image_file(image_path)
                
                # Get face encodings from the image
                face_encodings = face_recognition.face_encodings(image)
                
                # Check if a face was found in the image
                if len(face_encodings) > 0:
                    known_face_encodings.append(face_encodings[0])
                    known_face_names.append(person_name)
                    print(f"  - Encoded face for {person_name} from {image_file}")
                else:
                    print(f"  - No face found in {image_file}. Skipping.")

# Save the encodings and names to a file
with open("face_encodings.dat", "wb") as f:
    pickle.dump((known_face_encodings, known_face_names), f)

print("\nFace encodings saved successfully to 'face_encodings.dat'.")