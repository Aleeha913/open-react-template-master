







import sys
import json
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import os
import tensorflow as tf
tf.get_logger().setLevel('ERROR')
os.environ["PYTHONIOENCODING"] = "utf-8"

# Suppress TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Load the trained model
try:
    model_path = 'model/model.h5'  # Update this path as needed
    model = load_model(model_path)
    print("Model found.")
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {e}"}))
    sys.exit(1)

# Validate the command-line arguments
if len(sys.argv) < 2:
    print(json.dumps({"error": "No image path provided."}))
    sys.exit(1)

image_path = sys.argv[1]
print(f"Receiveddddddddd image path: {image_path}")
# Validate the image file path
if not os.path.exists(image_path):
    print(json.dumps({"error": f"File not found: {image_path}"}))
    sys.exit(1)

try:
    # Preprocess the image
    print("enterrrrrrrrrrrrrrrrrrrr")
    image = load_img(image_path, target_size=(299, 299))  # Adjust input size if necessary
    img_array = img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize
    print(f"Receiveddddddddd image {image}")
    print(f"Receiveddddddddd image array {img_array}")
    # Make a prediction
    try:
        # prediction = model.predict(img_array)
        # print(f"Receiveddddddddd prediction {prediction}")
        prediction = model.predict(img_array, verbose=0)
        print(f"Receiveddddddddd prediction {prediction}")

    except Exception as e:
        print(f"Error occurred: {e}")

    # Interpret the result
    result = "Healthy" if prediction[0][0] <= 0.5 else "Diseased"
 
    # Send JSON result
    output_data = {
        "image_path": image_path,
        "prediction": result,
    }
    print(f"Prediction completed successfully. More info: {json.dumps(output_data, ensure_ascii=False)}")
    output_file = image_path + ".json"
    with open(output_file, "w", encoding="utf-8") as f:  # Ensure indentation here is correct
        json.dump(output_data, f, ensure_ascii=False)

    # Print the result for server.js (optional, for debugging)
    print(json.dumps(output_data))

except Exception as e:
    print(json.dumps({"error": f"Error during prediction: {e}, details: {repr(e)}"}))
    sys.exit(1)



