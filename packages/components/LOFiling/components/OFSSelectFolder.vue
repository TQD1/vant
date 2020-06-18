<template>
  <el-dialog v-if="showStatus"
             :close-on-click-modal="false"
             width="600px"
             class="ofs-select-folders"
             title="选择归档文件夹"
             :before-close="closeDialog"
             :close-on-press-escape="false"
             :visible.sync="showStatus">
    <div class="lo-dialog__body border">
      <el-tree :data="dataList"
               :show-checkbox="true"
               empty-text=""
               class="lo-el-tree"
               :props="defaultProps"
               :default-expanded-keys="[0]"
               :expand-on-click-node="true"
               :load="getOrgList"
               lazy
               @check="checkGroupNode"
               :check-strictly="true"
               node-key="Id"
               ref="tree"
               :render-content="renderContent"></el-tree>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="sendData">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetOFSSubFolderByPId } from '../../../service/Document.api'
export default {
  name: 'OFSSelectFolder',
  props: {
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
      showStatus: false,
      dataList: [{
        Id: 0,
        isFolder: true,
        isLeaf: false,
        disabled: true,
        name: '文档中心',
        operCode: 7339992,
        parentID: 0,
        sort: 0,
        className: 'icon-folder-root'
      }],
      defaultExpandedKeys: [0]
    }
  },
  mounted () {
    this.showStatus = true
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class={data.className}></i>
          <span class="node">{data.name}</span>
        </span>
      )
    },
    closeDialog () {
      // this.showStatus = false
      // this.$LO.GdCallBack()
      this.$emit('closeDialog')
    },
    sendData () {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      if (checkedNodes.length === 0) {
        return
      }
      let data = checkedNodes[0]
      // data.Path = data.Path + data.Id + '/'
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
        GetOFSSubFolderByPId(node.data.Id).then(res => {
          let myList = []
          res.data.forEach(itm => {
            myList.push({
              isLeaf: itm.isLeaf,
              className: 'icon-folder',
              name: itm.Name.zh_CN,
              ...itm
            })
          })
          resolve(myList)
        }).catch(res => {
          resolve([])
        })
      }
    },
    // 单选
    checkGroupNode (node, b) {
      if (b.checkedNodes.length > 0) {
        this.$refs.tree.setCheckedKeys([node.Id])
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.ofs-select-folders .lo-dialog__body {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  height: 338px;
  padding: 8px;
  border: 1px solid #e1e1e1;
}
.ofs-select-folders .user-query {
  margin-bottom: 15px;
  height: 28px;
}
.ofs-select-folders .lo-el-tree {
  flex: 1;
  overflow-y: scroll;
  width: 100%;
}
.ofs-select-folders .lo-footer {
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
.ofs-select-folders >>> .el-tree-node__content span.expanded.el-tree-node__expand-icon ~ span.custom-tree-node > .icon-folder{
    background-image: url("../../../assets/image/LOFiling/icon-folder-new-open.png");
}
.ofs-select-folders >>> .el-dialog__header{
    padding: 20px 20px 0px 15px;
    line-height: 16px;
}
.ofs-select-folders >>> .el-dialog__header .el-dialog__title{
    line-height: 16px;
    font-size: 16px;
    color: #0e0e0e;
}
.ofs-select-folders .dialog-footer >>> .el-button{
    width: 70px;
    padding: 7px 22px!important;
    font-size: 13px;
    height: 30px;
    margin-left: 10px;
}
.ofs-select-folders .dialog-footer >>> .el-button--primary{
    color: #ffffff;
    background-color: #3b8dee;
    border-color: #3b8dee;
}
.ofs-select-folders  >>> .el-checkbox__inner{
  border: 1px solid #999;
}
</style>
<style>
/*滚动条的宽度*/
.ofs-select-folders ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
/*滚动条的滑块*/
.ofs-select-folders ::-webkit-scrollbar-thumb {
  background: #e2e3e8;
  border-radius: 5px;
  cursor: pointer;
}
.ofs-select-folders .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.ofs-select-folders .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #e2e3e8;
  border-radius: 5px;
  cursor: pointer;
}
.ofs-select-folders
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e2e8f1;
}
.ofs-select-folders .custom-tree-node {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.ofs-select-folders .custom-tree-node .node {
  color: #3c3c3c;
  font-family: "Microsoft YaHei";
}
.ofs-select-folders .custom-tree-node .icon-folder {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  padding-left: 5px;
  background-position: 0 center;
  background-repeat: no-repeat;
  background-image: url("../../../assets/image/LOFiling/icon-folder-new.png");
}
.ofs-select-folders .custom-tree-node .icon-folder-root {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  padding-left: 5px;
  background-position: 0 center;
  background-repeat: no-repeat;
  background-image: url("../../../assets/image/LOFiling/icon-folder-root.png");
}
.ofs-select-folders .el-dialog__header {
  padding-bottom: 0;
}
.ofs-select-folders .el-dialog__body {
  padding: 10px 20px;
}
.ofs-select-folders .el-table__body tr.current-row {
  background: #ecf5ff;
}
</style>
