/**
 * 输入与输出相关方法
 */
export default {
  data () {
    return {
    }
  },
  mounted () {},
  methods: {
    // 弹窗确定
    confirm () {
      this.selectedList.forEach(item => {
        if (item.pid) {
          delete item.pid
        }
      })
      this.$emit('onConfirm', this.orgMapper(this.selectedList))
    },
    // 弹窗取消
    cancel () {
      this.$emit('onCancel')
    },
    // 组织格式化
    orgMapper (orgList) {
      // 格式化后的组织列表
      let orgMapperList = []
      for (let org of orgList) {
        orgMapperList.push({
          fullId: org.fullId,
          id: org.id,
          isMap: org.isMap,
          sex: org.sex,
          name: org.name,
          fullName: org.fullName
        })
      }
      return orgMapperList
    }
  }
}
