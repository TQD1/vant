<template>
  <div id="app">
    <div class="header">
      <Header></Header>
    </div>
    <div class="container">
      <Container></Container>
    </div>
  </div>
</template>
<script>
import Header from './views/header'
import Container from './views/container'
import { devProxySetCookie } from './units/dev-app'
export default {
  name: '',
  components: {
    Header,
    Container
  },
  props: {},
  data () {
    return {
    }
  },
  computed: {},
  created () {
    devProxySetCookie()
  },
  mounted () { },
  methods: {},
  watch: {}
}
</script>

<style scoped lang="less">
@header-h:80px;
@header-w:1200px;
#app {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 800px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  .header {
    width: @header-w;
    height: @header-h;
  }
  .container {
    width: @header-w;
    position: absolute;
    top: @header-h;
    bottom: 0;
  }
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
}
html,body{
  height: 100%;
  overflow: hidden;
}
div,
span {
  box-sizing: border-box;
}
</style>
