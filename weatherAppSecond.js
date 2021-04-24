const temperatureSelector = document.querySelector('#temperature-units');

let unit;

unitSelector();

console.log(unit);

let cityName = 'london';
let countryName = 'uk'

let apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;

let weatherData = [];

const functionalites = (data) => {
  recordingData(data);
}

const graphing = () => {
  let ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Temperature', 'Feels Like', 'Maximum Temperature', 'Minimum Temperature'],
          datasets: [{
              label: 'Temperature',
              data: [],
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

const weatherApi = async (apiLink) => {  
  const responseFlow = await fetch(apiLink);
  const data = await responseFlow.json();
  functionalites(data);

  weatherData.slice(1, weatherData.length);
  weatherData.push(data.main.temp);
}

weatherApi(apiLink);

document.addEventListener('click', (event) => {
  const elementId = event.target.id;

  switch (elementId) {
    case "submit":
      cityName = document.querySelector('#location').value;
      apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;
      weatherApi(apiLink);
      break;
  }
})
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

// Helper function to give values to the HTML elements
function recordingData(data) {
  document.querySelector('object').setAttribute('data', `/animated/${data.weather[0].icon}.svg`)
  selectElementTemplate('main', data.weather[0].main);
  selectElementTemplate('description', data.weather[0].description);
  selectElementTemplate('temperature', `${data.main.temp} ${unit}`);
  selectElementTemplate('feels-like', `${data.main.feels_like} ${unit}`);
  selectElementTemplate('minimum-temperature', `${data.main.temp_min} ${unit}`);
  selectElementTemplate('maximum-temperature', `${data.main.temp_max} ${unit}`);
  selectElementTemplate('humidity', data.main.humidity);
}

function selectElementTemplate(elementId, value) {
  return document.querySelector(`#${elementId}`).textContent = value;
}

function unitSelector() {
  if (temperatureSelector.value === 'celsius') {
    unit = '°C'
  } else if (temperatureSelector.value === 'fahrenheit') {
    unit = '°F'
  } else if (temperatureSelector.value === 'kelvin') {
    unit = 'K'
  }

  return unit
}