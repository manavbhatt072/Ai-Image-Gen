🎨 AI Image Generator with Multi-Model Support

This is a simple and powerful AI Image Generation Web App built using HTML, CSS, JavaScript, and Hugging Face's Inference API. The app allows users to generate stunning AI-generated images from text prompts using multiple state-of-the-art models.

🚀 Features

🔑 Uses Hugging Face API Key for secure access to image generation models.
🎯 Supports multiple AI image generation models:
black-forest-labs/FLUX.1-dev
black-forest-labs/FLUX.1-schnell
stabilityai/stable-diffusion-xl-base-1.0
prompthero/openjourney
💬 Users can input text prompts to generate AI images instantly.
🖼️ Choose number of images and aspect ratio before generating.
🌗 Light/Dark Theme Toggle for better user experience.
📤 Image cards with downloadable previews.
⚡ Fully client-side: fast, clean, and lightweight frontend.

🛠️ Built With

HTML – for the page structure
CSS – for styling and responsive layout
JavaScript – for logic, event handling, and API requests
Hugging Face Inference API – to fetch AI-generated images from selected models

📦 Installation

git clone https://github.com/your-username/ai-image-generator.git
cd ai-image-generator

# Open index.html in your browser

Make sure to add your Hugging Face API key in your script.js file.
const API_KEY = "your_huggingface_api_key_here";
