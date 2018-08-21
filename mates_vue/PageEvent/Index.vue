<template lang='pug'>
div(
  v-if="($route.params.state == 'join-event') || ($route.params.state == 'in-event') || ($route.params.state == 'result')"
)
  .header-wrapper
    Header
  Main
</template>

<script>
import Header from '../main/HeaderPersoneAccount';
import Main from './Main';

export default {
  components: {
    Header,
    Main,
  },
};
</script>

