<template src="./Companies.html"></template>

<script>
  import ConfigService from '@/services/ConfigService';
  import MetaTagsService from '@/services/MetaTagsService';
  import Pagination from '@/components/shared/Pagination/Pagination.vue';
  import Banner from '@/components/shared/Banner/Banner.vue';
  import CatalogFilterCity from '@/components/shared/CatalogFilterCity/CatalogFilterCity.vue';
  import CatalogMenuRight from '@/components/shared/CatalogMenuRight/CatalogMenuRight.vue';
  import CatalogFilterRight from '@/components/shared/CatalogFilterRight/CatalogFilterRight.vue';

  export default {
    name: 'Companies',

    components: {
      'pagination': Pagination,
      'banner': Banner,
      'catalog-filter-city': CatalogFilterCity,
      'catalog-menu-right': CatalogMenuRight,
      'catalog-filter-right': CatalogFilterRight
    },

    computed: {
      pagination() {
        return this.page.pagination;
      },
      companiesAlias: function () {
        return this.$route.params.companiesAlias;
      },
      companiesTop() {
        let companies = [];
        if (!this.page.items.length) {
          return companies;
        }

        for (let i in this.page.items) {
          if (this.page.items[i].plan_top) {
            companies.push(this.page.items[i]);
          }
        }

        return companies;
      },
      companiesGeneral() {
        let companies = [];
        if (!this.page.items.length) {
          return companies;
        }

        for (let i in this.page.items) {
          if (!this.page.items[i].plan_top) {
            companies.push(this.page.items[i]);
          }
        }

        return companies;
      }
    },

    data() {
      return {
        page: {
          'items': [],
          'section': [],
          'favoriteCompanies': [],
          'pagination': {}
        },
        sections: [],
        noImageUrls: ConfigService.getSetting('noImageUrl'),
        opennedAlias: null,
        companyContactsId: '',
        companyContactsPrompt: '',
        companyFeedback: false
      };
    },

    created() {
      this.fetchData(this.pagination.current_page);
      this.fetchSections();
    },

    methods: {
      fetchData() {
        this.$store.dispatch('getCompanies', [this.$route.params.companiesAlias, this.$route.params.companiesPage]).then(() => {
          this.page = this.$store.getters.getCompanies;
        });
      },
      
      toggleModal: function(){
        this.companyFeedback = !this.companyFeedback
        this.prompt = this.companyFeedback
      },

      fetchSections() {
        this.$store.dispatch('getSections').then(() => {
          this.sections = this.$store.getters.getSections;
          this.changeOpennedAlias();
        });
      },

      changeOpennedAlias() {
        let route = this.$route.params.companiesAlias;
        for (let i in this.sections)
        {
          if (this.sections[i].alias === route) {
            this.opennedAlias = this.sections[i].alias;
            return;
          }

          if (this.sections[i].items.length) {
            for (let j in this.sections[i].items)
            {
              if (this.sections[i].items[j].alias === route) {
                this.opennedAlias = this.sections[i].alias;
                return;
              }
            }
          }
        }
      }
    },

    watch: {
      '$route.params.companiesAlias': function (newRoute, oldRoute) {
        this.fetchData();
        this.changeOpennedAlias();
      },
      '$route.params.companiesPage': function (newRoute, oldRoute) {
        this.fetchData();
      },

      'page.section': function () {
        let title = this.page.section.title ? this.page.section.title : this.page.section.name;
        let keywords = this.page.section.keywords;
        let description = this.page.section.description;
        return MetaTagsService.setTags(title, keywords, description);
      }
    }
  };
</script>
