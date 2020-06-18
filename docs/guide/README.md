---
sidebar: auto
---

# locmp使用

::: warning 注意
目前仅供vue项目使用
:::

配置一步到位
```js
npm i git+http://geek.glodon.com/scm/glk/gtpvue.git#release/1.0.0

import LoCmp from 'locmp'

Vue.use(LoCmp)
```
## 归档

**调用方式**
```js
/**
 * 归档
 * @param {Object} task 审批任务
 * @param {function} callback 回调函数
 */
this.$LO.Gd = function(task, callback){...}
```
**参数说明**


公文需参数：taskId,moduleCode

业务生成器需参数：taskId,moduleCode,id,title,unitName.fkeY1,processCode,parentStr

```json
{"taskId":"444247","id":"100055","title":"归档: GF归档表单流程(100055)","moduleCode":"GTPOnlineForm.NF20200107032823Module","unitName":"归档","fkeY1":"GTPOnlineForm.NF20200107032823","processCode":"GTPOnlineForm.NF20200107032823Module100001"}
```

**示例代码:**

```js
    doFiling () {
      this.$LO.Gd(this.selectTask, this.doFilingCallBack)
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
```

## 组织选择器