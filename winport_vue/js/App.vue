<script>
  import MetaTagsService from '@/services/MetaTagsService';
  import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
  import Header from "@/components/shared/Header/Header.vue";
  import Footer from "@/components/shared/Footer/Footer.vue";
  import ButtonToTop from "@/components/shared/ButtonToTop/ButtonToTop.vue";
  import Polygon from "@/components/shared/Polygon/Polygon.vue";
  import Banner from "@/components/shared/Banner/Banner.vue";
  import Spinner from "@/components/shared/Spinner/Spinner.vue";
  import ModalAuth from "@/components/shared/ModalAuth/ModalAuth.vue";
  import Feedback from "@/components/shared/Feedback/Feedback.vue";


  export default {
    name: 'app',

    computed: {
      isLoading() {
        return this.$store.getters.getLoading;
      },
      responseError() {
        return this.$store.getters.getError;
      }
    },

    components: {
      "header-component": Header,
      "footer-component": Footer,
      "button-to-top": ButtonToTop,
      "polygon-component": Polygon,
      'banner': Banner,
      'spinner': Spinner,
      'modal-auth': ModalAuth,
      'feedback': Feedback
    },

    created() {
      this.fetchBanners();
      MetaTagsService.setTags("", "", "");
    },

    mounted() {
      this.$refs.polygon.polygonRedraw();
    },

    methods: {
      fetchBanners() {
        this.$store.dispatch("getBannerItems").then(() => {
          this.bannerItems = this.$store.getters.getBannerItems;
        });
      }
    }
  }
</script>

<template>
    <div>

        <spinner v-if="isLoading"></spinner>

        <banner position="TopCross100"></banner>

        <div class="site_wrap polygon" id="wrapper">
            <div class="wrap">
                <!-- HEAD -->
                <header-component></header-component>
                <!-- END HEAD -->

                <router-view></router-view>

                <!-- FOOTER -->
                <footer-component></footer-component>
                <!-- END FOOTER -->
            </div>

            <polygon-component ref="polygon"></polygon-component>
        </div>

        <banner position="BottomCross100"></banner>

        <modal-auth modalName="authModalName"></modal-auth>

        <feedback></feedback>

    </div>
</template>
