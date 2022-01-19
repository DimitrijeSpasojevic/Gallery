import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    categories: [],
    imageIDs: [],
    products: [],
    token: '',
    comments: []
  },

  mutations: {
    addItem(state, item) {
      state.items.push(item);
    },

    addCategories(state, ctgrs) {
      state.categories = ctgrs;
    },

    setComments(state, comments){
      state.comments = comments;
    },

    setImageIDs(state, ids) {
      state.imageIDs = ids;
    },

    setProducts(state, products) {
      state.products = products;
    },

    addIDsToCategory(state, obj) {
      const department = state.departments.filter( dep => dep.departmentId == obj.id )[0];
      department['imageIDs'] = obj.imageIDs;
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
      fetch('http://localhost:8080/categories')
        .then( obj => obj.json() )
          .then( rows => {commit('addCategories', rows) });
    },

    fetchComments({ commit }){
      fetch('http://localhost:8080/comments')
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
      fetch('http://localhost:8080/admin/create/order', {
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
        commit('setImageIDs', category['products']);
      } else {
        const obj = await fetch(`http://localhost:8080/products/category/${catID}`);
        const res = await obj.json();
        commit('setProducts', res);
      }
    },

    search({ commit }, q) {
      return new Promise( (resolve, reject) => {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${q}`)
          .then( obj => obj.json() )
          .then( res => {
            commit('setImageIDs', res.objectIDs);
            resolve(res.total);
          });
      });
    },

    getItem({ commit, state }, id) {
      return new Promise( (resolve, reject) => {
        const item = state.items.filter( item => item.objectID == id )[0];
        
        if (item) {
          resolve(item);
        } else {
          fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            .then( obj => obj.json())
            .then( res => {
              fetch(`http://127.0.0.1:8000/api/messages/${res.objectID}`, {
                headers: { 'Authorization': `Bearer ${state.token}` }
              }).then( resp => resp.json() )
                .then( comments => {
                  res['comments'] = comments;
                  commit('addItem', res);
                  resolve(res);
                });
            });
        }
      });
    },

    register({ commit }, obj) {
      fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      }).then( res => res.json() )
        .then( tkn => commit('setToken', tkn.token) );
    },

    login({ commit }, obj) {
      fetch('http://localhost:9000/login', {
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
