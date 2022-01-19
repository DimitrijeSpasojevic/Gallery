<template>
  <div id="app">
    <Header subtitle="Home"/>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/The_Metropolitan_Museum_of_Art_Logo.svg/1028px-The_Metropolitan_Museum_of_Art_Logo.svg.png"
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
