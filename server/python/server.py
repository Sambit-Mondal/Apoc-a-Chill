from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import boto3
import os
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)
load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")

# Initialize Rekognition client
rekognition = boto3.client(
    "rekognition",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        # Ensure an image is provided in the request
        image_data = request.json.get('image')
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400

        # Decode the base64 image
        image_bytes = base64.b64decode(image_data.split(",")[1])

        # Call AWS Rekognition
        result = rekognition.detect_labels(
            Image={"Bytes": image_bytes},
            MaxLabels=10,
            MinConfidence=75,
        )

        # Parse the result to find labels
        labels = [label["Name"] for label in result.get("Labels", [])]
        
        # Check for edibility
        edible_keywords = {"Food", "Fruit", "Vegetable", "Drink", "Meal"}
        is_edible = any(keyword in labels for keyword in edible_keywords)

        response = {
            "is_edible": is_edible,
            "labels": labels,
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)