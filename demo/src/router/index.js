import Vue from 'vue'
import VueRouter from 'vue-router'
import Document from '../examples/Document'
import Org from '../examples/Org'
import Workflow from '../examples/Workflow'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/document'
  },
  {
    path: '/document',
    name: 'document',
    component: Document
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: Workflow
  },
  {
    path: '/org',
    name: 'org',
    component: Org
  }
]

const router = new VueRouter({
  routes
})

export default router
