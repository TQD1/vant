import { Gd, GdInFlow } from './document'
import { send, formStart, taskInfo } from './workflow'
import { selectOrg, selectWorkflowOrg } from './org'
const LO = {
  Gd,
  GdInFlow,
  Workflow: {
    send,
    formStart,
    taskInfo
  },
  Org: {
    selectOrg,
    selectWorkflowOrg
  }
}
export default LO
