import Vue from 'vue'
import LoFiling from '../components/LOFiling/index.vue'
const Gd = (task, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  const Component = Vue.extend({
    template: '<LoFiling></LoFiling>',
    methods: {
      callback: callback
    },
    data () {
      return {
        selectTask: task,
        isInFlow: false
      }
    },
    components: {
      LoFiling
    }
  })
  let instance = new Component().$mount()
  document.body.appendChild(instance.$el)
}
const GdInFlow = (task, callback) => {
  if (typeof (callback) !== 'function') {
    callback = () => {}
  }
  const Component = Vue.extend({
    template: '<LoFiling></LoFiling>',
    methods: {
      callback: callback
    },
    data () {
      return {
        selectTask: task,
        isInFlow: true
      }
    },
    components: {
      LoFiling
    }
  })
  let instance = new Component().$mount()
  document.body.appendChild(instance.$el)
}

export { Gd, GdInFlow }
