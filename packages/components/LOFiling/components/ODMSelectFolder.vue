<!--suppress ALL -->
<template>
  <el-dialog v-if="showStatus"
             :close-on-click-modal="false"
             width="600px"
             class="odm-select-folders"
             title="选择归档文件夹"
             :before-close="closeDialog"
             :close-on-press-escape="false"
             :visible.sync="showStatus">
    <div class="lo-dialog__body border">
      <el-tree :data="dataList"
               v-if="showStatus"
               :show-checkbox="true"
               empty-text=""
               :default-expanded-keys="defaultExpandedKeys"
               class="lo-el-tree"
               :props="defaultProps"
               highlight-current
               :expand-on-click-node="false"
               :load="getOrgList"
               lazy
               @check="checkGroupNode"
               :check-strictly="true"
               node-key="id"
               ref="tree"
               :render-content="renderContent"></el-tree>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <div class="third-party-systems"
           v-if="thirdPartySystems.length > 0 && isShowThirdPartySystems">
        <el-checkbox v-model="isGuiDanSanFang"
                     @change="setSanFangXiTong">{{getSanFangXiTong()}}</el-checkbox>
      </div>
      <el-button type="primary"
                 @click="sendData">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetDocumentSavingList } from '../../../service/Document.api'
export default {
  name: 'SelectFolders',
  props: {
    docObjectID: {
      type: Number,
      default: 0
    },
    taskId: {
      type: String,
      default: '0'
    },
    isAllowDocumentSaving: {
      type: Boolean,
      default: false
    },
    isShowThirdPartySystems: {
      type: Boolean,
      default: false
    },
    isSelectThirdPartySystems: {
      type: Boolean,
      default: false
    },
    thirdPartySystems: {
      type: Array,
      default: () => []
    },
    openSource: {
      type: String,
      default: null
    },
    moduleCode: {
      type: String,
      default: null
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    fDocFolderId: {
      type: String
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      dataList: [],
      defaultExpandedKeys: [],
      checkedSystem: '',
      isGuiDanSanFang: false
    }
  },
  mounted () {
    this.getDeptAndUsers(true)
    if (this.isSelectThirdPartySystems) {
      this.checkedSystem = this.thirdPartySystems[0]
      // 复选框默认选择
      this.isGuiDanSanFang = true
    }
  },
  methods: {
    getSanFangXiTong () {
      if (this.thirdPartySystems.length > 0) {
        return this.thirdPartySystems[0]
      } else {
        return ''
      }
    },
    /**
     * 用于单选取消
     * 20190929确定需求，三方系统只能单选
     */
    setSanFangXiTong (isSelected) {
      if (isSelected) {
        this.checkedSystem = this.thirdPartySystems[0]
      } else {
        this.checkedSystem = ''
      }
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class={data.className}></i>
          <span class="node">{data.name}</span>
        </span>
      )
    },
    closeDialog () {
      this.checkedSystem = ''
      this.$emit('closeDialog')
    },
    /**
     * 选择归档目录后确定
     */
    sendData () {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      if (checkedNodes.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择归档目录',
          duration: '2000'
        })
        return
      }
      let data = {
        folder: checkedNodes,
        thirdPartyName: this.checkedSystem,
        openSource: this.openSource
      }
      this.checkedSystem = ''
      this.$emit('folderData', data)
    },
    /**
       * 懒加载树获取组织机构子节点
       * element-tree使用方法
       * @param node:当前点击节点信息
       * @param resolve:传递参数方法
       * */
    getOrgList (node, resolve) {
      if (node.level === 0) {
        return resolve(this.dataList)
      } else {
        GetDocumentSavingList(false, node.data.id, node.data.operCode, this.moduleCode).then(res => {
          let myList = []
          res.data.forEach(itm => {
            myList.push({
              // isLeaf: !itm.isFolder,
              className: 'icon-folder',
              ...itm
            })
          })
          resolve(myList)
        }).catch(res => {
          resolve([])
        })
      }
    },
    getDeptAndUsers (isRoot) {
      GetDocumentSavingList(isRoot, null, null, this.moduleCode).then(res => {
        let data = res.data
        data.forEach(t => {
          this.dataList.push({
            className: 'icon-folder-root',
            ...t
          })
        })
        this.dataList[0].disabled = true
        this.defaultExpandedKeys.push(this.dataList[0].id)
      }).catch(res => {
      })
    },
    // 单选
    checkGroupNode (node, b) {
    }
  },
  watch: {
    isSelectThirdPartySystems () {
      if (this.isSelectThirdPartySystems) {
        this.checkedSystem = this.thirdPartySystems[0]
      }
    }
  }
}
</script>

