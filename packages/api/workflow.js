import Vue from 'vue'
import LoWorkflow from '../components/LOWorkflow'
import { TaskInfo } from '../service/Workflow.api'

// 表单发起
// 参数：formStart：{flowCode, flowVersion, recordId}
const formStart = (args, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  const Component = Vue.extend({
    template: '<LoWorkflow></LoWorkflow>',
    methods: {
      callback: callback
    },
    data () {
      return {
        flowArgs: args,
        type: 'start'
      }
    },
    components: {
      LoWorkflow
    }
  })
  let instance = new Component().$mount()
  document.body.appendChild(instance.$el)
}
// 流程发送
// 参数：task:{
// "taskId": 10001,
// "remark": "处理意见",
// "result": "同意"
// }
const send = (args, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  const Component = Vue.extend({
    template: '<LoWorkflow></LoWorkflow>',
    methods: {
      callback: callback
    },
    data () {
      return {
        flowArgs: args,
        type: 'advance'
      }
    },
    components: {
      LoWorkflow
    }
  })
  let instance = new Component().$mount()
  document.body.appendChild(instance.$el)
}

// 任务基础信息
// 参数：taskId
const taskInfo = (taskId, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  TaskInfo(taskId).then(res => {
    if (res.success) {
      callback(res)
    } else {
      this.$message.error(res.errMsg)
    }
  })
}

export { formStart, send, taskInfo }
