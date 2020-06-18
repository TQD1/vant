<template>
    <workflow-org
                  v-if="isShowWorkflowOrg"
                  :executors="executors"
                  :isShowOrg="isShowWorkflowOrg"
                  @onCancel="workflowOrgCancel"
                  @onConfirm="workflowOrgConfirm"
    ></workflow-org>
</template>

<script>
import WorkflowOrg from './'
export default {
  name: '',
  mixins: [],
  components: {
    WorkflowOrg
  },
  props: {},
  data () {
    return {
      isShowWorkflowOrg: false,
      executors: []
    }
  },
  computed: {},
  created () {
    this.initOrg()
  },
  mounted () {},
  methods: {
    initOrg () {
      this.isShowWorkflowOrg = true
      this.executors = this.options.executors || []
    },
    workflowOrgCancel () {
      this.isShowWorkflowOrg = false
      // document.body.removeChild(this.$refs.LOOrg)
    },
    workflowOrgConfirm () {
      this.isShowWorkflowOrg = false
    }
  },
  watch: {}
}
</script>

<style scoped>
</style>
