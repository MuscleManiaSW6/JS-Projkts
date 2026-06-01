mainEl = document.getElementById("main-container");
formEl = document.getElementById("search-container");
inputEl = document.getElementById("search-input");
btnEl = document.getElementById("search-btn");
sectionEl = document.querySelector("#section-container");

let userLocation = [];

function myDatabase() {
    try {
        const storeCity = localStorage.getItem("city");
        if (storeCity) {
            userLocation = JSON.parse(storeCity);
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

myDatabase();

btnEl.addEventListener("click", async (e) => {
  e.preventDefault();
  let userCity = inputEl.value.trim();
  if (!userCity) {
    return;
  }

  sectionEl.innerHTML =  '';

  let weatherData = await fetchWeatherData(userCity);

  if(!weatherData) {
    console.log("no data available")
    return;
  }

  const essentialWeatherData = {
    city: weatherData.location.name,
    country: weatherData.location.country,
    temp: weatherData.current.temp_c,
    condition: weatherData.current.condition.text,
    timestamp: new Date().toString(),
  };

  userLocation.push(essentialWeatherData);

  createElement(essentialWeatherData);

  localStorage.setItem("city", JSON.stringify(userLocation));
});



async function fetchWeatherData(cityName) {
  const API_KEY = "159ff56ef1014dc78de100955262801";
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`,
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("error:", error);
  }
}

function createElement(Data) {
    spanEl = document.createElement("span");
    spanEl.classList.add('span-container');

    p1El = document.createElement("p");
    p2El = document.createElement("p");
    p3El = document.createElement("p");
    p4El = document.createElement("p");
    p5El = document.createElement("p");

    p1El.textContent = Data.city;
    p2El.textContent = Data.country;
    p3El.innerHTML = `${Data.temp}&deg;C`;
    p4El.textContent = Data.condition;
    p5El.textContent = Data.timestamp;

    spanEl.append(p1El, p2El, p3El, p4El, p5El);
    sectionEl.appendChild(spanEl);
  }