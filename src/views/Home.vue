<template>
  <div id="app">
    <Header subtitle="Home"/>
    <img
      src="..\assets\onlineshop.png"
      width="200"
      alt="Logo"
    />
    <hr/>
    <Comments/>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  import Comments from '@/components/Comments.vue'
  import { mapActions,  mapState } from 'vuex';

  export default {
    name: 'Home',
    
    components: {
      Header,
      Comments
    },

    computed: {
      ...mapState([
        'comments'
      ])
    },

    methods: {
      ...mapActions([
        'fetchComments'
      ])
    },

    mounted() {
        this.fetchComments();
    },
  }
</script>
