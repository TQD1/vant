<template>
  <div class="checkbox-item">
    <el-radio-group v-model="checkedNodes">
      <div
        v-for="(item, index) in nodesSelectStatus"
        :key="index"
        class="radio-item__contaiber"
        :style="{
          background:
            currentCheckbox === index ? 'rgba(59, 141, 238, 0.2)' : '',
        }"
      >
        <el-radio
          :label="item.unitCode"
          @change="onchangeRadioHandler(index)"
        ></el-radio>
        <p class="lebal-item__box" @click="clickRadioHandler(item, index)">
          {{ item.unitName }}
        </p>
      </div>
    </el-radio-group>
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
      currentCheckbox: 0,
      checkedNodes: ''
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
    getNodesCheckedStatus () {
      this.checkedNodes = this.nodesSelectStatus.filter((item) => {
        return item.selected
      })[0].unitCode
      this.$emit('oncheckedHandler', [this.checkedNodes])
    },

    onchangeRadioHandler (index) {
      this.clickRadioHandler(undefined, index)
      this.$emit('oncheckedHandler', [this.checkedNodes])
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
  .radio-item__contaiber {
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
      white-space: nowrap;
    }
  }
  /deep/ .el-radio-group {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-radio {
      margin-right: 0;
      height: 26px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 15px;
      .el-radio__label {
        padding-left: 6px;
        display: none;
      }
    }
  }
}
</style>
