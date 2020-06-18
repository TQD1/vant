import Vue from 'vue'
import {
  WorkflowOrgPlugn,
  CommonOrgPlugn } from '../components/LOOrg'

const selectOrg = (options, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  options = options || {}
  const PlugnConstructor = Vue.extend(CommonOrgPlugn)
  let instanceOptions = {
    methods: {
      callback: callback
    },
    data () {
      return {
        options: options
      }
    }
  }
  let instance = new PlugnConstructor(instanceOptions).$mount()
  document.body.appendChild(instance.$el)
}
const selectWorkflowOrg = (options, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  options = options || {}
  const PlugnConstructor = Vue.extend(WorkflowOrgPlugn)
  let instanceOptions = {
    methods: {
      callback: callback
    },
    data () {
      return {
        options: options
      }
    }
  }
  let instance = new PlugnConstructor(instanceOptions).$mount()
  document.body.appendChild(instance.$el)
}
export { selectOrg, selectWorkflowOrg }
