<template>
  <div id="app">
    <Header subtitle="Home"/>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/The_Metropolitan_Museum_of_Art_Logo.svg/1028px-The_Metropolitan_Museum_of_Art_Logo.svg.png"
      width="200"
      alt="Logo"
    />
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'

  export default {
    name: 'Home',
    
    components: {
      Header
    }
  }
</script>
