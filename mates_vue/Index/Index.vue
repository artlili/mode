<template lang="pug">
div
  div.header-wrapper
    HeaderUser(v-if='user')
    Header(v-else)
  div.content-wrapper
    Container
      article.content-article
        h1 Участвуйте в интересных спортивных мероприятиях по всей России
        router-link(to='/signup' v-if='!user') Зарегистрироваться
  div(v-if='upcomingEvents.length').slide-wrapper
    Container
      article.slide-article
        h2.head2 Ближайшие мероприятия
        div.slider
          Slick(ref="slick" :options="slickOptions").sliders
            div(
              v-for='(item, index) in upcomingEvents'
              :key='index'
            )
              router-link(
                :to="getLink(item.event_id)"
              ).slide
                div(
                  :style='{ background: `url(${item.photos[0]}) no-repeat center` }'
                ).slide__image
                  Like(
                    :isLike='item.like'
                    @click.native='likeEvent(item)'
                  )
                div.slide__cnt
                  a.sl-category {{ item.sport }}
                  a.sl-title {{ item.title }}
                  span.sl-date {{ item.date | moment('DD/MM/YYYY') }}
                  span.sl-sale(v-if='item.price') {{ item.price }} ₽
                  span.sl-sale.sl-sale-free(v-else) Бесплатно
        ButtonShow
          router-link(to='/events-feed') Показать все мероприятия
  div(v-if='popularSports.length').popular-wrapper
    Container
      article.popular
        h2.head2 Популярные виды спорта
        div.popular__bls
          div(
            v-for='(item, index) in popularSports'
            :key='index'
            :style="{ background: 'url('+item.photo+') no-repeat center' }"
          ).popular__bl
            span.popular-darken
            h3 {{ item.title }}
  div.card-wrapper
    div.card-left
    div.card-right
      div
    div.card-absolute
      article
        div.card-bl
          h2 Учавствовать в мероприятиях
          p Жирмунский, однако, настаивал, что филологическое суждение существенно диссонирует эпизодический не-текст, таким образом, очевидно, что в нашем языке царит дух карнавала, пародийного отстранения.
        div.card-bl.card-end
          h2 Создать свои мероприятия
          p Жирмунский, однако, настаивал, что филологическое суждение существенно диссонирует эпизодический не-текст, таким образом, очевидно, что в нашем языке царит дух карнавала, пародийного отстранения
  div.mobile-wrapper
    Container
      article
        div.mobile-bl
          h2 Мобильное приложение
          p Жирмунский, однако, настаивал, что филологическое суждение существенно диссонирует эпизодический не-текст, таким образом, очевидно, что в нашем языке царит дух карнавала, пародийного отстранения.
          a.mobile-store(href='#')
            img(src='../../../static/images/appStore.svg')
            span.span-uppercase app store
        div.mobile-bl.mobile-bl-mob
  div.footer-wrapper
    Footer
</template>

<script>
import Slick from 'vue-slick';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import queryString from 'querystring';
import Container from 'src/elements/Container';
import { baseUrl } from '../../config';
import Header from '../main/Header';
import HeaderUser from '../main/HeaderPersoneAccount';
import ButtonShow from '../main/ButtonShow';
import Footer from '../main/Footer';
import Like from '../main/Like';

