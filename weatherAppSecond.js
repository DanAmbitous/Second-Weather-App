const temperatureSelector = document.querySelector('#temperature-units');

// To display the temperature unit symbol
let unit;

let cityName = 'london';
let countryName = 'uk';

// To determine which temperature unit to use
let celsius = false;
let fahrenheit = false;
let kelvin = false;

let apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;

const graphing = (data) => {
  const { temp, feels_like, temp_min, temp_max } = data.main;

  visualUpdater('chart-section', 'chart', 'canvas');

  let ctx = document.getElementById('chart').getContext('2d');

  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Temperature', 'Feels Like', 'Maximum Temperature', 'Minimum Temperature'],
          datasets: [{
              label: 'Temperature',
              data: [temp, feels_like, temp_min, temp_max],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 2.5
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

const locationMap = (data) => {
  visualUpdater('map-section', 'map', 'div');

  const { lon, lat } = data.coord;

  const map = L.map('map').setView([lat, lon], 10);

  L.marker([lat, lon]).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 20,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
  }).addTo(map);
}

// Organizes the different sets of functions to be performed
const functionalites = (data) => {
  recordingData(data);
  temperatureIdentifier();
  temperatureModifier(data);
  graphing(data);
  locationMap(data);
  flagAssignment(data);
}

const temperatureIdentifier = () => {
  if (temperatureSelector.value === 'celsius') {
    celsius = false;
    fahrenheit = false;
    kelvin = false; 
    
    celsius = true;
    unit = '°C';

    console.log(unit);
  } else if (temperatureSelector.value === 'fahrenheit') {
    celsius = false;
    fahrenheit = false;
    kelvin = false; 

    fahrenheit = true;
    unit = '°F';

    console.log(unit);
  } else {
    celsius = false;
    fahrenheit = false;
    kelvin = false; 

    kelvin = true;
    unit = 'K'

    console.log(unit);
  }
}

console.log(countryFlagEmoji.get("US"));


const flagAssignment = (data) => {
  document.querySelector('#country-flag').innerHTML = countryFlagEmoji.get(data.sys.country).emoji;
}

// Grabs the URL of the API and runs functions
const weatherApi = async (apiLink) => {  
  const responseFlow = await fetch(apiLink);
  const data = await responseFlow.json();

  functionalites(data);
}

weatherApi(apiLink);

// Runs a function on a click
document.addEventListener('click', (event) => {
  const elementId = event.target.id;

  switch (elementId) {
    case "submit":
      cityName = document.querySelector('#city-name').value;
      apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;
      weatherApi(apiLink);
      break;
  }
})

// Runs a function on a specific keypress
document.addEventListener('keyup', (event) => {
  const elementId = event.key;

  switch (elementId) {
    case "Enter":
      cityName = document.querySelector('#city-name').value;
      countryName = document.querySelector('#country-name').value;
      apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;
      weatherApi(apiLink);
      break;
  }
})

// Runs a function when an input select element value changes
temperatureSelector.addEventListener('input', () => {
  weatherApi(apiLink);
})

// Fills in the weather datas to the HTML elements
function recordingData(data) {
  document.querySelector("#location-name").textContent = data.name;
  document.querySelector('object').setAttribute('data', `/animated/${data.weather[0].icon}.svg`)
  selectElementTemplate('main', data.weather[0].main);
  selectElementTemplate('description', data.weather[0].description)
  selectElementTemplate('humidity', data.main.humidity);
}

// Creates a template for assiging values to the HTML elements
function selectElementTemplate(elementId, value) {
  return document.querySelector(`#${elementId}`).textContent = value;
}

// If the value of the select element is celsius
function temperatureDataCelsius(data) {
  selectElementTemplate('temperature', `${data.main.temp} ${unit}`);
  selectElementTemplate('feels-like', `${data.main.feels_like} ${unit}`);
  selectElementTemplate('minimum-temperature', `${data.main.temp_min} ${unit}`);
  selectElementTemplate('maximum-temperature', `${data.main.temp_max} ${unit}`);
}

// If the value of the select element is farhenheit
function temperatureDataFarhenheit(data) {
  selectElementTemplate('temperature', `${((data.main.temp * 9/5) + 35).toFixed(2)} ${unit}`);
  selectElementTemplate('feels-like', `${((data.main.feels_like * 9/5) + 35).toFixed(2)} ${unit}`);
  selectElementTemplate('minimum-temperature', `${((data.main.temp_min * 9/5) + 35).toFixed(2)} ${unit}`);
  selectElementTemplate('maximum-temperature', `${((data.main.temp_max * 9/5) + 35).toFixed(2)} ${unit}`);
}

// If the value of the select element is kelvin
function temperatureDataKelvin(data) {
  selectElementTemplate('temperature', `${((data.main.temp + 273.15)).toFixed(2)} ${unit}`);
  selectElementTemplate('feels-like', `${((data.main.feels_like + 273.15)).toFixed(2)} ${unit}`);
  selectElementTemplate('minimum-temperature', `${((data.main.temp_min + 273.15)).toFixed(2)} ${unit}`);
  selectElementTemplate('maximum-temperature', `${((data.main.temp_max + 273.15)).toFixed(2)} ${unit}`);
}

function temperatureModifier(data) {
  if (celsius) {
    temperatureDataCelsius(data);
  } else if (fahrenheit) {
    temperatureDataFarhenheit(data);
  } else {
    temperatureDataKelvin(data);
  }
}

function visualUpdater(element, id, elementType) {
  let parentElement = document.querySelector(`#${element}`);
  parentElement.innerHTML = "";
  let childElement = document.createElement(elementType);
  childElement.setAttribute('id', id);
  parentElement.append(childElement);
}