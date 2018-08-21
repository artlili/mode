<template src="./Home.html"></template>

<script>
  import ConfigService from '@/services/ConfigService';
  import MetaTagsService from '@/services/MetaTagsService';
  import Banner from '@/components/shared/Banner/Banner.vue';
  import { Carousel, Slide } from 'vue-carousel';
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'


  export default {
  	name: 'Home',

    components: {
      'banner': Banner,
      Carousel,
      Slide,
      VuePerfectScrollbar
    },

    data: () => {
      return {
        indexItems: {
          'lastNews': [],
          'chapterNewsAlias': '',
          'lastLibrary': [],
          'chapterLibraryAlias': '',
          'companies': [],
          'products': []
        },

        noImageUrls: ConfigService.getSetting('noImageUrl'),
        
        companyPerPageValue: 1,

        productPerPageValue: 1,

        productMarginValue: '10px',

        libraryLeftBlockHeight: 700,
        libraryRightBannerHeight: 200,
      }
    },

    computed: {
      companyPerPage: function() {
        return this.companyPerPageValue;
      },

      productPerPage: function() {
        return this.productPerPageValue;
      },

      productMargin: function() {
        return this.productMarginValue;
      },

      libraryRightBlockHeight: function () {
        return this.libraryLeftBlockHeight - this.libraryRightBannerHeight;
      }
    },

    created() {
  	  let config = ConfigService.getSetting("home");
      window.addEventListener('resize', this.recountCompanyPerPage);
      window.addEventListener('resize', this.recountLibraryHeights);
      this.recountCompanyPerPage();
      MetaTagsService.setTags(config.title, config.keywords, config.description);
    },

    mounted() {
      this.fetchData();
    },

    methods: {
      fetchData() {
        this.$store.dispatch('getIndexItems').then(() => {
          this.indexItems = this.$store.getters.getIndexItems;
          window.setTimeout(this.recountLibraryHeights, 500);
        });
      },

      recountCompanyPerPage() {
        let width = document.documentElement.clientWidth;

        if (width > 1200) {
          this.companyPerPageValue = 6;
        } else if (width > 1024) {
          this.companyPerPageValue = 5;
        } else if (width > 768) {
          this.companyPerPageValue = 4;
        } else if (width > 480) {
          this.companyPerPageValue = 3;
        } else {
          this.companyPerPageValue = 2;
        }

        if (width > 1250) {
          this.productPerPageValue = 4;
          this.productMarginValue = '15px';
        } else if (width > 1024) {
          this.productPerPageValue = 4;
          this.productMarginValue = '10px';
        } else if (width > 768) {
          this.productPerPageValue = 3;
          this.productMarginValue = '7px';
        } else if (width > 480) {
          this.productPerPageValue = 2;
          this.productMarginValue = '7px';
        } else {
          this.productPerPageValue = 1;
          this.productMarginValue = '7px';
        }
      },

      recountLibraryHeights() {
        if (this.$refs.libraryLeftBlock && this.$refs.libraryRightBanner) {
          this.libraryLeftBlockHeight = this.$refs.libraryLeftBlock.clientHeight;
          this.libraryRightBannerHeight = this.$refs.libraryRightBanner.clientHeight;
        }
      }
    }
  }
</script>
