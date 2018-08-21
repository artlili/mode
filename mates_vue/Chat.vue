<template lang='pug'>
  .chat.
    Container.chat__wrapper
      .chat__tabs
        .chat__tab
          Обсуждение
          
        .chat__tab
          Чат с организатором

</template>

<script>
  import Container from 'src/elements/Container';

  function data() {
    return {};
  }

  const props = {};

  const computed = {};

  const methods = {};

  const components = {
    Container,
  };

  export default {
    name: 'chat',
    props,
    data,
    computed,
    methods,
    components,
  };
</script>

<style lang="scss">
  .chat {
    background-color: $gray;

    &__wrapper {
      background-color: $white;
    }

    &__tabs {
      display: flex;
      flex-flow: row nowrap;
      padding: 37px 30px;
      color: $nightBlue;
    }

    &__tab {
      font-size: 25px;
      font-family: $WalsheimBold;
    }

    &__tab + &__tab {
      padding-left: 30px;
    }
  }
</style>
