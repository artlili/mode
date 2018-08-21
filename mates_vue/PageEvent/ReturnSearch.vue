<template lang='pug'>
div(@click='back')
  img(src='../../../static/images/returnSearch.svg')
  p Результаты поиска
</template>

<script>
  export default {
    methods: {
      back() {
        this.$router.go(-1);
      },
    },
  };
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  top: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

img {
  margin-right: 10px;
}

p {
  font-family: 'GT Walsheim Pro Medium', Arial;
  color: #2c8ffb;
  font-size: 16px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
}
</style>
