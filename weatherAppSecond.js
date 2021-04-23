let cityName = 'london';

let dataArray = [];

let apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;

const displayWeatherData = (data) => {
  addingData(data);

  dataArray.push(data.main.temp.toString());
  dataArray.push(data.main.feels_like.toString());
  dataArray.push(data.main.temp_min.toString());
  dataArray.push(data.main.temp_max.toString());
}

console.log(dataArray);

const graphing = () => {
  let ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Temperature', 'Feels Like', 'Maximum Temperature', 'Minimum Temperature'],
          datasets: [{
              label: 'Temperature',
              data: dataArray,
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

graphing();

const weatherApi = async (apiLink) => {
  const responseFlow = await fetch(apiLink);
  const data = await responseFlow.json();
  displayWeatherData(data);
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
      cityName = document.querySelector('#location').value;
      apiLink = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=469f04c0b3bc1ee6ca83abdfb8c7e6d3&units=metric`;
      weatherApi(apiLink);
      break;
  }
})

function addingData(data) {
  document.querySelector('object').setAttribute('data', `/animated/${data.weather[0].icon}.svg`)
  selectElementTemplate('main', data.weather[0].main);
  selectElementTemplate('description', data.weather[0].description);
  selectElementTemplate('temperature', data.main.temp);
  selectElementTemplate('feels-like', data.main.feels_like);
  selectElementTemplate('minimum-temperature', data.main.temp_min);
  selectElementTemplate('maximum-temperature', data.main.temp_max);
  selectElementTemplate('humidity', data.main.humidity);
}

function selectElementTemplate(elementId, value) {
  return document.querySelector(`#${elementId}`).textContent = value;
}