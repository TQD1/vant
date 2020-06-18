// 表单 流程发起上下文查询接口
let StartQuery = (param) => {
  return window.$LO.http.post('/Workflow/v2/Task/StartQuery', param)
}

// 表单流程发起上下文提交接口
let Start = (param) => {
  return window.$LO.http.post('/Workflow/v2/Task/Start', param)
}

// 任务基础信息
let TaskInfo = (taskId) => {
  return window.$LO.http.get('/Workflow/v2/Task/GetBaseInfo?taskId=' + taskId)
}

// 任务发送获取上下文查询接口
let SmartAdvanceQuery = (param) => {
  return window.$LO.http.post('/Workflow/v2/Task/SmartAdvanceQuery', param)
}
// 任务发送获取上下文查询接口
let SmartAdvance = (param) => {
  return window.$LO.http.post('/Workflow/v2/Task/SmartAdvance', param)
}

export {
  StartQuery,
  Start,
  TaskInfo,
  SmartAdvanceQuery,
  SmartAdvance
}
