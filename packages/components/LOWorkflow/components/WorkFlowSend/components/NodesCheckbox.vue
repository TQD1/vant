<template>
  <div class="checkbox-item">
    <el-checkbox-group v-model="checkedNodes" @change="changeCheckboxgroupHandler">
      <div
        class="checkbox-item__container"
        v-for="(item, index) in nodesSelectStatus"
        :key="index"
        :style="{
          background:
            currentCheckbox === index ? 'rgba(59, 141, 238, 0.2)' : '',
        }"
      >
        <el-checkbox
          :label="item.unitCode"
          :key="index"
          :disabled="item.mustSelect"
          @change="
            (val) => {
              onchangeCheckboxHanler(val, item);
            }
          "
        >
        </el-checkbox>
        <p class="lebal-item__box" @click="clickRadioHandler(item, index)">
          {{ item.unitName }}
        </p>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    nodesSelectStatus: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      checkedNodes: [],
      currentCheckbox: 0
    }
  },
  computed: {},
  watch: {
    nodesSelectStatus: {
      handler: 'getNodesCheckedStatus',
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    changeCheckboxgroupHandler () {
      this.$emit('oncheckedHandler', this.checkedNodes)
    },

    // 获取当前checkbox的选择状态
    getNodesCheckedStatus () {
      if (this.nodesSelectStatus.length === 0) return
      let selectedNodes = this.nodesSelectStatus.filter((item) => {
        return item.selected
      })
      for (let i = 0; i < selectedNodes.length; i++) {
        const element = selectedNodes[i]
        this.checkedNodes.push(element.unitCode)
      }
      this.changeCheckboxgroupHandler()
    },

    // checkbox勾选之后
    onchangeCheckboxHanler (val, item) {
      const unChecked = item.unCheckedLink
      const checked = item.checkedLink
      const all = this.checkedNodes
      val
        ? this.checkedBoxHandler(all, checked)
        : this.uncheckBoxHandler(all, unChecked)
    },

    // 求补集
    uncheckBoxHandler (all, unchecks) {
      this.checkedNodes = all.filter((item) => !unchecks.includes(item))
    },

    // 求并集
    checkedBoxHandler (all, checks) {
      this.checkedNodes = [...new Set(all.concat(checks))]
    },

    clickRadioHandler (item, index) {
      this.currentCheckbox = index
      this.$emit('onchange', index)
    }
  }
}
</script>

<style scoped lang="scss">
.checkbox-item {
  height: 100%;
  .checkbox-item__container {
    display: flex;
    &:hover {
      background: rgba(59, 141, 238, 0.2);
    }
    .lebal-item__box {
      flex: 1;
      font-size: 14px;
      line-height: 26px;
      padding-left: 6px;
      cursor: pointer;
    }
  }
  /deep/ .el-checkbox-group {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-checkbox {
      margin-right: 0;
      height: 26px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 15px;
      .el-checkbox__label {
        display: none;
      }
    }
  }
}
</style>
