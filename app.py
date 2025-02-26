import os
import json
import numpy as np
from flask import Flask, request, render_template, jsonify
import tensorflow as tf
from PIL import Image
from io import BytesIO
import base64

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('plant_disease_model.h5')

# Load class names
with open('class_names.json', 'r') as f:
    class_names = json.load(f)

# Preprocess image function
def preprocess_image(image, target_size=(224, 224)):
    # Resize image
    image = image.resize(target_size)
    # Convert to array and normalize
    image_array = np.array(image) / 255.0
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# Function to get predictions
def predict_disease(image):
    # Preprocess the image
    processed_image = preprocess_image(image)
    
    # Get model predictions
    predictions = model.predict(processed_image)[0]
    
    # Get top 3 predictions
    top_indices = predictions.argsort()[-3:][::-1]
    results = [
        {
            "disease": class_names[i],
            "confidence": float(predictions[i] * 100)
        }
        for i in top_indices
    ]
    
    return results

# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')

# Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    try:
        # Open and preprocess the image
        img = Image.open(file)
        
        # Handle non-RGB images
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Get predictions
        results = predict_disease(img)
        
        # Convert image to base64 for display
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Return the results
        return jsonify({
            'success': True,
            'predictions': results,
            'image': img_str
        })
    
    except Exception as e:
        return jsonify({'error': str(e)})

# Create templates directory and index.html
os.makedirs('templates', exist_ok=True)
with open('templates/index.html', 'w') as f:
    f.write('''
<!DOCTYPE html>
<html>
<head>
    <title>Leaf Disease Detection</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .upload-area {
            border: 2px dashed #3498db;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            cursor: pointer;
        }
        .upload-area:hover {
            background-color: #f0f8ff;
        }
        .upload-area p {
            color: #7f8c8d;
        }
        #file-input {
            display: none;
        }
        .button {
            background-color: #2ecc71;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        }
        .button:hover {
            background-color: #27ae60;
        }
        .button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }
        #result-container {
            margin-top: 20px;
            display: none;
        }
        .result-card {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .disease-name {
            color: #e74c3c;
            font-weight: bold;
            font-size: 18px;
        }
        .confidence {
            color: #3498db;
            font-weight: bold;
        }
        .preview-image {
            max-width: 100%;
            max-height: 300px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .progress-bar {
            width: 100%;
            background-color: #f0f0f0;
            border-radius: 4px;
            margin-top: 5px;
        }
        .progress {
            background-color: #3498db;
            height: 10px;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .loading {
            text-align: center;
            margin-top: 20px;
            display: none;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Leaf Disease Detection</h1>
        
        <div class="upload-area" id="upload-area">
            <p>Click or drag a leaf image here to upload</p>
            <input type="file" id="file-input" accept="image/*">
            <img id="preview" class="preview-image" style="display: none;">
        </div>
        
        <div style="text-align: center;">
            <button id="predict-button" class="button" disabled>Detect Disease</button>
        </div>
        
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Analyzing leaf image...</p>
        </div>
        
        <div id="result-container">
            <h2>Detection Results:</h2>
            <div id="predictions"></div>
        </div>
    </div>

    <script>
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const preview = document.getElementById('preview');
        const predictButton = document.getElementById('predict-button');
        const resultContainer = document.getElementById('result-container');
        const predictionsDiv = document.getElementById('predictions');
        const loadingDiv = document.getElementById('loading');
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = '#f0f8ff';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFile(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFile(fileInput.files[0]);
            }
        });
        
        function handleFile(file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    predictButton.disabled = false;
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file');
            }
        }
        
        predictButton.addEventListener('click', async () => {
            if (!fileInput.files.length) return;
            
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            
            resultContainer.style.display = 'none';
            loadingDiv.style.display = 'block';
            predictButton.disabled = true;
            
            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.error) {
                    alert('Error: ' + data.error);
                    return;
                }
                
                displayResults(data.predictions);
                resultContainer.style.display = 'block';
            } catch (error) {
                alert('Error during prediction: ' + error.message);
            } finally {
                loadingDiv.style.display = 'none';
                predictButton.disabled = false;
            }
        });
        
        function displayResults(predictions) {
            predictionsDiv.innerHTML = '';
            
            predictions.forEach(prediction => {
                const resultCard = document.createElement('div');
                resultCard.className = 'result-card';
                
                const diseaseName = document.createElement('div');
                diseaseName.className = 'disease-name';
                diseaseName.textContent = formatDiseaseName(prediction.disease);
                
                const confidence = document.createElement('div');
                confidence.className = 'confidence';
                confidence.textContent = `Confidence: ${prediction.confidence.toFixed(2)}%`;
                
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                
                const progress = document.createElement('div');
                progress.className = 'progress';
                progress.style.width = `${prediction.confidence}%`;
                
                progressBar.appendChild(progress);
                
                resultCard.appendChild(diseaseName);
                resultCard.appendChild(confidence);
                resultCard.appendChild(progressBar);
                
                predictionsDiv.appendChild(resultCard);
            });
        }
        
        function formatDiseaseName(name) {
            // Convert from dataset format (e.g., "Apple___Apple_scab") to readable format
            return name.replace(/_/g, ' ').replace(/\//g, ' ').replace(/\\\\/, ' ');
        }
    </script>
</body>
</html>
    ''')

# Main function to run the app
if __name__ == '__main__':
    print("Starting Leaf Disease Detection Web Application...")
    print("Visit http://127.0.0.1:5000/ in your browser")
    app.run(debug=True)