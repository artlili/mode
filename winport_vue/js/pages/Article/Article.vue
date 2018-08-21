<template src="./Article.html"></template>

<script>
  import ConfigService from '@/services/ConfigService';
  import MetaTagsService from '@/services/MetaTagsService';
  import Banner from '@/components/shared/Banner/Banner.vue';


  export default {
    name: 'Article',

    components: {
      'banner': Banner
    },

    data() {
      return {
        article: {
          'article': {
            'alias': '',
            'name': '',
            'title': '',
            'keywords': '',
            'description': '',
            'image_400_200': '',
            'image_400_400': '',
            'image_600_400': '',
            'image_1300_650': '',
            'introtext': '',
            'text': '',
            'hits': '',
            'author_alias': '',
            'show_nickname': '',
            'article_date_show': '',
            'output_at': '',
            'chapters': [],
            'companies': {
              'alias': 'alias',
              'name': 'name',
              'logo': 'logo',
              'address': 'address',
              'phone_1': 'phone_1',
              'phone_2': 'phone_2',
              'phone_3': 'phone_3',
              'phone_4': 'phone_4',
              'phone_5': 'phone_5',
              'fax': 'fax',
              'unp_inn': 'unp_inn'
            }
          },
          'previousArticleAlias': '',
          'nextArticleAlias': '',
          'moreCompanyArticles': [],
          'lastArticlesByChapters': [
            {
              'alias': '',
              'name': '',
              'image_400_200': '',
              'image_400_400': '',
              'introtext': '',
              'article_date': null,
              'article_date_show': null
            }
          ]
        },
        noImageUrls: ConfigService.getSetting('noImageUrl')
      };
    },

    created() {
      this.fetchData();
    },

    methods: {
      fetchData() {
        this.$store.dispatch('getArticle', [this.$route.params.alias]).then(() => {
          this.article = this.$store.getters.getArticle;
        });
      }
    },

    watch: {
      '$route.params.alias': function(newRoute, oldRoute) {
        this.fetchData();
      },

      'article.article': function () {
        MetaTagsService.setTags(
          this.article.article.title ? this.article.article.title : this.article.article.name,
          this.article.article.keywords,
          this.article.article.description
        );
      }
    }
  };
</script>