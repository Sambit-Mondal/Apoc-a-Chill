import streamlit as st
import boto3
import os
from dotenv import load_dotenv
from PIL import Image

# Load environment variables from .env
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

# Streamlit app
st.title("Food Edibility Checker")

st.write("Upload an image of a food item, and we'll determine if it's edible!")

# File uploader
uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

if uploaded_file:
    # Display the uploaded image
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_container_width=True)

    # Read file bytes and reset pointer
    uploaded_file.seek(0)  # Reset file pointer before reading
    file_bytes = uploaded_file.read()

    # Validate file_bytes to ensure it's not empty
    if not file_bytes:
        st.error("The uploaded file appears to be empty. Please upload a valid image.")
    else:
        # Call Rekognition
        with st.spinner("Analyzing the image..."):
            try:
                result = rekognition.detect_labels(
                    Image={"Bytes": file_bytes},
                    MaxLabels=10,
                    MinConfidence=75,
                )
                
                # Parse response if result exists
                labels = [label["Name"] for label in result.get("Labels", [])]
                #st.write("Detected Labels:", labels)

                # Check for edibility
                edible_keywords = {"Food", "Fruit", "Vegetable", "Drink", "Meal"}
                is_edible = any(keyword in labels for keyword in edible_keywords)

                if is_edible:
                    st.success("The food item appears to be edible!")
                else:
                    st.error("The food item does not appear to be edible.")

            except Exception as e:
                st.error(f"An error occurred while processing the image: {e}")
                st.stop()


    # Parse response
    labels = [label["Name"] for label in result["Labels"]]
   # st.write("Detected Labels:", labels)
