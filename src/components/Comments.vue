<template>
  <div>
    <h4>User Comments</h4>

    <div v-if="token">
      <b-form-input
        v-model="comment"
        placeholder="Say something..."
        @keydown.enter="onSubmit"
      ></b-form-input>

      <b-card v-for="comment in comments" :title="'Komentar'" :key="comment.id">
        <b-card-text>
          User with id:{{comment.userId}} - {{ comment.body }}
        </b-card-text>
      </b-card>
    </div>
    <p v-else>You must be signed in to leave a comment</p>
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'Comments',

    data() {
      return {
        comment: ''
      }
    },

    computed: {
      ...mapState([
        'token',
        'comments'
      ])
    },

    methods: {
      ...mapActions([
        'postComment'
      ]),

      onSubmit() {
        this.$socket.emit('comment', { body: this.comment, token: this.token });
        this.comment = '';
      }
    }
  }

</script>

<style scoped>
  .card {
    margin-top: 10px;
    text-align: left;
  }

  .card-title {
    margin-bottom: 0px;
  }

  .card-body {
    padding-bottom: 5px;
  }
</style>