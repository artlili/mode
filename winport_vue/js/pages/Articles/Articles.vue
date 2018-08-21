<template src="./Articles.html"></template>

<script>
  import ConfigService from '@/services/ConfigService';
  import MetaTagsService from '@/services/MetaTagsService';
  import Pagination from '@/components/shared/Pagination/Pagination.vue';
  import Banner from '@/components/shared/Banner/Banner.vue';

  export default {
    name: 'Articles',

    components: {
      'pagination': Pagination,
      'banner': Banner
    },

    computed: {
      alias() {
        return this.$route.params.alias;
      },

      pagination() {
        return this.articles.pagination;
      }
    },
    
    data() {
      return {
        articles: {
          'topParent': {
            'alias': '',
            'name': ''
          },
          'tree': [
            {
              'alias': '',
              'name': ' '
            }
          ],
          'hits': [],
          'items': [
            {
              'alias': '',
              'name': '',
              'image_400_200': '',
              'image_400_400': '',
              'introtext': '',
              'article_date': null,
              'article_date_show': null
            }
          ],
          'pagination': {}
        },
        noImageUrls: ConfigService.getSetting('noImageUrl'),
        counter: 0
      };
    },

    created() {
      this.fetchData();
    },

    methods: {
      fetchData() {
        this.$store.dispatch('getArticles', [this.$route.params.alias, this.$route.params.articlesPage]).then(() => {
          this.articles = this.$store.getters.getArticles;
        });
      }
    },

    watch: {
      '$route.params.alias': function(newRoute, oldRoute) {
        this.fetchData();
      },
      '$route.params.articlesPage': function(newRoute, oldRoute) {
        this.fetchData();
      },

      'articles.chapter': function () {
        let title = this.articles.chapter.title ? this.articles.chapter.title : this.articles.chapter.name;
        let keywords = this.articles.chapter.keywords;
        let description = this.articles.chapter.description;
        return MetaTagsService.setTags(title, keywords, description);
      }
    }
  };
</script>
