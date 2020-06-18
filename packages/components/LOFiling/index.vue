<template>
  <div v-if="isShowOFSFolder||ODMSelectFloder.showStatus">
   <ofs-select-folder :show-status="isShowOFSFolder"
                    v-if="isShowOFSFolder"
                    :fDocFolderId="sysFolderId"
                    @closeDialog="OFSCloseDialog"
                    @folderData="OFSFolderData"></ofs-select-folder>
   <odm-select-folder v-if="ODMSelectFloder.showStatus"
                          :show-status="ODMSelectFloder.showStatus"
                          :is-allow-document-saving="guiDangData.isAllowDocumentSaving"
                          :openSource="guiDangData.openSource"
                          :doc-object-i-d="guiDangData.docObjectID"
                          :is-show-third-party-systems="guiDangData.isShowThirdPartySystems"
                          :is-select-third-party-systems="guiDangData.isSelectThirdPartySystems"
                          :third-party-systems="guiDangData.thirdPartySystems"
                          @closeDialog="ODMCloseDialog"
                          @folderData="ODMFolderData"
                          :moduleCode="selectTask.moduleCode"></odm-select-folder >
  </div>
</template>

<script>
import OdmSelectFolder from './components/ODMSelectFolder.vue'
import OfsSelectFolder from './components/OFSSelectFolder.vue'
import ODMFilingMixin from './mixins/odmFilingMixin.js'
import OFSFilingMixin from './mixins/ofsFilingMixin.js'
export default {
  name: '',
  mixins: [ODMFilingMixin, OFSFilingMixin],
  components: { OdmSelectFolder, OfsSelectFolder },
  props: {},
  data () {
    return {
      selectTask: {},
      isInFlow: false// 是否在流程发送时归档
    }
  },
  computed: {},
  created () {},
  mounted (val) {
    this.selectTask = this.$parent.selectTask
    this.isInFlow = !!this.$parent.isInFlow
    this.doFiling()
  },
  methods: {
    doFiling () {
      let moduleCode = this.selectTask.moduleCode || ''
      // 公文归档
      if (moduleCode.indexOf('GB.LK.ODM') > -1) {
        this.doODMFiling()
      }
      // 业务生成器归档
      if (this.selectTask.moduleCode.indexOf('GTPOnlineForm') > -1) {
        this.doOFSFiling()
      }
    },
    callback (data) {
      if (typeof (this.$parent.callback) === 'function') {
        this.$parent.callback(data)
      }
    }
  },
  watch: {}
}
</script>

<style scoped>
</style>
