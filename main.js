// DOM Elements
const elements = {
  cityInput: document.getElementById("cityInput"),
  addButton: document.getElementById("add"),
  cityOutput: document.getElementById("cityOutput"), // Consistent with HTML
  descOutput: document.getElementById("description"),
  tempOutput: document.getElementById("temp"),
  windOutput: document.getElementById("wind")
};

// Constants
const API_KEY = "66d2d2cdbf52a29baf09c18cf2116b3a";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Utility Functions
const convertToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

const showLoading = () => {
  elements.cityOutput.innerHTML = "در حال بارگذاری...";
  [elements.descOutput, elements.tempOutput, elements.windOutput].forEach(el => el.innerHTML = "");
};

const showError = (message) => {
  elements.cityOutput.innerHTML = `<span class="text-danger">${message}</span>`;
  [elements.descOutput, elements.tempOutput, elements.windOutput].forEach(el => el.innerHTML = "");
};

// Weather Functions
async function getWeather(city) {
  showLoading();
  try {
      const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}`);
      if (!response.ok) {
          throw new Error(response.status === 404 ? "شهر یافت نشد" : "خطا در دریافت اطلاعات");
      }
      const data = await response.json();
      displayWeather(data);
  } catch (error) {
      showError(error.message);
  }
}

function displayWeather(data) {
  const { name: cityName, weather, main: { temp }, wind: { speed } } = data;
  elements.cityOutput.innerHTML = `شهر: ${cityName}`;
  elements.descOutput.innerHTML = `وضعیت: ${weather[0].description}`;
  elements.tempOutput.innerHTML = `دما: ${convertToCelsius(temp)}°C`;
  elements.windOutput.innerHTML = `سرعت باد: ${speed} کیلومتر/ساعت`;
}

// Event Listeners
function initializeApp() {
  elements.addButton.addEventListener("click", (e) => {
      e.preventDefault();
      const city = elements.cityInput.value.trim();
      if (city) getWeather(city);
      else showError("لطفاً نام شهر را وارد کنید");
  });

  elements.cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
          elements.addButton.click();
      }
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);