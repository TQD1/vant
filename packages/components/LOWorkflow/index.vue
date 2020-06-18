<template>
  <div>
    <TaskSendDialog ref="TaskSendDialog" :type="type" :flowArgs="flowArgs" />
  </div>
</template>

<script>
// import { Gd } from '@~/api/document'
import TaskSendDialog from './components/TaskSendDialog'
import {
  StartQuery,
  Start,
  SmartAdvanceQuery,
  SmartAdvance
} from '@~/service/Workflow.api'
export default {
  components: {
    TaskSendDialog
  },
  data () {
    return {
      flowArgs: {},
      type: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.type = this.$parent.type
    this.flowArgs = this.$parent.flowArgs
    switch (this.type) {
      case 'start': // 表单发起
        this.getFormStart()
        break
      case 'advance':
        this.getSmartAdvanceQuery()
        break
      default:
        this.$message.error('没有当前类型：' + this.type)
        break
    }
  },
  methods: {
    // 表单发起获取上下文
    getFormStart () {
      StartQuery(this.flowArgs).then((res) => {
        if (res.success) {
          let data = res.data
          this.opendialogHandler(data)
        } else {
          this.$message.error(res.errMsg)
        }
      })
    },
    // 流程发送|同意获取上下文
    getSmartAdvanceQuery () {
      SmartAdvanceQuery(this.flowArgs).then((res) => {
        if (res.success) {
          let data = res.data
          this.opendialogHandler(data)
        } else {
          this.$message.error(res.errMsg)
        }
      })
    },
    opendialogHandler (data) {
      this.$refs[`TaskSendDialog`].openDialogHandler(data)
    },

    callback (data) {
      if (typeof this.$parent.callback === 'function') {
        this.$parent.callback(data)
      }
    },

    // 任务确认发送
    setSendHandler (nextItems) {
      switch (this.type) {
        case 'start': // 表单发起
          this.setFormStart(nextItems)
          break
        case 'advance':
          this.setSmartAdvance(nextItems)
          break
        default:
          this.$message.error('没有当前类型：' + this.type)
          break
      }
    },
    // 表单发送
    setFormStart (nextItems) {
      var flowContext = {
        nextItems: nextItems
      }
      var param = {
        recordId: String(this.flowArgs.recordId),
        flowCode: String(this.flowArgs.flowCode),
        flowVersion: Number(this.flowArgs.flowVersion),
        flowContext: flowContext
      }
      debugger
      Start(param).then(res => {
        if (res.success) {
          this.$refs.TaskSendDialog.handleClose()
          this.$message.success('发送成功')
          this.callback(res)
        } else {
          this.$message.error(res.errMsg)
        }
      })
    },
    // 任务发送
    setSmartAdvance (nextItems) {
      var flowContext = {
        nextItems: nextItems
      }
      var param = {
        taskId: this.flowArgs.taskId,
        remark: this.flowArgs.remark,
        result: this.flowArgs.result,
        flowContext: flowContext
      }
      // Gd(task).then()
      // // 归档成功
      // if (data.result === 'success') {
      //   this.$message.success('归档成功')
      //   this.isEndForNoDialog ? this.flowEndWithNoDialog() : this.flowEnd()
      //   return true
      // }
      // // 无需归档
      // if (data.result === 'ok') {
      //   this.isEndForNoDialog ? this.flowEndWithNoDialog() : this.flowEnd()
      //   return true
      // }
      // // 归档失败
      // if (data.result === 'failure') {
      //   this.$message.warning(data.msg)
      //   return false
      // }
      // // 无权限
      // if (data.result === 'noaccess') {
      //   this.$alert(data.msg, '提示')
      //   return false
      // }
      // // 用户取消归档
      // if (data.result === 'cancel') {
      //   return false
      // }
      SmartAdvance(param).then(res => {
        if (res.success) {
          this.$refs.TaskSendDialog.handleClose()
          this.$message.success('发送成功')
          this.callback(res)
        } else {
          this.$message.error(res.errMsg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
