<template lang='pug'>
div
  .header-wrapper
    Header
  FiltersWrapper
    Container
      FilterArticle
        FilterTitle Лента спортивных мероприятий
        FilterNav
  div(v-if="this.eventFeedView === 'table'")
      Container
        article
          .filter_flex
            FilterCategory(
              v-for='(item, index) in tags'
              :key='index'
              @click.native='setQueryFilter(item)'
            ) {{ item }}
      div(
        v-for='(item, index) in events'
        :key='index'
      )
        Container
          article
            EventsTitle(v-if='item.is_grouped') {{ item.sport }}
            BlocksContainer
              EventBlock(
                v-for='(item, index) in item.events'
                :isLike='item.like'
                :key='index'
                @click.native="openFullEvent($event, item)"
              )
                .event__img(
                  :style='{ background: `url(${item.photos[0]}) no-repeat center` }'
                )
                  span.likeEvents(
                    @click='likeEvent(item)'
                  )
                .event__cnt
                  a.event-category(href='#') {{ item.sport }}
                  a.event-title  {{ item.title }}
                  span.event-date {{ item.date | moment('DD/MM/YYYY') }}
                  span.event-sale(v-if='item.price') {{ item.price }}
                  span.event-sale.event-sale-free(v-else) Бесплатно
              ExpandButton(@click.native='showAll') Показать все мероприятия
  div(v-else)
    Map(
        :events='events'
    )
  .mobile-wrapper
    Container
      article
        .mobile-bl
          h2 Мобильное приложение
          p Жирмунский, однако, настаивал, что филологическое суждение существенно диссонирует эпизодический не-текст, таким образом, очевидно, что в нашем языке царит дух карнавала, пародийного отстранения.
          a(href='#').mobile-store
            img(src='../../../static/images/appStore.svg')
            span APP STORE
        .mobile-bl.mobile-bl-mob
  .footer-wrapper
    Footer
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Container from 'src/elements/Container';
  import Header from '../main/HeaderPersoneAccount';
  import FiltersWrapper from '../main/FiltersWrapper';
  import FilterTitle from '../main/FilterTitle';
  import FilterArticle from '../main/FilterArticle';
  import FilterNav from '../main/FilterNav';
  import FilterCategory from '../main/filterCategory';
  import EventsTitle from '../main/EventsTitle';
  import BlocksContainer from '../main/BlocksContainer';
  import EventBlock from '../main/EventBlock';
  import ExpandButton from '../main/ExpandBlocksButton';
  import Map from './Map';
  import Footer from '../main/Footer';

  export default {
    data() {
      const { user } = this.$store.state;

      return {
        tags: [],
        displayAll: false,
        user,
        view: 'table'
      };
    },
    async created() {
      try {
        const { data } = await this.$axios.get('/api/v2/tags');

        this.tags = data
      } catch (err) {
        console.error(err);
      }
    },
    methods: {
      ...mapActions([
        'setFilter',
        'likeEvent',
      ]),
      showAll() {
        this.displayAll = true;
      },
      setQueryFilter(query) {
        this.setFilter({
          query,
        });
      },
      openFullEvent({ target }, { event_id }) {
        if (target.className !== 'likeEvents') {
          this.$router.push(`/events/${event_id}`)
        }
      }
    },
    computed: {
      ...mapGetters([
        'filters',
        'filtersQuery',
        'eventFeedView'
      ]),
    },
    asyncComputed: {
      async events() {
        try {
          const { data: events } = await this.$axios.get('/api/v2/events', {
            params: this.filtersQuery,
            headers: {
              Authorization: this.user.data.token,
            },
          })

          if (!events.length) {
            return events;
          }

          // В группированных мероприятиях схема { sport: String, events: Arrray }
          const isGrouped = Object.keys(events[0]).length === 2;

          if (!isGrouped) {
            return [
              {
                events,
              },
            ];
          }

          return events.map(item => ({
            ...item,
            is_grouped: isGrouped,
          }));
        } catch (err) {
          console.error(err);
        }
      },
      mounted() {
        this.view = this.$route.query.view || 'table';
      }
    },
    components: {
      Header,
      FiltersWrapper,
      FilterTitle,
      Container,
      FilterArticle,
      FilterNav,
      FilterCategory,
      EventsTitle,
      BlocksContainer,
      EventBlock,
      ExpandButton,
      Footer,
      Map
    },
  };
</script>

<style lang="scss" scoped>
.active-like {
  background: url(../../../static/images/likeActive.svg) no-repeat center;
  display: none;
}
* {
  box-sizing: border-box;
}

.feed-link {
  text-decoration: none;
  color: inherit;
}

.filter_flex {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  margin-bottom: 60px;
}

.mobile-wrapper {
  min-height: 537px;
  width: 100%;

  article {
    display: flex;
    justify-content: space-between;
  }
}

.mobile-bl {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 537px;

  h2 {
    font-family: 'GT Walsheim Pro Bold';
    font-size: 38px;
    color: #283964;
    margin-bottom: 15px;
  }

  p {
    font-family: 'SF UI Display Medium';
    font-size: 18px;
    color: #283964;
    line-height: 28px;
    max-width: 490px;
    margin-bottom: 30px;
  }
}

.mobile-bl-mob {
  background: url(../../../static/images/mainMobile.png) no-repeat right bottom;
  background-size: 85%;
}

.mobile-store {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 187px;
  height: 50px;
  border-radius: 5px;
  background-image: linear-gradient(to right, #1d9aed, #318aff);
  text-decoration: none;

  span {
    font-family: 'GT Walsheim Pro Medium';
    font-size: 16px;
    letter-spacing: 1.3px;
    color: white;
  }

  img {
    margin-right: 12px;
    margin-bottom: 5px;
  }
}

.footer-wrapper {
  min-height: 360px;
  width: 100%;
  background: #efeff1;
}

@media screen and (max-width: 1012px) {
  .mobile-wrapper {
    min-height: auto;
    article {
      flex-direction: column;
    }
  }
  .mobile-bl {
    width: 100%;
    height: auto;
    padding-top: 35px;

    &-mob {
      margin-top: 30px;
      height: 250px;
      background-size: contain;
      background-position: bottom center;
    }
  }

  .filter_flex {
    margin-bottom: 35px;
  }
}

@media screen and (max-width: 765px) {
  .mobile-store {
    margin: 0 auto;
  }
  .mobile-bl h2 {
    line-height: auto;
    font-size: 25px;
  }
  .mobile-bl p {
    font-size: 16px;
  }
}
</style>
