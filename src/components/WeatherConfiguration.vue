<template>
    <div class="weather__configuration">
        <header class="weather__configuration-header">
            <h3 class="weather__configuration-title">Settings</h3>
            <button>Close</button>
        </header>
        <draggable 
  v-model="cities" 
  handle=".weather__configuration__item-hamburger"
  @start="drag=true" 
  @end="drag=false" 
  item-key="id">
  <template #item="{element}">
    <div class="weather__configuration__item">
        <button class="weather__configuration__item-hamburger">Ham</button>
        <span class="weather__configuration__item-city">{{ element.name }}, {{ element.country ? element.country : "Ne" }}</span>
        <button class="weather__configuration__item-delete" @click="deleteCity(element)">Del</button>
    </div>
   </template>
</draggable>
        <div class="weather__configuration__location">
            <label class="weather__configuration__location-label" for="input">Add Location: </label>
                <input type="text" class="weather__configuration__location-input" id="input" v-model="inputCity">
                <button class="weather__configuration__location-button" @click="addCity">Add</button>
        </div>
    </div>

</template>


<script setup>
import {ref, onMounted, defineProps} from "vue";
import draggable from 'vuedraggable';

let props = defineProps({
    citiesArray: Array,
});

let cities = ref([{
    name: "Ekaterinburg",
    country: "RU",
},
{
    name: "Moscow",
    country: "RU",
}
]);

let inputCity = ref("");
let newCity = ref({});
let drag = ref(false);


let addCity = () => {
    newCity.value.name = inputCity.value;
    cities.value.push(newCity.value);
}

let deleteCity = (element) => {
    cities.value = cities.value.filter((city, index) => {
       return city !== element;
    })
}

onMounted(() => {
    console.log(props.citiesArray);
})


</script>

<style>



.weather__configuration{
    border: 1px solid black;
}
.weather__configuration__item{
    background-color: rgb(21, 115, 192);
    border: 1px solid black;
    color: white;

    width: 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.weather__configuration__item-hamburger{
    cursor: pointer;    
}

.weather__configuration-header{
    display: flex;
    justify-content: space-between;
}

.weather__configuration__location-label{
    display: block;
}

</style>