export default {
  data() {
    return {
      popularSports: [],
      upcomingEvents: [],
      slickOptions: {
        responsive: [{
          breakpoint: 10000,
          settings: {
            speed: 1000,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: true,
            variableWidth: true,
            prevArrow: "<span class='slick-button slick-previus'><img src='../../../static/images/arrow-back.svg'><span>",
            nextArrow: "<span class='slick-button slick-nexts'><img style='transform: rotate(180deg)' src='../../../static/images/arrow-next.svg'></span>",
          },
        },
        {
          breakpoint: 1351,
          settings: {
            speed: 1000,
            slidesToShow: 2,
            slidesToScroll: 2,
            arrows: true,
            variableWidth: false,
            prevArrow: "<span class='slick-button slick-previus'><img src='../../../static/images/arrow-back.svg'><span>",
            nextArrow: "<span class='slick-button slick-nexts'><img style='transform: rotate(180deg)' src='../../../static/images/arrow-next.svg'></span>",
          },
        },
        {
          breakpoint: 1012,
          settings: {
            speed: 1000,
            slideToShow: 2,
            slidesToScroll: 2,
            arrows: true,
            variableWidth: true,
            prevArrow: "<span class='slick-button slick-previus'><img src='../../../static/images/arrow-back.svg'><span>",
            nextArrow: "<span class='slick-button slick-nexts'><img style='transform: rotate(180deg)' src='../../../static/images/arrow-next.svg'></span>",
          },
        },
        {
          breakpoint: 900,
          settings: {
            speed: 1000,
            slideToShow: 1,
            slidesToScroll: 1,
            variableWidth: false,
            arrows: false,
            dots: true,
          },
        },
        ],
      },
    };
  },
  components: {
    Header,
    HeaderUser,
    Container,
    Slick,
    ButtonShow,
    Footer,
    Like,
  },
  async created() {
    try {
      const query = queryString.parse(location.search.split('?')[1]);
      if (query.response) {
        const response = JSON.parse(query.response);
        // Если в данной сессии пользователь существует,
        // тогда связываем социальную сеть с основным профилем, а не создаем новый.
        if (this.user) {
          await this.connectSocialNetwork({
            parentToken: this.user.token,
            childrenToken: response.token,
            social: response.network,
          });
          await this.updateUser();

          return this.$router.push(response.from);
        }

        this.setUser(response);

        await this.updateUser();

        location.search = '';
      }

      this.upcomingEvents = await this.$store.dispatch('getUpcoming');
      this.popularSports = await this.$store.dispatch('getPopular');
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ]),
  },
  methods: {
    getLink(id) {
      return {
        name: 'EventPage',
        params: {
          id,
        },
      };
    },
    ...mapActions([
      'setUser',
      'updateUser',
      'connectSocialNetwork',
      'likeEvent',
    ]),
  },
};
</script>

<style lang='scss'>
.span-uppercase {
  text-transform: uppercase;
}
* {
  box-sizing: border-box;
}

.card-absolute {
  width: 1200px;
  margin: 0 auto;
}

.likeEvents {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 28px;
  height: 26px;
  cursor: pointer;
}

.slick-previus {
  left: -65px;
}

.slick-nexts {
  right: -65px;
}

.slick-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 40px;
  box-shadow: 0 2px 6px 0 rgba(73, 82, 96, 0.1);
  background-color: #ffffff;
  border: solid 1px rgba(231, 231, 231, 0.5);
  cursor: pointer;
}

.slick-prev,
.slick-next {
  font-size: 0;
  line-height: 0;

  position: absolute;
  top: 50%;

  display: block;

  width: 20px;
  height: 20px;
  padding: 0;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);

  cursor: pointer;

  color: transparent;
  border: none;
  outline: none;
  background: transparent;
}

.slick-prev:hover,
.slick-prev:focus,
.slick-next:hover,
.slick-next:focus {
  color: transparent;
  outline: none;
  background: transparent;
}

.slick-prev:hover:before,
.slick-prev:focus:before,
.slick-next:hover:before,
.slick-next:focus:before {
  opacity: 1;
}

.slick-prev.slick-disabled:before,
.slick-next.slick-disabled:before {
  opacity: .25;
}

