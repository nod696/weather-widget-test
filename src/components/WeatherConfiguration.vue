<template>
  <div class="widget__config" v-if="!props.isClosed">
    <h3 class="widget__config-title">Settings</h3>
    <div class="weather__configuration">
      <draggable
        v-model="citiesArray"
        handle=".weather__configuration__item-hamburger"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="weather__configuration__item">
            <button class="weather__configuration__item-hamburger"></button>
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
          <input
            type="text"
            class="weather__configuration__location-input"
            id="input"
            v-model="inputCity"
          />
        </label>

        <button
          class="weather__configuration__location-button"
          @click="addCity"
        >
          <img
            class="weather__configuration__location-button-icon"
            src="../assets/add.png"
            alt=""
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, defineEmits, watchEffect } from "vue";
import draggable from "vuedraggable";
import { useFetchData } from "../composables/useFetchData";
let props = defineProps(["cities", "isClosed"]);
let citiesArray = ref(props.cities);

let inputCity = ref("");
let emit = defineEmits("changeData");
let drag = ref(false);


let addCity = async () => {
  let { weatherCityInfo } = await useFetchData(inputCity.value);
  citiesArray.value = [...citiesArray.value, ...weatherCityInfo.value];
};

let deleteCity = (element: object) => {
  citiesArray.value = citiesArray.value.filter(
    (city: object, index: number) => {
      return city !== element;
    }
  );
};

watchEffect(() => {
  emit("changeData", citiesArray.value);
});
</script>

<style>
.widget__config {
  width: 100%;
  height: 300px;
  position: absolute;
  top: 0;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
}
.weather__configuration {
  padding-top: 50px;
  background-color: rgb(189, 228, 247);
  width: 100%;
  height: 80%;
  transition: transform 0.2s linear;
}

.weather__configuration__item {
  background-color: rgb(160, 196, 226);
  -webkit-box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  color: white;
  margin: 0 auto;
  padding: 10px;
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather__configuration__item-hamburger {
  position: relative;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: transparent;
  border: none;
  border-top: 2px solid black;
}
.weather__configuration__item-hamburger:after {
  content: "";
  position: absolute;
  left: 0;
  top: 100%;
  width: 20px;
  height: 3px;
  background-color: black;
}
.weather__configuration__item-hamburger:before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 3px;
  background-color: black;
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
.weather__configuration__location {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.weather__configuration__location-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
}
.weather__configuration__location-button-icon {
  width: 25px;
  height: 25px;
}
</style>
