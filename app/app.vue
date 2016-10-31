<template lang="html">
  <div class="app">
    <h1>{{ apod.title }}</h1>

    <div class="img-switcher">
      <button class="btn" @click="goBack()">Back</button>
      <div class="frame">
        <img :src="apod.url" :alt="apod.title"/>
      </div>
      <button class="btn" @click="goForward()">Forward</button>
    </div>

    <div class="comments">
      <ul>
        <li v-for="comment in comments">
          <p class="comment-author">{{ comment.author }}</p>
          <p>{{ comment.body }}</p>
        </li>
      </ul>

      <form @submit.prevent="saveComment(form.author, form.body)">
        <input type="text" v-model="form.author">
        <textarea rows="8" cols="40" v-model="form.body"></textarea>
        <button>Submit</button>
      </form>
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
      form: {
        author: '',
        body: '',
      },
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
    },

    saveComment(author, body) {
      fetch('http://tiny-tn.herokuapp.com/collections/nasa-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author, body,
          date: this.date.format('YYYY-MM-DD')
        }),
      })
      .then(r => r.json())
      .then((comment) => {
        this.comments = [comment, ...this.comments];
      });

      this.form = {
        author: '',
        body: '',
      };
    }
  }
});
</script>
