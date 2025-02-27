import React, { useState } from 'react';
import plantImage from "./photos/salon.jpg";

import { 
  UploadCloud, AlertCircle, Loader, Leaf, Home, Info, 
  Github, Camera, Zap, BookOpen, Check, X, ChevronRight, Users
} from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showDemo, setShowDemo] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    } else {
      setSelectedFile(null);
      setPreview(null);
      setError("Please select a valid image file (jpg, jpeg, png)");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const mockResults = [
          {
            plant_type: "Tomato",
            disease_type: "Bacterial_spot",
            confidence: 0.95,
            image_shape: [224, 224]
          },
          {
            plant_type: "Tomato",
            disease_type: "Healthy",
            confidence: 0.04,
            image_shape: [224, 224]
          },
          {
            plant_type: "Potato",
            disease_type: "Early_blight",
            confidence: 0.01,
            image_shape: [224, 224]
          }
        ];
        setPrediction(mockResults[0]);
        setError(null);
        setLoading(false);
      }, 1500);
      
      /* Uncomment this when your backend is ready
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const result = await response.json();
      setPrediction(result);
      setError(null);
      */
    } catch (err) {
      setError(err.message);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoImage = () => {
    setShowDemo(false);
    setPreview('/api/placeholder/500/400');
    setSelectedFile({ name: 'demo-plant.jpg' });
    setPrediction(null);
    setError(null);
  };

  const getTreatmentRecommendation = (plant, disease) => {
    const treatments = {
      'Corn': {
        'Common_rust': 'Apply fungicides containing pyraclostrobin, azoxystrobin, or propiconazole. Ensure proper spacing between plants for good air circulation. Remove and destroy infected leaves when possible.',
      },
      'Potato': {
        'Early_blight': 'Apply fungicides containing chlorothalonil or copper-based products. Improve air circulation by proper spacing. Use mulch to prevent soil-leaf contact. Remove infected leaves and practice crop rotation.',
      },
      'Tomato': {
        'Bacterial_spot': 'Apply copper-based bactericides early. Avoid overhead irrigation. Practice crop rotation. Remove and destroy infected plants. Use resistant varieties when available for future plantings.',
      }
    };
    
    return treatments[plant]?.[disease] || 'Consult with a local agricultural extension office for specific treatment recommendations.';
  };

  const renderHome = () => (
    <>
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-emerald-800">Protect Your Crops with AI</h1>
            <p className="text-xl text-gray-600">
              PlantGuard AI uses advanced machine learning to detect plant diseases instantly. 
              Upload a leaf image and get accurate results in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('file-upload').click()} 
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg flex items-center font-medium hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
              >
                <UploadCloud className="h-5 w-5 mr-2" />
                Upload Image
              </button>
              <button 
                onClick={() => setShowDemo(true)} 
                className="px-6 py-3 bg-white text-emerald-700 border border-emerald-600 rounded-lg flex items-center font-medium hover:bg-emerald-50 transition shadow-md hover:shadow-lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Try Demo
              </button>
            </div>
          </div>
          <div className="hidden md:block">
          <img src={plantImage} alt="Plant analysis illustration" className="w-[700px] h-[300px] md:w-[600px] md:h-[250px] lg:w-[700px] lg:h-[250px] rounded-xl shadow-xl object-cover" />



          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Upload Section */}
          <div className="md:w-1/2 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Upload Leaf Image</h2>
              <div 
                className={`border-3 border-dashed rounded-xl p-8 transition duration-300 ${
                  isDragActive 
                    ? 'border-emerald-500 bg-emerald-100' 
                    : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <UploadCloud className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    {isDragActive ? 'Drop your image here' : 'Drag & Drop your leaf image'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">JPG, JPEG or PNG up to 10MB</p>
                  
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="flex justify-center gap-4">
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 transition duration-300 inline-flex items-center shadow-md"
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Browse Files
                    </label>
                    <button
                      onClick={() => document.getElementById('camera-input').click()}
                      className="px-4 py-2 bg-white text-emerald-700 border border-emerald-600 rounded-lg cursor-pointer hover:bg-emerald-50 transition duration-300 inline-flex items-center shadow-sm"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </button>
                    <input 
                      type="file" 
                      id="camera-input" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
              {selectedFile && (
                <p className="mt-3 text-sm text-gray-600 flex items-center">
                  <Check className="h-4 w-4 text-emerald-500 mr-2" />
                  Selected: <span className="font-medium ml-1">{selectedFile.name}</span>
                </p>
              )}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              className={`w-full py-3 rounded-lg font-medium text-lg transition duration-300 shadow-md ${
                !selectedFile || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Analyzing Leaf...
                </span>
              ) : (
                'Analyze Leaf'
              )}
            </button>
            
            {error && (
              <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-start border border-red-200">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>
          
          {/* Preview & Results Section */}
          <div className="md:w-1/2 p-8 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">
              {prediction ? 'Analysis Results' : 'Image Preview'}
            </h2>
            
            {preview ? (
              <div className="relative mb-6 bg-white p-2 rounded-lg shadow-md">
                <img
                  src={preview}
                  alt="Leaf preview"
                  className="w-full h-72 object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg h-72 flex flex-col items-center justify-center bg-white mb-6">
                <img 
                  src="/api/placeholder/200/200" 
                  alt="Plant placeholder" 
                  className="w-32 h-32 opacity-30 mb-4" 
                />
                <p className="text-gray-400">No image selected</p>
              </div>
            )}
            
            {prediction ? (
              <div className="bg-white border border-emerald-200 rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-emerald-800 text-xl">
                    {prediction.plant_type}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prediction.disease_type === 'Healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {prediction.disease_type.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-600 font-medium">Confidence Level</p>
                      <p className="text-sm font-bold text-emerald-700">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(prediction.confidence * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Image Size</p>
                      <p className="font-medium text-gray-800">
                        {prediction.image_shape[1]} x {prediction.image_shape[0]} px
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Detection Time</p>
                      <p className="font-medium text-gray-800">1.5 seconds</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-2 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Treatment Recommendation
                    </h4>
                    <p className="text-gray-700">
                      {getTreatmentRecommendation(prediction.plant_type, prediction.disease_type)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                <div className="text-center py-4">
                  <Leaf className="h-12 w-12 text-emerald-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Ready to Analyze</h3>
                  <p className="text-gray-500 text-sm">Upload a leaf image and click Analyze to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center text-emerald-800 mb-12">How PlantGuard AI Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">1. Upload</h3>
            <p className="text-gray-600">
              Take a clear photo of the plant leaf showing potential disease symptoms and upload it to our platform.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">2. Analyze</h3>
            <p className="text-gray-600">
              Our AI processes the image using a deep neural network trained on thousands of plant disease examples.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">3. Treat</h3>
            <p className="text-gray-600">
              Receive accurate disease identification and actionable treatment recommendations to protect your crops.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center text-emerald-800 mb-12">Trusted by Farmers</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Michael Thompson</h3>
                <p className="text-gray-500 text-sm">Crop Farmer, Idaho</p>
              </div>
            </div>
            <p className="text-gray-600">
              "This tool helped me identify early blight in my potato crop before it spread. The treatment recommendations were spot on!"
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Sarah Johnson</h3>
                <p className="text-gray-500 text-sm">Organic Grower, California</p>
              </div>
            </div>
            <p className="text-gray-600">
              "As an organic farmer, early detection is crucial. PlantGuard AI helps me stay ahead of potential issues without constant expert consultation."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">David Rodriguez</h3>
                <p className="text-gray-500 text-sm">Agricultural Consultant</p>
              </div>
            </div>
            <p className="text-gray-600">
              "I recommend this tool to all my clients. It's like having a plant pathologist in your pocket - accurate and incredibly easy to use."
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderAbout = () => (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold text-emerald-800 mb-6">About PlantGuard AI</h2>
        
        <img 
          src="/api/placeholder/800/400" 
          alt="PlantGuard team working in field" 
          className="w-full h-64 object-cover rounded-xl mb-8" 
        />
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>
            PlantGuard AI empowers farmers and agricultural professionals with state-of-the-art 
            disease detection technology. Our mission is to increase crop yields, reduce pesticide use, 
            and promote sustainable farming practices through early and accurate disease identification.
          </p>
          
          <h3 className="text-xl font-bold text-emerald-700 mt-8 mb-4">Our Technology</h3>
          
          <p>
            Our plant disease detection system uses advanced deep learning to identify diseases in crop plants 
            from leaf images. The core of our technology is a convolutional neural network (CNN) trained on 
            a dataset of over 50,000 labeled images of plant diseases.
          </p>
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 my-6">
            <h4 className="font-bold text-emerald-800 mb-3">Currently Supported Plants & Diseases</h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-semibold text-emerald-700 mb-2">Tomato</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Bacterial Spot</li>
                  <li>Early Blight</li>
                  <li>Late Blight</li>
                  <li>Leaf Mold</li>
                  <li>Septoria Leaf Spot</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-emerald-700 mb-2">Potato</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Early Blight</li>
                  <li>Late Blight</li>
                  <li>Black Scurf</li>
                  <li>Common Scab</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-emerald-700 mb-2">Corn</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Common Rust</li>
                  <li>Northern Leaf Blight</li>
                  <li>Gray Leaf Spot</li>
                  <li>Southern Rust</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-emerald-700 mt-8 mb-4">How It Works</h3>
          
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Image Capture</strong>: Take a clear photo of an affected plant leaf, ensuring good lighting and focus.
            </li>
            <li>
              <strong>Upload & Processing</strong>: Our system preprocesses the image, normalizing size and color.
            </li>
            <li>
              <strong>AI Analysis</strong>: Our deep learning model analyzes the leaf characteristics to identify disease patterns.
            </li>
            <li>
              <strong>Results & Recommendations</strong>: Within seconds, receive disease identification with confidence scores and recommended treatments.
            </li>
          </ol>
          
          <h3 className="text-xl font-bold text-emerald-700 mt-8 mb-4">Our Team</h3>
          
          <p>
            PlantGuard AI was founded by a team of agricultural scientists and AI specialists committed to 
            sustainable farming practices. Our interdisciplinary approach combines expertise in plant pathology, 
            machine learning, and agricultural extension to deliver accurate and practical solutions.
          </p>
          
          <p>
            We work closely with agricultural extension offices, research universities, and farming communities 
            to continually improve our models and ensure our recommendations align with best practices.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 text-gray-800">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-800">PlantGuard AI</span>
            </div>
            
            <div className="flex space-x-2 sm:space-x-6">
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center ${
                  activeTab === 'home' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                <span>Home</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center ${
                  activeTab === 'about' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Info className="h-4 w-4 mr-2" />
                <span>About</span>
              </button>
              
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition duration-300 flex items-center"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        {activeTab === 'home' ? renderHome() : renderAbout()}
        
        {/* Footer */}
      {/* Footer */}
<footer className="mt-20 bg-white rounded-2xl shadow-lg overflow-hidden">
  <div className="max-w-7xl mx-auto py-8 px-8">
    <div className="grid md:grid-cols-3 gap-8">
      {/* Brand Info */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold text-emerald-800">PlantGuard AI</span>
        </div>
        <p className="text-gray-600 mb-4">
          Empowering farmers with AI-driven plant disease detection technology for healthier crops and sustainable agriculture.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-emerald-600 transition">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-emerald-600 transition">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.926 4.926 0 004.604 3.417 9.897 9.897 0 01-6.115 2.107c-.396 0-.788-.023-1.176-.068a13.92 13.92 0 007.557 2.213c9.053 0 14-7.496 14-13.986 0-.213 0-.426-.016-.637A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
        </div>
      </div>
      
      {/* Navigation */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Home</a></li>
          <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">About Us</a></li>
          <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Services</a></li>
          <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Blog</a></li>
          <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Contact</a></li>
        </ul>
      </div>
      
      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
        <p className="text-gray-600">123 Greenfield Ave, Agriculture City, Earth</p>
        <p className="text-gray-600">Email: support@plantguardai.com</p>
        <p className="text-gray-600">Phone: +123 456 7890</p>
      </div>
    </div>
    
    {/* Copyright */}
    <div className="border-t mt-8 pt-4 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} PlantGuard AI. All Rights Reserved.
    </div>
  </div>
</footer>

      </div>
    </div>
  );
}

export default App;