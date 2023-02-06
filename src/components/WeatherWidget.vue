<template>
  <section class="widget__container">
    <div class="widget__item" v-for="city in weatherItems" :key="city">
      <header class="widget__header">
        <h3 class="city">{{ isClosed ? city.name : "Settings" }}</h3>
        <button class="configuration__button" @click="openConfig">
          <img
            class="configuration__button-img"
            :src="isClosed ? './gear.png' : './close.png'"
            alt=""
          />
        </button>
      </header>
      <div class="widget__item-representaion" v-if="weatherData">
        <img
          class="widget__item-icon"
          :src="`http://openweathermap.org/img/wn/${weatherIcon}.png`"
          alt="icon-weather"
        />
        <span class="widget__item-degree" v-if="weatherData"
          >{{ weatherData.main.temp }} °C</span
        >
      </div>
      <div class="widget__item-info" v-if="weatherData">
        Feels like {{ weatherData.main["feels_like"] }}

        <div class="">
          {{ weatherData.weather[0].main }}
          {{ weatherData.weather[0].description }}
        </div>

        <div class="">
          {{ weatherData.wind.speed }}{{ weatherData.wind.deg }}
          {{ weatherData.main.pressure }}hPa
        </div>

        <div class="">
          Humidity: {{ weatherData.main.humidity }} Dew point: ? Visibility{{
            weatherData.visibility
          }}
        </div>
      </div>
    </div>
    <div class="weather__configuration">
      <header class="weather__configuration-header">
        <h3 class="weather__configuration-title">Settings</h3>
        <button>Close</button>
      </header>
      <draggable
        v-model="weatherItems"
        handle=".weather__configuration__item-hamburger"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="weather__configuration__item">
            <button class="weather__configuration__item-hamburger">Ham</button>
            <span class="weather__configuration__item-city"
              >{{ element.name }},
              {{ element.country ? element.country : "Ne" }}</span
            >
            <button
              class="weather__configuration__item-delete"
              @click="deleteCity(element)"
            >
              <img
                class="weather__configuration__item-delete-img"
                src="../assets/delete.png"
                alt=""
              />
            </button>
          </div>
        </template>
      </draggable>
      <div class="weather__configuration__location">
        <label class="weather__configuration__location-label" for="input"
          >Add Location:
        </label>
        <input
          type="text"
          class="weather__configuration__location-input"
          id="input"
          v-model="inputCity"
        />
        <button
          class="weather__configuration__location-button"
          @click="addCity"
        >
          Add
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import WeatherConfiguration from "./WeatherConfiguration.vue";
import { ref, onMounted } from "vue";

import draggable from "vuedraggable";

let inputCity = ref("");
let newCity = ref({});
let drag = ref(false);

let addCity = () => {
  newCity.value.name = inputCity.value;
  weatherItems.value.push(newCity.value);
};

let deleteCity = (element) => {
  weatherItems.value = weatherItems.value.filter((city, index) => {
    return city !== element;
  });
};

const API_KEY = "06b132db1e926d7c73ce52431bc7a68c";
let geoData = ref({
  latitude: null,
  longitude: null,
});
let weatherData = ref([]);
let weatherIcon = ref("");
let isClosed = ref(true);
let weatherItems = ref([
  {
    name: "Ekaterinburg",
    country: "RU",
  },
  {
    name: "Moscow",
    country: "RU",
  },
]);
async function getData() {
  weatherItems.value.forEach(async (city) => {
    let result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
    );
    let data = await result.json();
    weatherData.value.push(data);
    console.log(weatherData.value);
    weatherIcon.value = weatherData.value.weather[0].icon;
    return;
  });
}
function openConfig() {
  isClosed.value = !isClosed.value;
}
onMounted(async () => {
  navigator.geolocation.getCurrentPosition((position) => {
    geoData.value.latitude = position.coords.latitude;
    geoData.value.longitude = position.coords.longitude;
    getData();
  });
});
</script>

<style>
.widget__container {
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid black;
}

.widget__header {
  display: flex;
  justify-content: space-between;
}
.configuration__button {
  width: 50px;
  height: 50px;
  outline: none;
  border: none;
  background-color: transparent;
  background-size: cover;
}
.widget__item-degree {
  font-weight: 700;
  font-size: 20px;
}
.configuration__button-img {
  width: 50px;
  height: 50px;
}
.widget__item-icon {
  width: 100px;
  height: 100px;
}

.weather__configuration {
  border: 1px solid black;
}
.weather__configuration__item {
  background-color: rgb(160, 196, 226);
  border: 1px solid black;
  color: white;

  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather__configuration__item-hamburger {
  cursor: pointer;
}

.weather__configuration-header {
  display: flex;
  justify-content: space-between;
}

.weather__configuration__location-label {
  display: block;
}

.weather__configuration__item-delete {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
}
.weather__configuration__item-delete-img {
  width: 20px;
  height: 20px;
}
</style>
