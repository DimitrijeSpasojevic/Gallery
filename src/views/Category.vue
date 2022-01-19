<template>
  <div id="app">
    <Header :subtitle="`Welcome to category ` + subtitle"/>
    <ul id="example-1">
      <li v-for="pr in products" :key="pr.id">
        <Product :description="pr.description" :price="pr.price" :name="pr.name"/>
      </li>
</ul>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import Product from '@/components/Product';
  import { mapActions,  mapState } from 'vuex';

  export default {
    name: 'Category',
    
    components: {
      Header,
      Product
    },

    data() {
        return {
            subtitle: '',
            catID: null,
        }
    },

    computed: {
      ...mapState([
        'products'
      ])
    },


    watch: {
      $route() {
        this.subtitle = this.$route.params.name;
        this.catID = this.$route.params.id;

        this.fetchIDsByCategory(this.catID);
      }
    },

    methods: {
      ...mapActions([
        'fetchIDsByCategory'
      ])
    },

    mounted() {
        this.subtitle = this.$route.params.name;
        this.catID = this.$route.params.id;

        this.fetchIDsByCategory(this.catID);
    },
  }
</script>

<style scoped>

</style>
