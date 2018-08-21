<template src="./Banner.html"></template>
<style src="./Banner.scss"></style>

<script>
  import {mapState, mapActions, mapGetters} from "vuex";
  import BannerModule from "@/modules/BannerModule";

  export default {
    name: "Banner",

    props: {
      position: ""
    },

    methods: {},

    computed: {
      bannerItems() {
        return this.$store.getters.getBannerItems;
      }
    }
  };
</script>
