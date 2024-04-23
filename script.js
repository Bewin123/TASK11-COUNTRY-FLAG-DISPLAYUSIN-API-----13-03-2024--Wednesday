// Function to fetch data from OpenWeatherMap API
const fetchWeatherData = async (capital, countryCode) => {
  try {
    const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital},${countryCode}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Error fetching Weather data", error);
    return null; // Return null if there's an error
  }
};

// Function to render Bootstrap card with country data and weather information
const renderCountryCard = async (country) => {
  const cardContainer = document.getElementById("card-container");

  const card = document.createElement("div");
  card.className = "col-lg-4 col-md-6 mb-4"; // Bootstrap grid classes

  // Fetch weather data for the country
  const weatherData = await fetchWeatherData(
    country.capital?.[0],
    country.cca2
  );

  // Determine weather information to display
  let weatherInfo = "";
  if (
    weatherData &&
    weatherData.main &&
    weatherData.main.temp !== undefined &&
    weatherData.weather &&
    weatherData.weather.length > 0
  ) {
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    weatherInfo = `Temperature: ${temperature}°C, Description: ${description}`;
  }  

  card.innerHTML = `
        <div class="card">
            <div class="card-header">${country.name.common}</div>
            <img src="${country.flags.png}" class="card-img-top" alt="Flag">
            <div class="card-body">
                <p class="card-text">
                    <strong>Capital:</strong> ${
                      country.capital?.[0] || "N/A"
                    }<br>
                    <strong>Region:</strong> ${country.region || "N/A"}<br>
                    <strong>Country Code:</strong> ${country.cca2 || "N/A"}<br>
                    <strong>Latitude:</strong> ${
                      country.latlng?.join(", ") || "N/A"
                    }<br>
                    <strong></strong> ${weatherInfo}
                </p>
            </div>
        </div>
    `;

  cardContainer.appendChild(card);
};

// Fetch and render country data
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const countriesData = await fetchRestCountries();

    const cardContainer = document.getElementById("card-container");
    cardContainer.className = "row"; // Add Bootstrap row class

    for (const country of countriesData) {
      await renderCountryCard(country);
    }
  } catch (error) {
    console.error("Error fetching and rendering country data", error);
  }
});

// Function to fetch data from Rest Countries API
const fetchRestCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error(
        `Error fetching Rest Countries data: ${response.statusText}`
      );
    }
    const countriesData = await response.json();
    return countriesData;
  } catch (error) {
    console.error("Error fetching Rest Countries data", error);
    return [];
  }
};
