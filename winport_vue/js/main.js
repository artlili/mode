"use strict";

import Vue from "vue";
import VueResource from "vue-resource";
import Croppa from "vue-croppa";
import {mapState} from "vuex";

import router from "@/router/router";
import store from "@/store/store";

import vSelect from 'vue-select';

import App from "@/App.vue";

Vue.use(VueResource);
Vue.use(Croppa);
Vue.component('v-select', vSelect);



window.addEventListener("load", () => {
  window.app = new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    template: "<App/>",
    //components: { App },
    computed: mapState(["isLoading"]),

    created() {
      let _this = this;

      Vue.http.interceptors.push(function (request, next) {
        let token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', 'Bearer ' + token);
        }

        next(function(response) {
          if (response.status === 403 || response.status === 401) {
            localStorage.removeItem('token');
            _this.$router.push("/signin");
          } else if (response.status === 404) {
            _this.$router.replace("/404");
          } else if (response.status === 500) {
            _this.$router.replace("/500");
          }
        });
      });
    }
  });
});
