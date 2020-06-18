<template>
  <div class="document">
    <!-- <p class="code-content">
      <el-input placeholder="请输入内容"
                v-model="textarea"> </el-input>
    </p>
    <el-select v-model="sendType"
               placeholder="请选择ui类型">
      <el-option v-for="item in list"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <p class="btn">
      <el-button @click="openSendBox">点我弹出发送</el-button>
    </p> -->
    <!-- <p>
      表单发起
    </p>
    <p class="code-content">
      单选： <el-input placeholder="表单发起参数"
                v-model="formParmaDanXuan"> </el-input>
    </p>
    <p class="btn">
      <el-button @click="openStartBox(formParmaDanXuan)">表单发起</el-button>
    </p>
    <p>
      表单发起
    </p> -->
    <p class="code-content">
      全选： <el-input placeholder="表单发起参数"
                v-model="formParamQuanXuan"> </el-input>
    </p>
    <p class="btn">
      <el-button @click="openStartBox(formParamQuanXuan)">表单发起</el-button>
    </p>
    <p>
      表单发起
    </p>
    <p class="code-content">
      任意： <el-input placeholder="表单发起参数"
                v-model="formParamRenYi"> </el-input>
    </p>
    <p class="btn">
      <el-button @click="openStartBox(formParamRenYi)">表单发起</el-button>
    </p>
    <p class="code-content">
      任务ID号 <el-input placeholder="任务ID号"
                v-model="taskId"> </el-input>
    </p>
    <p class="btn">
      <el-button @click="openTaskInfo(taskId)">任务基础信息</el-button>
    </p>
     <p class="code-content">
      任务发送 <el-input placeholder="发送参数"
                v-model="taskSend"> </el-input>
    </p>
    <p class="btn">
      <el-button @click="openTaskSend(taskSend)">任务发送</el-button>
    </p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      sendType: '',
      textarea: `全选弹框：1000； 单选弹框：1001； 任意弹框：1002`,
      formParmaDanXuan: JSON.stringify({
        'flowCode': 'Process100451',
        'flowVersion': 0,
        'recordId': '103904'
      }),
      formParamQuanXuan: JSON.stringify({ flowCode: 'GTPOnlineForm.NF20191120021441Module100201',
        flowVersion: 0,
        recordId: '103904' }),
      formParamRenYi: JSON.stringify({ flowCode: 'Process100402',
        flowVersion: 0,
        recordId: '103904' }),
      list: [
        {
          value: '1000',
          label: '全选弹框'
        },
        {
          value: '1001',
          label: '单选弹框'
        },
        {
          value: '1003',
          label: '任意弹框'
        }
      ],
      taskId: 610429,
      taskSend: JSON.stringify({
        taskId: 613840,
        result: '同意',
        remark: '意见'
      })
    }
  },
  computed: {},
  created () { },
  mounted () {

  },
  methods: {
    openSendBox () {
      this.$LO.Workflow.send(this.sendType, (data) => {
        console.log(data)
      })
    },
    openStartBox (param) {
      this.$LO.Workflow.formStart(JSON.parse(param), (data) => {
        console.log(data)
      })
    },
    openTaskInfo (taskId) {
      this.$LO.Workflow.taskInfo(taskId, (data) => {
        console.log(data)
      })
    },
    openTaskSend (taskSend) {
      debugger
      this.$LO.Workflow.send(JSON.parse(taskSend), (data) => {
        console.log(data)
      })
    }
  },
  watch: {}
}
</script>

<style scoped>
.code-content {
  margin: 20px 0;
}
.btn {
  margin: 20px 0;
}
</style>
