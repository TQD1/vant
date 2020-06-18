<template>
  <div class="bottom">
    <div class="nav">
        <router-link class="nav-item" to="document">归档</router-link>
        <router-link class="nav-item" to="workflow">流程</router-link>
        <router-link class="nav-item" to="org">组织</router-link>
    </div>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {},
  watch: {}
}
</script>

<style scoped lang='less'>
.bottom {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}
.nav,
.view {
  display: inline-block;
  height: 100%;
}
.nav {
  width: 240px;
  .nav-item{
    display: block;
    height: 40px;
    color: #444;
    line-height: 40px;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
  }
}
.view {
  width: calc(100% - 240px);
}
.nav /deep/ .nav-item.router-link-active{
  color: rgb(45, 140, 240);
  font-weight: bold;
}
</style>
