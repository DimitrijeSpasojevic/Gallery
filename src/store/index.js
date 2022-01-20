import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categories: [],
    products: [],
    token: '',
    comments: []
  },

  mutations: {

    setCategories(state, ctgrs) {
      state.categories = ctgrs;
    },

    setComments(state, comments){
      state.comments = comments;
    },

    setProducts(state, products) {
      state.products = products;
    },

    setToken(state, token) {
      state.token = token;
      localStorage.token = token;
    },

    removeToken(state) {
      state.token = '';
      localStorage.token = '';
    },

    addComment(state, comment) {
      state.comments.push(comment);
    }
  },

  actions: {
    
    fetchCategories({ commit }) {
      fetch('https://web-shop-rest-service.herokuapp.com/categories')
        .then( obj => obj.json() )
          .then( rows => {commit('setCategories', rows) });
    },

    fetchComments({ commit }){
      fetch('https://web-shop-rest-service.herokuapp.com/comments')
        .then( obj => obj.json() )
          .then( rows => {commit('setComments', rows) });
    },
  
    createOrder({ commit }, price) {

      if(localStorage.token == ''){
        alert("Morate biti ulogovani da bi ste mogli da kupujete");
        return;
      }

      const data = {
        price: price  
      };
      fetch('https://web-shop-rest-service.herokuapp.com/admin/create/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.token}`
                },
                body: JSON.stringify(data)
            })
            .then( res => res.json() )
              .then( el => {
                    alert("Cestitamo!!! Uspesno napravljena porudzbina");
              });
            
    },

    async fetchIDsByCategory({ commit, state }, catID) {

      const category = state.categories.filter( cat => cat.id === catID )[0];
      if (category && category['products']) {
        commit('setProducts', category['products']);
      } else {
        const obj = await fetch(`https://web-shop-rest-service.herokuapp.com/products/category/${catID}`);
        const res = await obj.json();
        commit('setProducts', res);
      }
    },

    register({ commit }, obj) {
      fetch('https://web-shop-rest-service.herokuapp.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      }).then( res => res.json() )
        .then( tkn => commit('setToken', tkn.token) );
    },

    login({ commit }, obj) {
      fetch('https://web-shop-auth-servis.herokuapp.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }).then( res => res.json() )
      .then( tkn => {
        if (tkn.msg) {
          alert(tkn.msg);
        } else {
          commit('setToken', tkn.token)
        }
      }).catch(err => console.log(err));
    },

    socket_comment({ commit }, com) {
      const comment = JSON.parse(com);
      commit('addComment', comment);
    }
  }
})
