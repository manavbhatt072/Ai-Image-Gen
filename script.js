const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const generateBtn = document.querySelector(".generate-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");

const API_KEY = ' '; // Replace with your actual Hugging Face API key

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains"
];

// Apply saved or system theme on load
(() => {
  const saveTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkTheme = saveTheme === "dark" || (!saveTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();

// Toggle theme button
const toggleTheme = () => {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
};

// Calculate width & height from aspect ratio
const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);

  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  // Ensure dimensions are multiples of 16
  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

  return { width: calculatedWidth, height: calculatedHeight };
};

// Update a single image card with generated image
const updateImageCard = (imgIndex, imgUrl) => {
  const imgCard = document.getElementById(`img-card-${imgIndex}`);
  if (!imgCard) return;

  imgCard.classList.remove("loading");
  imgCard.innerHTML = `
    <img src="${imgUrl}" class="result-img"/>
    <div class="img-overlay">
      <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
        <i class="fa-solid fa-download"></i>
      </a>
    </div>
  `;
};

// Generate images using Hugging Face API
const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
  const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${selectedModel}`;
  const { width, height } = getImageDimensions(aspectRatio);
  generateBtn.setAttribute("disabled", "true");

  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      const response = await fetch(MODEL_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "x-use-cache": "false",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: promptText,
          parameters: { width, height },
          option: { wait_for_model: true, use_cache: false },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }

      const result = await response.blob();
      updateImageCard(i, URL.createObjectURL(result));
    } catch (error) {
      console.error("Generation error:", error.message);
      const imgCard = document.getElementById(`img-card-${i}`);
      imgCard.classList.replace("loading", "error");
      imgCard.querySelector(".status-text").textContent = "Generation failed! Check console.";
    }
  });

  await Promise.allSettled(imagePromises);
  generateBtn.removeAttribute("disabled");
};

// Create loading cards
const createImageCards = (selectedModel, imageCount, aspectRatio, promptText) => {
  gridGallery.innerHTML = "";
  for (let i = 0; i < imageCount; i++) {
    gridGallery.innerHTML += `
      <div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
        <div class="status-container">
          <div class="spinner">
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
            <div class="three-body__dot"></div>
          </div>
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p class="status-text">Generating...</p>
        </div>
      </div>`;
  }

  generateImages(selectedModel, imageCount, aspectRatio, promptText);
};

// Handle form submit
const handleFormSubmit = (e) => {
  e.preventDefault();

  const selectedModel = modelSelect.value.trim(); // <-- important fix
  const imageCount = parseInt(countSelect.value) || 1;
  const aspectRatio = ratioSelect.value || "1/1";
  const promptText = promptInput.value.trim();

  createImageCards(selectedModel, imageCount, aspectRatio, promptText);
};

// Random prompt button
promptBtn.addEventListener("click", () => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptInput.value = prompt;
  promptInput.focus();
});

// Event listeners
promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);
