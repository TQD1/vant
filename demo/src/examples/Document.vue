<template>
  <div class="document">
    <p><b>公文需参数</b>：taskId,moduleCode</p>
    <p><b>业务生成器需参数</b>：taskId,moduleCode,id,title,unitName.fkeY1,processCode,parentStr</p>
    <p>
      <el-input type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="textarea">
      </el-input>
    </p>
    <p class="btn">
      <el-button size="medium"
                 type="primary"
                 @click="doFiling()">点我归档</el-button>
    </p>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      textarea: `{"taskId":"444247","id":"100055","title":"归档: GF归档表单流程(100055)","moduleCode":"GTPOnlineForm.NF20200107032823Module","unitName":"归档","fkeY1":"GTPOnlineForm.NF20200107032823","processCode":"GTPOnlineForm.NF20200107032823Module100001"}`
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    doFiling () {
      this.$LO.Gd(JSON.parse(this.textarea), this.doFilingCallBack)
    },
    doFilingCallBack (data) {
      // 归档成功
      if (data.result === 'success') {
        this.$message.success('归档成功')
        this.isEndForNoDialog ? this.flowEndWithNoDialog() : this.flowEnd()
        return true
      }
      // 无需归档
      if (data.result === 'ok') {
        this.isEndForNoDialog ? this.flowEndWithNoDialog() : this.flowEnd()
        return true
      }
      // 归档失败
      if (data.result === 'failure') {
        this.$message.warning(data.msg)
        return false
      }
      // 无权限
      if (data.result === 'noaccess') {
        this.$alert(data.msg, '提示')
        return false
      }
      // 用户取消归档
      if (data.result === 'cancel') {
        return false
      }
    }
  },
  watch: {}
}
</script>

<style scoped>
.document {
  padding: 40px;
}
p {
  margin-top: 20px;
}
p.btn {
  margin-top: 40px;
}
</style>