<style scoped>
.odm-select-folders .lo-dialog__body {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  height: 338px;
  padding: 8px;
  border: 1px solid #e1e1e1;
}
.odm-select-folders .user-query {
  margin-bottom: 15px;
  height: 28px;
}
.odm-select-folders .lo-el-tree {
  flex: 1;
  overflow-y: scroll;
  width: 100%;
}
.odm-select-folders .lo-footer {
  margin-top: 20px;
  text-align: right;
}
.ellipsis {
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #393939;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
}
.third-party-systems {
  display: inline-block;
  float: left;
  margin-left: 2px;
}
.third-party-systems .label {
  margin-bottom: 10px;
  padding-top: 10px;
}
.dialog-footer:after {
  overflow: hidden;
  visibility: hidden;
  height: 0;
  content: "";
  clear: both;
}
.odm-select-folders >>> .el-tree-node__content span.expanded.el-tree-node__expand-icon ~ span.custom-tree-node > .icon-folder{
    background-image: url("../../../assets/image/LOFiling/icon-folder-new-open.png");
}
.odm-select-folders >>> .el-dialog__header{
    padding: 20px 20px 0px 15px;
    line-height: 16px;
}
.odm-select-folders >>> .el-dialog__header .el-dialog__title{
    line-height: 16px;
    font-size: 16px;
    color: #0e0e0e;
}
.odm-select-folders .dialog-footer >>> .el-button{
    width: 70px;
    padding: 7px 22px!important;
    font-size: 13px;
    height: 30px;
    margin-left: 10px;
}
.odm-select-folders .dialog-footer >>> .el-button--primary{
    color: #ffffff;
    background-color: #3b8dee;
    border-color: #3b8dee;
}
.odm-select-folders  >>> .el-checkbox__inner{
  border: 1px solid #999;
}
</style>
<style>
/*滚动条的宽度*/
.odm-select-folders ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
/*滚动条的滑块*/
.odm-select-folders ::-webkit-scrollbar-thumb {
  background: #e2e3e8;
  border-radius: 5px;
  cursor: pointer;
}
.odm-select-folders .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.odm-select-folders .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #e2e3e8;
  border-radius: 5px;
  cursor: pointer;
}
.odm-select-folders
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e2e8f1;
}
.odm-select-folders .custom-tree-node {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.odm-select-folders .custom-tree-node .node {
  color: #3c3c3c;
  font-family: "Microsoft YaHei";
}
.odm-select-folders .custom-tree-node .icon-folder {
  display: inline-block;
  width: 16px;
  height: 16px;
  padding-left: 5px;
  background-position: 0 center;
  background-repeat: no-repeat;
  background-image: url("../../../assets/image/LOFiling/icon-folder-new.png");
}
.odm-select-folders .custom-tree-node .icon-folder-root {
  display: inline-block;
  width: 16px;
  height: 16px;
  padding-left: 5px;
  background-position: 0 center;
  background-repeat: no-repeat;
  background-image: url("../../../assets/image/LOFiling/icon-folder-root.png");
}
.odm-select-folders .el-dialog__header {
  padding-bottom: 0;
}
.odm-select-folders .el-dialog__body {
  padding: 10px 20px;
}
.odm-select-folders .el-table__body tr.current-row {
  background: #ecf5ff;
}
</style>
