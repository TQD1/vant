import axios from 'axios'
import { MessageBox } from 'element-ui'

// 请求状态码
const STATUS_CODE = {
  400: '无效的请求',
  401: '未授权',
  404: '获取的资源不存在',
  500: '出现错误，请联系管理员',
  408: '请求超时！',
  10002: '获取UserId失败：未找到claim 值'
}

// 反向代理url
const BASE_URL = {
  development: '/api',
  production: window.BASE_PATH === undefined ? '/ofs' : window.BASE_PATH
}
const instance = axios.create()
instance.all = axios.all
// 设置请求默认参数
// instance.defaults.timeout = 10000
instance.defaults.baseURL = BASE_URL[process.env.NODE_ENV]

// 请求拦截
instance.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    // 提示请求超时
    showTimeout()
    return error
  }
)

// 响应拦截
instance.interceptors.response.use(
  response => {
    // 认证拦截时触发
    if (
      response.status === 200 &&
      response.request.responseURL &&
      response.request.responseURL.indexOf('/Account/Login?ReturnUrl=') > -1 &&
      process.env.NODE_ENV !== 'development'
    ) {
      // IE10不兼容window.location.orign
      window.location.href =
        window.location.protocol +
        '//' +
        window.location.host +
        '/' +
        window.BASE_PATH
    }
    return response.data
  },
  error => {
    // 弹出错误信息
    if (error.config.headers['NO-ERRORMSG'] !== '1') {
      showErrorMsg(error)
    }
    return Promise.reject(
      new Error(
        JSON.stringify({
          message: error.message,
          status: error.response.data.errCode,
          url: error.request.responseURL
        })
      )
    )
  }
)

/**
 * 弹出错误信息
 * @param error [Object] 请求错误对象
 */
function showErrorMsg (error) {
  let errorCode = error.response.data.errCode || error.response.status
  MessageBox.alert(
    error.response.data.errMsg,
    STATUS_CODE[errorCode] || '错误',
    {
      type: 'error'
    }
  )
}
/**
 * 弹出请求超时
 */
function showTimeout () {
  MessageBox.alert('请求超时', '请求超时', {
    type: 'warning '
  })
}

// 导出默认的实例
export default instance
