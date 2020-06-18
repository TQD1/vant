/*
 * @Description: 归档混入
 */
import {
  DocumentSaving,
  GetODMDocConfig,
  DocumentSavingToThirdParty,
  DetermineDefaultArchivePath
} from '../../../service/Document.api.js'
export default {
  data () {
    return {
      ODMSelectFloder: {
        showStatus: false
      },
      // 归档部分
      isClickSendBtnGuiDang: true, // 是否点击发送按钮走的归档
      IsAllowGongWenGuiDang: false, // 是否允许归档
      // 是否可以归档查询数据
      guiDangData: {
        isShowDialog: true,
        isAllowDocumentSaving: false,
        isAllowDocumentSavingToThirdPartySystems: false,
        docObjectID: 0,
        isShowThirdPartySystems: false,
        isSelectThirdPartySystems: false,
        thirdPartySystems: []
      },
      receptFolderData: {
        folder: {},
        thirdPartyName: ''
      }
    }
  },
  methods: {
    doODMFiling () {
      this.isAllowDocumentSavingQuery()
    },
    // 查询是否可以归档, mustTipEndNode是正常的结束节点
    // 用于[公文详情页]判断归档 和 [待办列表 - 单条发送时]判断归档
    isAllowDocumentSavingQuery () {
      GetODMDocConfig([this.selectTask.taskId]).then(res => {
        // 无效数据
        if (!res.data || res.data.length < 1) {
          return false
        }
        this.guiDangData = res.data[0]
        this.IsAllowGongWenGuiDang = this.guiDangData.isAllowGongWenGuiDang
        if (this.isInFlow) {
          // 是流程触发的归档操作，流程发送结束节点操作，提示是否需要归档
          if (!this.guiDangData.isGd && this.IsAllowGongWenGuiDang) {
            // 有归档直接走
            this.docSaving()
          } else {
            this.callback({ result: 'ok', msg: '无需归档' })
          }
        } else {
          this.docSaving()
        }
      })
    },
    // 是否清稿判断
    isQg () {
      if (!this.guiDangData.isQg) {
        this.$confirm('还未清稿，是否归档?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.docSaving()
          })
          .catch(() => { })
      } else {
        this.docSaving()
      }
    },
    // 是否清稿提示回调
    docSaving () {
      if (this.guiDangData.isAllowDocumentSaving && !this.guiDangData.isShowDialog) {
        DetermineDefaultArchivePath(this.selectTask.taskId).then(res => {
          let data = res.data
          if (data.noAuthorityName.length > 0) {
            this.callback({ result: 'noaccess', msg: '无归档权限' })
          }
          if (data.authority.length > 0) {
            this.documentSaving([data.authority[0]])
          }
        })
      } else if (this.guiDangData.isShowDialog) {
        this.ODMSelectFloder.showStatus = true
      }
    },
    // 查询是否可以归档-点击发送结束节点
    isAllowDocumentSavingQuerySendEnd () {
      this.isAllowDocumentSavingQuery(true)
    },
    documentSaving (docObjectIDs) {
      DocumentSaving({ taskId: this.selectTask.taskId, docObjectIDs: docObjectIDs }, this.selectTask.moduleCode).then(res => {
        if (
          this.guiDangData.isShowThirdPartySystems &&
          this.receptFolderData.thirdPartyName
        ) {
          this.documentSavingToThirdParty(res.data)
        } else {
          if (res.success) {
            this.callback({ result: 'success', msg: '归档成功' })
          }
          if (!res.success) {
            this.callback({ result: 'failure', msg: res.errMsg })
          }
          // if (res.success) {
          //   this.$message({
          //     type: 'success',
          //     message: '归档成功',
          //     duration: '1000',
          //     onClose: () => {
          //     }
          //   })
          //   if (this.isClickSendBtnGuiDang) {
          //     if (this.isEndForNoDialog) {
          //       this.isEnd2()
          //     } else {
          //       this.isEnd()
          //     }
          //   }
          // }
        }
      })
    },
    // 归档到第三方
    documentSavingToThirdParty (docObjectID) {
      DocumentSavingToThirdParty(
        docObjectID,
        this.receptFolderData.thirdPartyName,
        this.selectTask.moduleCode
      ).then(res => {
        if (res.success) {
          this.callback({ result: 'success', msg: '归档成功' })
          // this.$message({
          //   type: 'success',
          //   message: '归档成功',
          //   duration: '1000',
          //   onClose: () => { }
          // })
          // if (this.isClickSendBtnGuiDang) {
          //   if (this.isEndForNoDialog) {
          //     this.isEnd2()
          //   } else {
          //     this.isEnd()
          //   }
          // }
        }
        if (!res.success) {
          this.callback({ result: 'failure', msg: res.errMsg })
        }
      })
    },
    // 接受归档文件选择器的数据
    ODMFolderData (data) {
      // 隐藏显示
      this.ODMSelectFloder.showStatus = false
      this.receptFolderData = data
      // 归档文件夹id集合
      let docObjectIDs = []
      data.folder.forEach(element => {
        docObjectIDs.push(element.id)
      })
      this.documentSaving(docObjectIDs)
    },
    ODMCloseDialog () {
      this.ODMSelectFloder.showStatus = false
      this.callback({ result: 'cancel', msg: '取消归档' })
    }
  }
}
