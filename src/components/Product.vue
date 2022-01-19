<template>
    <div>
        <b-card
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
        >
        <b-card-text>
            <h3>Product: {{name}}</h3>
        </b-card-text>
        <b-card-text>
            Nesto vise o proizvodu: {{description}}
        </b-card-text>
        <b-card-text>
            Cena: {{price}}
        </b-card-text>
    <b-button href="#" @click="createOrder(price)" variant="primary">Buy</b-button>
  </b-card>
</div>
</template>

<script>

 import { mapActions, mapState, mapMutations } from 'vuex';

  export default {
    name: 'Product',

    props: {
      description: String,
      price: String,
      name: String
    },

    methods: {
      ...mapActions([
        'createOrder'
      ]),
    }

}
</script>

<style scoped>

</style>