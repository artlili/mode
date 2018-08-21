<template lang='pug'>
div
  .header-wrapper
    Header
  FiltersWrapper(:hidden='true', :isOrganizer='user.role === 1 ? "false" : "true"')
    Container
      FilterArticle(:isColumn='user.role === 1 ? "false" : "true"')
        FilterTitle(:isColumn='user.role === 1 ? "false" : "true"') Мои мероприятия
        FilterAction(:hidden='user.role === 1 ? "true" : "false"', @click='createEvent', :isColumn='user.role === 1 ? "false" : "true"') + Новое мероприятие
  Container
    article
      BlocksContainer
        EventBlock(
          v-for='(item, index) in events.current'
          :key='index'
          :isLike='item.like'
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
    article(v-if='events.finished.length')
      EventsTitle Прошедшие мероприятия
      BlocksContainer
        EventBlock(
          v-for='(item, index) in events.finished'
          :key='index'
          :isLike='item.like'
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
            span.event-sale.event-rating(v-if='item.rating') {{ item.rating }}
            span.event-sale(v-else) Ожидает оценки
  .footer-wrapper
    Footer
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Container from 'src/elements/Container';
import Header from '../main/HeaderPersoneAccount';
import FiltersWrapper from '../main/FiltersWrapper';
import FilterArticle from '../main/FilterArticle';
import FilterTitle from '../main/FilterTitle';
import BlocksContainer from '../main/BlocksContainer';
import EventBlock from '../main/EventBlock';
import Footer from '../main/Footer';
import EventsTitle from '../main/EventsTitle';
import FilterAction from '../main/FilterAction';

function data() {
  return {
    events: {
      current: [],
      finished: [],
      liked: [],
    },
  };
}

export default {
  data,
  components: {
    Header,
    FiltersWrapper,
    Container,
    FilterArticle,
    FilterTitle,
    BlocksContainer,
    EventBlock,
    Footer,
    EventsTitle,
    FilterAction,
  },
  computed: {
    ...mapGetters([
      'user',
    ]),
  },
  methods: {
    ...mapActions([
      'likeEvent',
    ]),
    createEvent() {
      this.$router.push('create-event/1');
    }
  },
  async mounted() {
    this.events = await this.$store.dispatch('getUserEvents');
  },
};
</script>

<style lang="scss" scoped>
.footer-wrapper {
  min-height: 360px;
  width: 100%;
  background: #efeff1;
}
* {
  box-sizing: border-box;
}
.event-sale-free,
.event-rating {
  color: #24b55e!important;
}
</style>
