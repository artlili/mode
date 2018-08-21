<template lang='pug'>
div.main-wrapper(
  :style={ background: 'url("~/assets/images/index.png")' }
)
  Container
    article.main-article
      ReturnSearch
      ul.nav-category
        li Бег
        li Тренировка
      h1 Санкт-Петербургский полумарафон 25 км
      ul.buttons
        li.start-part(
          v-if="$route.params.state == 'join-event'"
        )
          a(href='#')
            span.title Принять участие
            span.sale 500 ₽
        li.end-part(
          v-if="$route.params.state == 'in-event'"
        )
          a(href='#')
            span Отменить участие
        li.rating(
          v-if="$route.params.state == 'result'"
        )
          a(href='#')
            span Получить результат
        li.like(
          v-if="$route.params.state == 'join-event'"
        )
          Like.like-component
        li.share(
          v-if="($route.params.state == 'join-event') || ($route.params.state == 'in-event')"
        )
          a(href='#')
            img(src='../../../static/images/share.png')
</template>

<script>
import Container from 'src/elements/Container';
import ReturnSearch from './ReturnSearch';
import Like from '../main/Like';

export default {
  components: {
    Container,
    ReturnSearch,
    Like,
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.buttons {
  display: flex;
  margin-top: 40px;

  li {
    height: 60px;
    border-radius: 4px;
    background-image: linear-gradient(to right, #1d9aed, #318aff);
    margin-right: 20px;
    cursor: pointer;
    list-style: none;
  }
}

.share a{
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.like,
.share {
  position: relative;
  width: 60px;
}

.like-component {
  left: 50%;
  top: 50%;
  right: 0px;
  margin-left: -14px;
  margin-top: -13px;
}

.start-part,
.end-part,
.rating {
  position: relative;
  max-width: 290px;
  width: 100%;

  a {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 23.5px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }

  span {
    font-family: 'GT Walsheim Pro Medium', Arial;
    font-size: 16px;
    letter-spacing: 1.2px;
    color: white;
    text-transform: uppercase;
  }
}


.end-part a,
.rating  a{
  justify-content: center;
}


.start-part .sale {
  font-family: 'GT Walsheim Pro Bold', Arial;
}

.main-wrapper {
  width: 100%;
}

.main-article {
  position: relative;
  min-height: 600px;
  padding-top: 340px;
  padding-bottom: 70px;
}

.nav-category {
  display: flex;

  li {
    font-family: 'GT Walsheim Pro Medium', Arial;
    font-size: 16px;
    letter-spacing: 1.3px;
    color: white;
    margin-right: 30px;
    text-transform: uppercase;

    &:before {
      color: white;
    }

    &:first-child {
      list-style: none;
    }
  }
}


h1 {
  font-family: 'GT Walsheim Pro Bold', Arial;
  font-size: 45px;
  color: white;
  margin-top: 15px;
}
</style>
