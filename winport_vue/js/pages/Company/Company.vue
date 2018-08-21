<template src="./Company.html"></template>

<script>
import Vue from 'vue';
import ConfigService from "@/services/ConfigService";
import MetaTagsService from '@/services/MetaTagsService';
import Banner from "@/components/shared/Banner/Banner.vue";
import {NotFoundException}  from '@/pages';
import VueGallery from 'vue-gallery';

const { yandexMap, ymapMarker } = require("vue-yandex-maps");

export default {
  name: "Company",

  beforeUpdate() {
    let validRoutes = [undefined, "map", "news", "albums", "products"];
    if (validRoutes.indexOf(this.$route.params.companySegment) === -1) {
      this.$router.replace('/404');
    }
  },

  components: {
    banner: Banner,
    'gallery': VueGallery,
    yandexMap,
    ymapMarker
  },

  data() {
    return {
      alias: this.$route.params.companyAlias,

      company: {
        item: {
          alias: "",
          name: "",
          address: "",
          news: [],
          sections: [],
          companyAlbums: [],
          products: []
        },
        sections: [],
        news: []
      },

      isOpen: false,

      imageIndex: null,
      imageNumber: 0,
      companyAlbumImages: [],

      prompt: '',
      promptTab: '',
      companyFeedback: false,

      noImageUrls: ConfigService.getSetting("noImageUrl"),

      ymapPlacemarks: [],
      ymapCenterCoords: [53.531205, 28.030985],
      ymapZoom: 6
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.$store
        .dispatch("getCompany", [this.$route.params.companyAlias])
        .then(() => {
          this.company = this.$store.getters.getCompany;

          /**
           *
           */
          let images = [];
          let albums = this.company.item.companyAlbums;
          if (albums.length > 0) {
            for (let i in albums)
            {
              if (albums[i].images.length > 0) {
                for (let j in albums[i].images)
                {
                  images.push(albums[i].images[j].urlOriginal);
                }
              }
            }
          }

          this.companyAlbumImages = images;

          this.initYandexMap();
        });
    },

    toggleModal: function(){
        this.companyFeedback = !this.companyFeedback
        this.prompt = this.companyFeedback
    },

    openSelect() {
      if (this.isOpen === false) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    },

    yandexMapClick() {
    },

    initYandexMap() {

      this.$store
        .dispatch("getGeocode", this.company.item.address)
        .then(() => {
          let result = this.$store.getters.getGeocode;

          if (result.length) {
            this.ymapCenterCoords = result;
            this.ymapPlacemarks.push({
              coords: result,
              properties: {},
              options: {},
              clusterName: "1",
              callbacks: {
                click: this.yandexMapClick
              }
            });
            this.ymapZoom = 16;
          }
        });
    }
  },

  watch: {
    "$route.params.companySection": function(newRoute, oldRoute) {
      this.companyInfoTab = this.$route.params.companySection ? this.$route.params.companySection : "about";
    },

    "$route.params.companyAlias": function(newRoute, oldRoute) {
      this.fetchData();
    },

    'company.item': function () {
      MetaTagsService.setTags(
        this.company.item.title ? this.company.item.title : this.company.item.name,
        this.company.item.keywords,
        this.company.item.description
      );
    }
  }
};
</script>
