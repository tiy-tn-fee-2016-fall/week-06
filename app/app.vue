<template lang="html">
  <div class="app">
    <h1>{{ apod.title }}</h1>

    <img :src="apod.url" :alt="apod.title" width="100%"/>
  </div>
</template>

<script>
import Vue from 'vue';

const apiKey = process.env.API_KEY;

export default Vue.extend({
  data() {
    return {
      apod: {},
      comments: [],
    };
  },

  mounted() {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
      .then((r) => r.json())
      .then((data) => {
        this.apod = data;
      });
  }
});
</script>
