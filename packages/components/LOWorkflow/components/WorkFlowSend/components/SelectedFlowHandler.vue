<template>
  <div class="flow-handler__container">
    <div class="main-title">
      <span class="text">
        <i class="tig">*</i>
        <span>主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</span>：
      </span>
      <el-input
        class="input-title"
        placeholder="请输入主题"
        v-model="modelDatas.name"
        size="mini"
        clearable
      ></el-input>
    </div>
    <div class="sub-title">
      <span class="text">发送人({{ senders.length }})</span>
      <el-button type="text" @click.native="openDialogAddHandler('sender')">
        + 添加处理人
      </el-button>
    </div>
    <div class="selected-user">
      <div v-if="senders.length === 0" class="nothing-selected">
        <span>点击右上方添加发送人</span>
      </div>
      <el-scrollbar v-else style="height: 100%;">
        <el-tag
          class="user"
          v-for="(executor, index) in senders"
          :key="executor.fullId"
          @close="removeSendersHandler(executor, index)"
          :title="textNaneTooLongFormat(executor.fullName)"
          closable
        >
          {{ executor.fullName | filterExecutor }}
        </el-tag>
      </el-scrollbar>
    </div>
    <div class="sub-title">
      <span class="text">抄送人({{ carbonCopys.length }})</span>
      <el-button
        type="text"
        @click.native="openDialogAddHandler('carbonCopyer')"
      >
        + 添加处理人
      </el-button>
    </div>
    <div class="selected-user">
      <div v-if="carbonCopys.length === 0" class="nothing-selected">
        <span>点击右上方添加发送人</span>
      </div>
      <el-scrollbar v-else style="height: 100%;">
        <el-tag
          class="user"
          v-for="(executor, index) in carbonCopys"
          :key="executor.fullId"
          @close="removeCarbonCopysHandler(executor, index)"
          closable
          :title="textNaneTooLongFormat(executor.fullName)"
        >
          {{ executor.fullName | filterExecutor }}
        </el-tag>
      </el-scrollbar>
    </div>
    <workflow-org
      v-if="showStatusTree"
      :executors="executors"
      :isShowOrg="showStatusTree"
      @onCancel="closeDialogBack"
      @onConfirm="receptData"
    ></workflow-org>
  </div>
</template>

<script>
import WorkflowOrg from '@~/components/LOOrg/components/WorkflowOrg'

export default {
  name: 'SelectedFlowHandler',
  components: { WorkflowOrg },
  props: {
    modelDatas: {
      type: Object
    }
  },
  model: {
    prop: 'modelDatas',
    event: 'onchangeSelectedHandler'
  },
  computed: {
    carbonCopys: {
      get () {
        if (this.modelDatas.cc && this.modelDatas.cc.executors) {
          return this.modelDatas.cc.executors
        } else {
          return []
        }
      },
      set (val) {
        this.$emit('update', val)
      }
    },
    senders: {
      get () {
        return this.modelDatas.executors
      },
      set (val) {
        this.$emit('update', val)
      }
    }
  },
  data () {
    return {
      showStatusTree: false,
      executors: [],
      curretSelectType: ''
    }
  },
  filters: {
    filterExecutor (name) {
      let lastName = name.split('/')
      let t = lastName[lastName.length - 1]
      const flag = typeof t === 'string' && t.length > 28
      return flag ? `${t.substring(0, 28)}...` : t
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 判断text是否超出28字
    textNaneTooLongFormat (name) {
      let lastName = name.split('/')
      let t = lastName[lastName.length - 1]
      return typeof t === 'string' && t.length > 28 ? t : ''
    },

    // 选择人员后监听事件
    receptData (list) {
      this.closeDialogBack()
      this.emitSelectedDataHandler(list, this.curretSelectType)
    },

    // 处理给抄送人和发送人数组赋值
    emitSelectedDataHandler (list, key) {
      if (Array.isArray(list) && list.length === 0) return
      switch (key) {
        case 'sender':
          this.modelDatas.executors = list
          break
        case 'carbonCopyer':
          this.modelDatas.cc = {
            executors: list
          }
          break
        default:
          break
      }
    },

    // 删除抄送人
    removeCarbonCopysHandler (item, index) {
      this.carbonCopys.splice(index, 1)
    },

    // 删除发送人
    removeSendersHandler (item, index) {
      this.senders.splice(index, 1)
    },

    closeDialogBack () {
      this.showStatusTree = false
    },

    openDialogAddHandler (type) {
      this.curretSelectType = type
      this.executors =
        type === 'carbonCopyer'
          ? this.formatFieldHandler(this.carbonCopys)
          : this.formatFieldHandler(this.senders)
      this.showStatusTree = true
    },

    formatFieldHandler (s) {
      return s.map((item) => {
        return {
          fullId: item.fullId,
          id: item.fullId
            .split('/')[item.fullId.split('/').length - 1].split('.')[0],
          name:
            item.fullName.indexOf('/') !== -1
              ? item.fullName.split('/')[item.fullName.split('/').length - 1]
              : item.fullName,
          fullName: item.fullName,
          sex: item.sex,
          selected: item.selected,
          isMap: item.isMap
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.flow-handler__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .main-title {
    margin-bottom: 10px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    .text {
      display: flex;
      align-items: center;
      .tig {
        line-height: 30px;
        color: #f70000;
      }
    }
    .input-title {
      width: 340px;
    }
  }
  .sub-title {
    margin-bottom: 10px;
    width: 100%;
    height: 30px;
    background: rgb(239, 239, 239);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 6px;
    .text {
      color: #0d0d0d;
      font-weight: bold;
      font-size: 13px;
      line-height: 30px;
    }
  }
  .selected-user {
    height: 118px;
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .user {
      height: 30px;
      line-height: 28px;
      margin-bottom: 10px;
      margin-right: 10px;
      background: rgba(59, 141, 238, 0.1);
      color: #0e0e0e;
    }
    .user:last-child {
      margin-right: 0;
    }
    .nothing-selected {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      font-weight: 400;
      color: rgba(152, 152, 152, 1);
    }
  }
}
</style>
