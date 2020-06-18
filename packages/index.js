import LO from '@~/api'
// import http from './api/http'
export default {
  install (Vue, options) {
    if (options && options.http) {
      window.$LO = LO
      window.$LO.http = options.http
    }
    Vue.prototype.$LO = LO
  }
}
