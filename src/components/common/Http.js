import axios from 'axios'
import qs from 'qs'
import config from './Config'
import router from 'router'
// axios 配置
// http request 拦截器
axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})
// http response 拦截器
const Token = localStorage.getItem('token')
// axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))
axios.interceptors.response.use(
  response => {
      return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          router.push('/admin/login')
      }
    }
    console.log(error)
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  })


function checkStatus(response) {
  if (response.status === 200 || response.status === 304) {
    console.log(response)
    return {
      errCode: response.data.data.errCode,
      errMsg: response.data.data.errMsg,
      data: response.data.data
    }
  }
  return {
    errCode: response.status,
    errMsg: response.statusText,
    data: ''
  }

}
function checkCode(res) {
  if (res.data.code === -500) {
  } else if (res.data.code === 401) {
  } else if (res.data.code === -400) {
  } else if (res.data.code !== 200) {
  }
  return res
}
export default {
  post(url, data) {
    return axios({
      method: 'post',
      url: config.api + url,
      data: qs.stringify(data),
      timeout: config.timeout,
      headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-CSRF-TOKEN': Token,
          'Authorization': 'Bearer ' + Token
      }
    }).then(checkStatus).then(checkCode)
  },
  delete(url, data) {
    return axios({
      method: 'delete',
      url: config.api + url,
      data: qs.stringify(data),
      timeout: config.timeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-CSRF-TOKEN': Token,
        'Authorization': 'Bearer ' + Token
      }
    }).then(checkStatus).then(checkCode)
  },
  get(url, params) {
    return axios({
      method: 'get',
      url: config.api + url,
      params,
      timeout: config.timeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': Token,
        'Authorization': 'Bearer ' + Token
      }
    }).then(checkStatus).then(checkCode)
  }
}