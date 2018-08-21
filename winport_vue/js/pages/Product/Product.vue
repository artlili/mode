<template src="./Product.html"></template>

<script>
import ConfigService from "@/services/ConfigService";
import MetaTagsService from '@/services/MetaTagsService';
import Banner from "@/components/shared/Banner/Banner.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import {NotFoundException}  from '@/pages';
import VueGallery from 'vue-gallery';

const { yandexMap, ymapMarker } = require("vue-yandex-maps");

export default {
  name: "Product",

  components: {
    banner: Banner,
    'gallery': VueGallery
  },

  data() {
    return {
      alias: this.$route.params.productAlias,

      product: {
        item: {
          alias: "",
          name: "",
          news: [],
          sections: {},
          images: {},
          prices: {}
        }
      },

      productImages: [],
      productImagesBig: [],
      noImageUrls: ConfigService.getSetting("noImageUrl"),
      imageIndex: null,
      companyContactsId: '',
      companyContactsPrompt: '',
      companyFeedback: false
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.$store
        .dispatch("getProduct", [this.$route.params.productAlias])
        .then(() => {
          this.productImages = [];
          this.productImagesBig = [];
          this.product = this.$store.getters.getProduct;

          this.productImages.push(this.product.item.image ? this.product.item.image : this.noImageUrls.product250250);
          this.productImagesBig.push(this.product.item.image_original ? this.product.item.image_original : this.noImageUrls.product250250);

          if (this.product.item.images.length) {
            for (let i in this.product.item.images)
            {
              this.productImages.push(this.product.item.images[i].url);
              this.productImagesBig.push(this.product.item.images[i].url_original);
            }
          }
        });
    },
    toggleModal: function(){
      this.companyFeedback = !this.companyFeedback
      this.prompt = this.companyFeedback
    },
  },

  watch: {
    "$route.params.productAlias": function(newRoute, oldRoute) {
      this.fetchData();
    },

    'product.item': function () {
      MetaTagsService.setTags(
        this.product.item.title ? this.product.item.title : this.product.item.name,
        this.product.item.keywords,
        this.product.item.description
      );
    }
  }
};
</script>
