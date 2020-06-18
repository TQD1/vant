<template>
  <div>
    <el-button size="mini" class="btn-flow" @click="viewWorkFlowHandler">
      <div class="btn-inner">
        <img
          class="icon"
          src="../../../../../assets/image/ProcessAssociation.png"
        />
        <span>查看流程</span>
      </div>
    </el-button>
    <el-dialog
      title="查看流程"
      :before-close="handleClose"
      class="single-flow__dialog"
      width="690px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
    >
      <div class="dialog-body">
        <iframe
          :src="DOMIAN + iframeSrc"
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
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
      dialogVisible: false,
      DOMIAN: 'https://lo9.glkyun.cn:8888'
    }
  },
  computed: {
    formStartIframeSrc () {
      return `/WorkflowDesigner/DesignerViewJs.aspx?taskID=${this.flowArgs.recordId}&unShowError=false`
    },
    unformStartIframeSrc () {
      return `/WorkflowDesigner/DesignerViewPng.aspx?processCode=${this.flowArgs.flowCode}`
    },
    iframeSrc () {
      return this.type === 'start'
        ? this.formStartIframeSrc
        : this.unformStartIframeSrc
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    /*
    https://lo9.glkyun.cn:8888/WorkflowDesigner/DesignerViewPng.aspx?processCode=Process100751
    https://lo9.glkyun.cn:8888/WorkflowDesigner/DesignerViewJs.aspx?taskID=615557&unShowError=false
    */
    handleClose () {
      this.dialogVisible = false
    },
    viewWorkFlowHandler () {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.btn-flow {
  width: 106px;
  .btn-inner {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 3px;
    }
  }
}
.single-flow__dialog {
  /deep/ .el-dialog__header {
    padding-bottom: 0;
  }
  /deep/ .el-dialog__body {
    padding-bottom: 20px;
    padding-top: 20px;
  }
  .dialog-body {
    height: 368px;
    display: flex;
  }
}
</style>
