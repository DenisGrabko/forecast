// Потрібно створити функціонал для отримання прогнозу погоди в місті.
// Використай публічне API https://www.weatherapi.com/docs/
// Використовуй ендпоінт Forecast для того, щоб отримати прогноз погоди на декілька днів.

// Створи форму в яку користувач:
// 1 вводить назву міста.
// 2 обирає на яку кількість днів він хоче отримати прогноз погоди (3, 5 та 7 днів).
// (Іноді параметр не працює в такому випадку можна зробити пошук на 1, 2 та 3 дні)

// Після сабміту форми відмалюй картки з інформацією отриманою з бекенду.
// Картка має містити відомості про:
// 1 Зображення з погодою (icon)
// 2 Текст з погодою (text)
// 3 Дату (date)
// 4 Середню температуру в Цельсія (avgtemp_c)
// Приклад картки https://prnt.sc/h_p-A6Hty-i-

/*
1. збираємо рефси
2. вішаємо на форму обробник подій по сабміту
    2.1. зупиняємо поведінку браузера за замовчуванням (event.preventDefault())
    2.2. витягуємо з форми інформацію про місто і кількість днів
    2.3. робимо запит з інформцією, яку ми зібрали з полів (окрема ф-ція)
    2.4. відмальовуємо розмітку (окрема ф-ція))
*/
const refs = {
   form: document.querySelector(".js-search-form"),
   list: document.querySelector(".js-list"),
};

refs.form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const { city, days } = event.currentTarget.elements;

  serviceWeather(city.value, days.value).then((data) => {
    refs.list.innerHTML = createMarkup(data.forecast.forecastday);
  })
  .catch((err) => console.log(err))
  .finally(() => refs.form.reset())
}

function serviceWeather(city, days) {
  const BASE_URL = "https://api.weatherapi.com/v1";
  const API_KEY = "61fa302bef9a4da28e9100055230710";

  const params = new URLSearchParams({
    key: API_KEY,
    q: city,
    days,
    lang: "uk",
  });  
  

const url = `${BASE_URL}/forecast.json?${params}`;
    return fetch(url).then((response) => {
    if(!response.ok) {
      throw new Error(`Вимушена помилка статусу: ${response.status} | Причина: ${response.statusText}`)
    }

    return response.json();
  })
}


  

function createMarkup (arr) {
  return arr.map(({
    date, 
     day: {
     avgtemp_c,
     condition: { text, icon },
    }

}) => `<li class="weather-card">
     <img src="${icon}" alt="${text}" class="weather-icon">
     <h2 class="date">${date}</h2>
     <h3 class="weather-text">${text}</h3>
     <h3 class="temperature">${avgtemp_c} °C</h3>
     </li>
`).join("");
}

function resolveAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function add1(x) {
  const a = await resolveAfter2Seconds(20);
  const b = await resolveAfter2Seconds(30);
  return x + a + b;
}

add1(10).then((v) => {
  console.log(v); // prints 60 after 4 seconds.
});

async function add2(x) {
  const a = resolveAfter2Seconds(20);
  const b = resolveAfter2Seconds(30);
  return x + (await a) + (await b);
}

add2(10).then((v) => {
  console.log(v); // prints 60 after 2 seconds.
});
