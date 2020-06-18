<template>
    <common-org v-if="isShowCommonOrg"
                :isShowOrg="isShowCommonOrg"
                 @onCancel="commonOrgCancel"
                 @onConfirm="commonOrgConfirm"
    >
    </common-org>
</template>

<script>
import CommonOrg from './'
export default {
  name: '',
  components: {
    CommonOrg
  },
  props: {},
  data () {
    return {
      isShowCommonOrg: false,
      options: {

      }
    }
  },
  computed: {},
  created () {
    this.initOrg()
  },
  mounted () { },
  methods: {
    initOrg () {
      this.isShowCommonOrg = true
    },
    commonOrgCancel () {
      this.isShowCommonOrg = false
    },
    commonOrgConfirm () {
      this.isShowCommonOrg = false
    }
  },
  watch: {}
}
</script>

<style scoped>
</style>
