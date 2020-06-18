/*
 * @Description: 业务生成器归档混入
 */
import {
  GetOFSDocConfig,
  OFSDocumentSaving
} from '../../../service/Document.api.js'
export default {
  data () {
    return {
      isShowOFSFolder: false,
      sysFolderId: '',
      OFSSelectFloder: {},
      OFSSelectedFolderPath: ''
    }
  },
  methods: {
    /**
     * [入口]业务生成器归档
     */
    doOFSFiling () {
      // 当前任务
      let _task = this.selectTask
      // 请求-参数
      let param = {
        taskId: _task.taskId,
        id: _task.id,
        title: _task.title,
        moduleCode: _task.moduleCode,
        unitName: _task.unitName,
        fkeY1: _task.fkeY1,
        processCode: _task.processCode,
        parentStr: _task.parentStr
      }
      // 请求-获取归档配置
      GetOFSDocConfig(param).then(res => {
        let ofsEntity = res.data
        this.sysFolderId = ofsEntity.f_DOC_FOLDER_ID
        // 无需归档 - 继续发送
        if (!ofsEntity.f_IS_DOC) {
          this.callback({ result: 'ok', msg: '无需归档' })
          return true
        }
        // 判断是否需选择路径
        let isNeedShowDialog = false
        if (!ofsEntity.f_DOC_FOLDER_ID || ofsEntity.f_DOC_FOLDER_ID === ';' || ofsEntity.f_IS_SHOW_DOC_SELECT) {
          isNeedShowDialog = true
        }
        // 需归档 - 选择路径
        if (isNeedShowDialog) {
          this.isShowOFSFolder = true
          return true
        }
        // 需归档 - 直接归档
        if (!isNeedShowDialog) {
          this.doOFSSaveing()
          return true
        }
      })
    },
    // 调用归档接口
    doOFSSaveing () {
      // 当前任务
      let _task = this.selectTask
      // 请求-参数
      let params = {
        taskId: _task.taskId,
        id: _task.id,
        title: _task.title,
        fkeY1: _task.fkeY1,
        formName: _task.fkeY1,
        processCode: _task.processCode,
        parentStr: this.OFSSelectFloder.Id
      }
      OFSDocumentSaving(params, _task.moduleCode).then(res => {
        if (!res.success) {
          this.callback({ result: 'failure', msg: res.errMsg })
          // this.$message.warning(res.errMsg)
        }
        if (res.success) {
          this.callback({ result: 'success', msg: '归档成功' })
          // this.$message.success('归档成功')
          // this.isEndForNoDialog && this.isInFlow ? this.flowEndWithNoDialog() : this.flowEnd()
        }
      })
    },
    OFSFolderData (data) {
      this.isShowOFSFolder = false
      this.OFSSelectFloder = data
      // this.OFSSelectedFolderPath = data.Path
      this.doOFSSaveing()
    },
    OFSCloseDialog () {
      this.isShowOFSFolder = false
      this.callback({ result: 'cancel', msg: '取消归档' })
    }
  }
}
