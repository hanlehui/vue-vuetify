import axios from 'axios'
import NProgress from 'nprogress'
import SecureLS from 'secure-ls'
import store from '@/store'
import { Notification, MessageBox, Message } from 'element-ui'
import errorCode from '@/utils/errorCode'

let ls = new SecureLS()
const token = ls.get('tokenKey')

const restApi = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  headers: {
    Authorization: 'Bearer ' + token
  }
})

const genericApi = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  headers: {}
})

if (token) {
  restApi.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
restApi.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
restApi.defaults.headers.get['Accepts'] = 'application/json'
genericApi.defaults.headers.get['Accepts'] = 'application/json'

restApi.interceptors.request.use(
  function (request) {
    NProgress.start()
    return request
  },
  function (error) {
    console.log(error)
    NProgress.done()
    return Promise.reject(error)
  }
)

restApi.interceptors.response.use(
  function (response) {
    NProgress.done()
    const code = response.data.code || 200
    const msg = errorCode[code] || response.data.msg || errorCode['default']
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response.data
    }
    if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      Message({ message: msg, type: 'error' })
    } else if (code === 601) {
      Message({ message: msg, type: 'warning' })
    } else if (code !== 200) {
      Notification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  function (error) {
    console.log(error)
    NProgress.done()
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    Message({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export { restApi, genericApi }
