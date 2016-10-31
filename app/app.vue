<template lang="html">
  <div class="app">

    <h1>{{ apod.title }}</h1>

    <div class="img-switcher">
      <button class="btn" v-on:click="goBack()">Back</button>
      <div class="frame">
        <img :src="apod.url" :alt="apod.title"/>
      </div>
      <button class="btn" v-on:click="goForward()">Forward</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';

const apiKey = process.env.API_KEY;

export default Vue.extend({
  data() {
    return {
      date: moment(),
      apod: {},
      comments: [],
    };
  },

  mounted() {
    this.getNasaData();
  },

  methods: {
    getNasaData() {
      const dateFormatted = this.date.format('YYYY-MM-DD');

      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateFormatted}`)
        .then((r) => r.json())
        .then((data) => {
          this.apod = data;
        });
    },
    goBack() {
      // Figure out the new date to look at
      this.date.subtract(1, 'days');

      // Make a new request to the API
      // Reset the "apod" value
      this.getNasaData();
    },
    goForward() {
      // Figure out the new date to look at
      this.date.add(1, 'days');

      // Make a new request to the API
      // Reset the "apod" value
      this.getNasaData();
    }
  }
});
</script>
