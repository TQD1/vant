<template>
  <div class="example-org">
    <el-button @click="selectOrg">弹出组织</el-button>
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
  created () {},
  mounted () {},
  methods: {
    selectOrg () {
      let executors = JSON.parse(`[{"__hash":"23415576","fullId":"1.D/1001.D/1010.D/1016.D/1058.S","IDIsFull":true,"fullName":"外事办/综合处/产品中心/标准产品部/郭峰","Order":0,"sex":0,"isMap":false,"Controller":false,"MustSelect":false,"selected":true},{"__hash":"45055423","fullId":"1.D","IDIsFull":false,"fullName":"外事办","Order":0,"sex":-1,"isMap":false,"Controller":false,"MustSelect":false,"selected":false},{"__hash":"55728730","fullId":"1001.R","idIsFull":false,"fullName":"xuy测试角色","Order":0,"sex":-1,"isMap":false,"Controller":false,"MustSelect":false,"selected":false}]`)
      executors.forEach(element => {
        element.name = this.nameExecutor(element.fullName)
        element.id = this.idExecutor(element.fullId)
      })
      let options = {
        executors
      }
      this.$LO.Org.selectWorkflowOrg(options, () => {

      })
    },
    nameExecutor (name) {
      console.log(name)
      let lastName = name.split('/')
      return lastName[lastName.length - 1]
    },
    idExecutor (id) {
      let lastName = name.split('/')
      let dot = lastName[lastName.length - 1]
      return dot.split('.')[0]
    }
  },
  watch: {}
}
</script>

<style scoped>
div{
  box-sizing: border-box;
}
.example-org{
  padding: 10px;
}
</style>
