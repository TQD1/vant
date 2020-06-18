<template>
  <el-dialog
    :title="title"
    :before-close="handleClose"
    class="test-send__dialog"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
    <div class="dialog-body">
      <div class="checkbox-contianer">
        <div class="btn-div">
          <ViewFlowBtn :type="type" :flowArgs="flowArgs"></ViewFlowBtn>
        </div>
        <div class="title-div">
          处理节点：
        </div>
        <div class="checkbox-list_box">
          <el-scrollbar style="height: 100%;">
            <nodes-radio
              v-if="nodesType === 'single'"
              :nodesSelectStatus="nodesSelectStatus"
              @onchange="onchangeCheckIndexHandler"
              @oncheckedHandler="onchangeCheckedHandler"
            ></nodes-radio>
            <nodes-checkbox
              v-if="nodesType === 'all'"
              :nodesSelectStatus="nodesSelectStatus"
              @onchange="onchangeCheckIndexHandler"
              @oncheckedHandler="onchangeCheckedHandler"
            ></nodes-checkbox>
          </el-scrollbar>
        </div>
      </div>
      <div class="table-container">
        <selected-flow-handler
          v-for="(item, index) in nodesSelectHandlers"
          v-show="currentRightIsShow === index"
          :key="item.unitName"
          v-model="nodesSelectHandlers[index]"
        ></selected-flow-handler>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="send-type_box">
        <el-checkbox-group
          v-model="sendType"
          @change="handleCheckedSendTypeChange"
        >
          <el-checkbox v-for="item in sendTypes" :label="item" :key="item">
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="footer-btns">
        <el-button class="footer-btn" type="primary" @click="submitHandler">
          确 定
        </el-button>
        <el-button class="footer-btn" @click="handleClose">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  ViewFlowBtn,
  NodesRadio,
  NodesCheckbox,
  SelectedFlowHandler
} from './WorkFlowSend'
export default {
  props: {
    type: {
      type: String,
      default: () => ''
    },
    flowArgs: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      nodesType: '',
      nodesSelectHandlers: [], // 处理人
      nodesSelectStatus: [], // 节点list
      currentRightIsShow: 0,
      title: '任务发送',
      dialogVisible: false,
      sendType: [],
      sendTypes: ['即时消息', '电子邮件', '手机短信'],
      checksList: [] // 已选择的checkbox or radio
    }
  },
  components: {
    SelectedFlowHandler,
    NodesCheckbox,
    ViewFlowBtn,
    NodesRadio
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    console.log(111, this.flowArgs)
    console.log(222, this.type)
  },
  methods: {
    onchangeCheckIndexHandler (val) {
      this.currentRightIsShow = val
    },

    // 当前选中的radio 或 checkbox
    onchangeCheckedHandler (checks) {
      this.checksList = checks
    },

    handleCheckedSendTypeChange () {},

    // 判断节点是不是单选
    getNodesTypeHandler (data) {
      this.nodesType =
        data.filter((item) => {
          return item.checkedLink.length === 0
        }).length === data.length
          ? 'single'
          : 'all'
    },

    openDialogHandler (data) {
      this.getNodesTypeHandler(data)
      // 处理节点详情
      this.nodesSelectStatus = data.map((item) => {
        const { cc, executors, ...rest } = item
        return rest
      })
      // 处理节点人员信息
      this.nodesSelectHandlers = data
      this.dialogVisible = true
    },

    handleClose () {
      this.dialogVisible = false
    },

    // 格式化参数
    formatSubmitParams (list) {
      return list.map((item) => {
        return {
          fullId: item.fullId,
          fullName: item.fullName,
          isMap: item.isMap
        }
      })
    },

    submitHandler () {
      const getSibmitData = this.nodesSelectHandlers
        .filter((item) => this.checksList.includes(item.unitCode))
        .map((item) => {
          let { cc, executors } = item
          return {
            name: item.name,
            tipsMode: item.tipsMode,
            unitCode: item.unitCode,
            cc: cc
              ? { executors: this.formatSubmitParams(cc.executors) }
              : null,
            executors: this.formatSubmitParams(executors)
          }
        })
      // 提交的数据
      this.$parent.setSendHandler(getSibmitData)
    }
  }
}
</script>

<style scoped lang="scss">
.test-send__dialog {
  .dialog-footer {
    .footer-btn {
      width: 70px;
      height: 30px;
      padding: 0;
    }
    .send-type_box {
      /deep/ .el-checkbox-group {
        height: 100%;
        display: flex;
        align-items: center;
        .el-checkbox {
          margin-right: 16px;
        }
      }
    }
  }
  /deep/ .el-dialog__header {
    padding-bottom: 0;
  }
  /deep/ .el-dialog__body {
    padding-bottom: 20px;
    padding-top: 20px;
  }
  /deep/ .el-dialog__footer {
    padding-top: 0;
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      height: 30px;
    }
  }
  .dialog-body {
    height: 368px;
    display: flex;
    border: 1px solid rgba(225, 225, 225, 1);
    .checkbox-contianer {
      width: 127px;
      border-right: 1px solid rgba(225, 225, 225, 1);
      display: flex;
      flex-direction: column;
      .title-div {
        box-sizing: border-box;
        padding: 10px;
        padding-bottom: 14px;
      }
      .btn-div {
        box-sizing: border-box;
        padding: 10px;
        padding-bottom: 0;
      }
      .checkbox-list_box {
        height: 276px;
        box-sizing: border-box;
        /deep/ .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }
    .table-container {
      flex: 1;
      box-sizing: border-box;
      padding: 10px;
      display: flex;
      flex-direction: column;
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
}
</style>
