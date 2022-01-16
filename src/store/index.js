import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    categories: [],
    imageIDs: [],
    token: ''
  },

  mutations: {
    addItem(state, item) {
      state.items.push(item);
    },

    addCategories(state, ctgrs) {
      state.categories = ctgrs;
    },

    setImageIDs(state, ids) {
      state.imageIDs = ids;
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

    addComment(state, obj) {
      const image = state.items.filter( item => item.objectID == obj.artId )[0];
      if (image) {
        image.comments.push(obj.comment);
      }
    }
  },

  actions: {
    
    fetchCategories({ commit }) {
      fetch('http://localhost:8080/categories')
        .then( obj => obj.json() )
          .then( rows => {commit('addCategories', rows) });
    },

    async fetchIDsByDepartment({ commit, state }, depID) {

      const department = state.departments.filter( dep => dep.departmentId === depID )[0];
      if (department && department['imageIDs']) {
        commit('setImageIDs', department['imageIDs']);
      } else {
        const obj = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${depID}`);
        const res = await obj.json();

        commit('addIDsToDepartment', {
          id: depID,
          imageIDs: res.objectIDs
        });

        commit('setImageIDs', res.objectIDs);
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

    socket_comment({ commit }, msg) {
      const comment = JSON.parse(msg);
      commit('addComment', { artId: comment.artId, comment: comment });
    }
  }
})