.slick-prev:before,
.slick-next:before {
  font-family: 'slick';
  font-size: 20px;
  line-height: 1;

  opacity: .75;
  color: white;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.slick-prev {
  left: -25px;
}

[dir='rtl'] .slick-prev {
  right: -25px;
  left: auto;
}

.slick-prev:before {
  content: '←';
}

[dir='rtl'] .slick-prev:before {
  content: '→';
}

.slick-next {
  right: -25px;
}

[dir='rtl'] .slick-next {
  right: auto;
  left: -25px;
}

.slick-next:before {
  content: '→';
}

[dir='rtl'] .slick-next:before {
  content: '←';
}



/* Dots */

.slick-dotted.slick-slider {
  margin-bottom: 30px;
}

.slick-dots {
  position: absolute;
  bottom: -25px;

  display: block;

  width: 100%;
  padding: 0;
  margin: 0;

  list-style: none;

  text-align: center;
}

.slick-dots li {
  position: relative;

  display: inline-block;

  width: 20px;
  height: 20px;
  margin: 0 5px;
  padding: 0;

  cursor: pointer;
}

.slick-dots li button {
  font-size: 0;
  line-height: 0;

  display: block;

  width: 20px;
  height: 20px;
  padding: 5px;

  cursor: pointer;

  color: transparent;
  border: 0;
  outline: none;
  background: transparent;
}

.slick-dots li button:hover,
.slick-dots li button:focus {
  outline: none;
}

.slick-dots li button:hover:before,
.slick-dots li button:focus:before {
  opacity: 1;
}

.slick-dots li button:before {
  font-family: 'slick';
  font-size: 6px;
  line-height: 20px;

  position: absolute;
  top: 0;
  left: 0;

  width: 20px;
  height: 20px;

  content: '•';
  text-align: center;

  opacity: .25;
  color: black;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.slick-dots li.slick-active button:before {
  opacity: .75;
  color: black;
}

.slick-slider {
  position: relative;

  display: block;
  box-sizing: border-box;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -ms-touch-action: pan-y;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}

.slick-list {
  position: relative;

  display: block;
  overflow: hidden;

  margin: 0;
  padding: 0;
}

.slick-list:focus {
  outline: none;
}

.slick-list.dragging {
  cursor: pointer;
  cursor: hand;
}

.slick-slider .slick-track,
.slick-slider .slick-list {
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.slick-track {
  position: relative;
  top: 0;
  left: 0;

  display: block;
  margin-left: auto;
  margin-right: auto;
}

.slick-track:before,
.slick-track:after {
  display: table;

  content: '';
}

.slick-track:after {
  clear: both;
}

.slick-loading .slick-track {
  visibility: hidden;
}

.slick-slide {
  display: none;
  float: left;

  height: 100%;
  min-height: 1px;
}

[dir='rtl'] .slick-slide {
  float: right;
}

.slick-slide img {
  display: block;
}

.slick-slide.slick-loading img {
  display: none;
}

.slick-slide.dragging img {
  pointer-events: none;
}

.slick-initialized .slick-slide {
  display: block;
}

.slick-loading .slick-slide {
  visibility: hidden;
}

.slick-vertical .slick-slide {
  display: block;

  height: auto;

  border: 1px solid transparent;
}

.slick-arrow.slick-hidden {
  display: none;
}


.header-wrapper {
  width: 100%;
  background: white;
}

.content-wrapper {
  width: 100%;
  min-height: 600px;
  background: url("~assets/images/Index.png") no-repeat center;
  background-size: cover;
}

.content-article {
  display: flex;
  flex-direction: column;
  padding-top: 205px;

  & h1 {
    font-family: 'GT Walsheim Pro Bold';
    font-size: 50px;
    line-height: 56px;
    color: white;
    max-width: 710px;
  }

  & a {
    width: 246px;
    height: 55px;
    border-radius: 4px;
    background-image: linear-gradient(to right, #1d9aed, #318aff);
    margin-top: 45px;
    text-align: center;
    line-height: 55px;
    text-transform: uppercase;
    text-decoration: none;
    font-family: 'GT Walsheim Pro Medium';
    font-size: 16px;
    letter-spacing: 1.2px;
    color: white;
  }
}

.slide-article {
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  padding-bottom: 65px;

  & .head2 {
    font-family: 'GT Walsheim Pro Bold';
    font-size: 38px;
    line-height: 59px;
    color: #283964;
    text-decoration: none;
  }
}

.slider {
  margin-top: 30px;
  margin-bottom: 30px;
}

.slide {
  margin: 10px 15px;
  display: block;
  text-decoration: none;
  height: 340px;
  width: 370px;
  border-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(73, 82, 96, 0.1);
  background-color: #ffffff;
  border: solid 1px rgba(231, 231, 231, 0.5);
  z-index: 100;
}

.slide__image {
  position: relative;
  width: 100%;
  height: 170px;
}

.slide__cnt {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  padding-top: 42px;

  & a {
    text-decoration: none;
  }

  & .sl-category {
    position: absolute;
    top: 20px;
    left: 20;
    color: red;
    font-family: 'SF UI Display Bold';
    font-size: 12px;
    color: #a4adba;
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }

  & .sl-title {
    font-family: 'GT Walsheim Pro Bold';
    color: #283964;
    font-size: 25px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  & .sl-sale {
    position: absolute;
    top: 135px;
    left: 20px;
    font-family: 'SF UI Display Medium';
    font-size: 16px;
    color: #2c8ffb;
  }

  & .sl-date {
    font-family: 'SF UI Display Medium';
    font-size: 16px;
    color: #a4adba;
    margin-top: 11px;
  }
}

button[aria-label="Previous page"] {
  opacity: 1;
  width: 50px;
  height: 50px;
  border-radius: 40px;
  box-shadow: 0 2px 6px 0 rgba(73, 82, 96, 0.1);
  background-color: red;
  border: solid 1px rgba(231, 231, 231, 0.5);
  margin-left: -15px;
}

button[aria-label="Next page"] {
  opacity: 1;
  width: 50px;
  height: 50px;
  border-radius: 40px;
  box-shadow: 0 2px 6px 0 rgba(73, 82, 96, 0.1);
  background-color: red;
  border: solid 1px rgba(231, 231, 231, 0.5);
  margin-right: -15px;
}

.popular {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  padding-bottom: 55px;

  &-wrapper {
    width: 100%;
    background: #f2f2f5;
  }

  & .head2 {
    font-family: 'GT Walsheim Pro Bold';
    font-size: 38px;
    color: #283964;
    text-decoration: none;
  }

  &__bls {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
  }

  &__bl {
    position: relative;
    margin-right: 30px;
    display: flex;
    margin-bottom: 30px;
    width: 270px;
    height: 150px;
    border-radius: 4px;
    padding: 18px 25px;
    overflow: hidden;

    & a {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 270px;
      height: 100%;
      z-index: 5
    }

    & h3 {
      font-family: 'GT Walsheim Pro Bold';
      font-size: 25px;
      color: white;
      z-index: 3;
    }

    & span {
      position: absolute;
      left: 0px;
      top: 0px;
      height: 100%;
      width: 270px;
      background: black;
      opacity: 0.2;
      z-index: 1;
    }
  }
}

.card {

  &-wrapper {
    position: relative;
    width: 100%;
    min-height: 282px;
    display: flex;

    & article {
      display: flex;
    }
  }

  &-left {
    min-height: 282px;
    width: 50%;
    background-color: #283964;
    background-image: url(../../../static/images/parti.svg);
    background-repeat: no-repeat;
    background-position: 95% center;
  }

  &-right {
    position: relative;
    min-height: 282px;
    width: 50%;
    background-image: linear-gradient(to left, #7a65ef, #a955e6);

    & div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 35px;
      content: url(../../../static/images/LandingPerson.svg);
    }
  }

  &-absolute {
    position: absolute;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  &-bl {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding-top: 45px;
    padding-bottom: 70px;
    overflow: hidden;

    & h2 {
      font-family: 'GT Walsheim Pro Bold';
      font-size: 25px;
      margin-bottom: 20px;
      color: white;
    }

    & p {
      font-family: 'SF UI Display Medium';
      max-width: 470px;
      font-size: 18px;
      line-height: 28px;
      color: white;
    }

    & a {
      display: flex;
      width: 187px;
      height: 50px;
      border-radius: 5px;
      background-image: linear-gradient(to right, #1d9aed, #318aff);
    }
  }
  &-end {
    padding-left: 75px;
  }
}

.mobile-wrapper {
  min-height: 537px;
  width: 100%;

  & article {
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

  & h2 {
    font-family: 'GT Walsheim Pro Bold';
    font-size: 38px;
    color: #283964;
    margin-bottom: 15px;
  }

  & p {
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
  background-size: 80%;
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

  & span {
    font-family: 'GT Walsheim Pro Medium';
    font-size: 16px;
    letter-spacing: 1.3px;
    color: white;
  }

  & img {
    margin-right: 12px;
    margin-bottom: 5px;
  }
}

.footer-wrapper {
  min-height: 360px;
  width: 100%;
  background: #efeff1;
}

.mobile-store-mini {
  height: 45px;
}

.slick-slide {
  border: 0px;
  outline: none;
}

.slide-allEvents {
  margin: 13px;
  margin-bottom: 30px;
}

.sl-sale-free {
  color: #24b55e!important;
}

@media screen and (min-width: 1390px) {
  button[aria-label="Previous page"] {
    margin-left: -30px;
  }
  button[aria-label="Next page"] {
    margin-right: -30px;
  }
}

@media screen and (max-width: 1350px) {
  .slide {
    margin: 10px auto;
  }
  .slick-previus {
    left: -75px;
  }
  .slick-nexts {
    right: -75px;
  }
  .slider {
    width: 850px;
    margin: 30px auto;
  }
}

@media screen and (max-width: 1240px) {
  .popular__bls {
    justify-content: flex-start;
  }
  .popular__bl {
    margin-right: 80px;
    &:nth-child(3n) {
      margin-right: 0px;
    }
  }
  .slick-previus {
    left: -75px;
  }
  .slick-nexts {
    right: -75px;
  }
}

@media screen and (max-width: 1240px) {
  .card-absolute {
    width: 992px;
  }
}

@media screen and (max-width: 1056px) {
  .slider {
    width: 800px;
    margin: 0 auto;
  }
  .slick-previus {
    left: -65px;
  }
  .slick-nexts {
    right: -65px;
  }
}

@media screen and (max-width: 1012px) {
  .mobile-wrapper {
    min-height: auto;
  }
  .mobile-wrapper article {
    flex-direction: column;
  }
  .mobile-bl {
    width: 100%;
    height: auto;
    padding-top: 35px;
  }
  .mobile-bl-mob {
    margin-top: 30px;
    height: 250px;
    background-size: contain;
    background-position: bottom center;
  }
  .card-wrapper {
    flex-direction: column;
  }
  .card-absolute {
    position: relative;
    width: 100%;
    height: auto;
    left: auto;
    transform: translateX(0px);
    & article {
      flex-direction: column;
      max-width: 1015px;
      width: 100%;
      margin: auto;
    }
  }
  .card-bl {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 35px;
    padding-top: 35px;
    background: #283964;
  }
  .card-end {
    background-image: linear-gradient(to left, #7a65ef, #a955e6);
  }
  .card-bl {
    width: 100%;
  }
  .card-left {
    display: none;
  }
  .card-right {
    display: none;
  }
  .slide-article .head2 {
    line-height: normal;
    font-size: 24px;
  }
  .slider {
    width: 100%;
    margin: 30px auto;
  }
  .slick-previus {
    left: -60px;
  }
  .slick-nexts {
    right: -60px;
  }
  .slide {
    width: 280px;
  }
  .slide__cnt .sl-title {
    font-size: 20px;
  }
  .slide__cnt .sl-date {
    font-size: 15px;
  }
  .popular__bls {
    justify-content: space-around;
  }
  .popular__bl {
    margin-right: 0px;
  }
  .content-wrapper {
    min-height: auto;
  }
  .content-article {
    padding-top: 85px;
    padding-bottom: 85px;
    padding-right: 50px;
    & h1 {
      font-size: 34px;
      max-width: 500px;
      line-height: normal;
    }

    & a {
      margin-top: 30px;
    }
  }
  .slide {
    margin: 10px 50px;
  }
}

@media screen and (max-width: 900px) {
  .slide {
    margin: 10px auto;
  }
  .slick-dots {
    bottom: -30px;
  }
  .slick-dots {
    li {
      background: #a4adba;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      button {
        opacity: 0;
      }
    }
    .slick-active {
      background: #2c8ffb;
    }
  }
}

@media screen and (max-width: 765px) {
  .popular__bl {
    margin-right: 0px;
  }
  .mobile-store {
    margin: 0 auto;
  }
  .card-bl p {
    font-size: 16px;
  }
  .card-bl h2 {
    font-size: 23px;
  }
  .slide-article {
    padding-top: 25px;
  }
  .mobile-bl h2 {
    line-height: auto;
    font-size: 25px;
  }
  .mobile-bl p {
    font-size: 16px;
  }
  .popular__bls {
    flex-direction: column;
    align-items: center;
  }
  .popular .head2 {
    font-size: 24px;
  }
}
</style>
