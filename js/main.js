const $ = (selector) => document.querySelector(selector);
const appId = window.APP_KEY;

let cities = [];

const getCityTemplate = (city) => {
  const imageUrl = `https://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`;
  const cityId = cities.indexOf(city);
  console.log(city);
  return `<div class="card" style="width: 18rem;">
  <h5 class="card-title m-3 text-white bg-dark p-1">${city.name}, ${city.sys.country}</h5>
  <img src="${imageUrl}" class="card-img-top" alt="weather icon">
  <div class="card-body">
  <h3 class="card-title m-2 text-white bg-dark p-1">${Math.round(
    parseInt(city.main.temp)
  )}°C in ${city.name}</h3>
  <h6 class="card-subtitle m-2 text-white bg-dark p-1">${city.weather[0].description}</h6>
  <h6 class="card-subtitle m-2 text-white bg-dark p-1">Feels like ${Math.round(parseInt(city.main.feels_like))}°C</h6>
  <a href="#" id="${cityId}" onclick='deleteCity(this)' class="card-link btn btn-primary bg-warning m-2 btn-Delete">Delete</a>
  </div>
</div>`
};

const deleteCity = (btn) => {
  cities.splice(btn.id,1);
  localStorage.cities = JSON.stringify(cities);
  refreshCities();
};

const refreshCities = () => {
  const container = $("#savedCities");
  const renderedCities = cities.map(getCityTemplate);
  container.innerHTML = renderedCities.join(' ');
};

const displayCity = (data) => {
  cities.push(data);
  localStorage.setItem("cities", JSON.stringify(cities));
  refreshCities();
};

const loadWeather = (request) => {
  fetch(request)
    .then((response) => response.json())
    .then(displayCity);
};

const searchCity = () => {
  const city = $("#inputCity").value;
  const request = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=metric`;
  loadWeather(request);
};

const searchByLocation = () => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const request = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${appId}&units=metric`;
    loadWeather(request);
  });
};

const main = () => {
  $("#btnSearch").addEventListener("click", searchCity);
  $("#btnLocation").addEventListener("click", searchByLocation);
  const savedCities = localStorage.getItem("cities");
  if (savedCities) {
    cities = JSON.parse(savedCities);
    refreshCities();
  }
};
