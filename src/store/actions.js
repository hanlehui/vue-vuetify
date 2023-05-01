import axios from 'axios'
import { restApi } from '../plugins/axios'
import SecureLS from 'secure-ls'

let ls = new SecureLS()

async function login({ commit }, userData) {
  commit('auth_request')
  let response = await restApi
    .post('login', {
      username: userData.username,
      password: userData.password
    })
    .then((response) => {
      const token = response.data.token
      const user = response.data.username
      ls.set('tokenKey', { token: token })
      ls.set('userKey', { user: user })
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      commit('auth_sucess', { token, user })
    })
    .catch((err) => {
      console.log('login error' + err)
      commit('auth_error')
      ls.remove('token')
    })
  return response
}

export default {
  login
  // logout({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     commit('logout')
  //     ls.remove('token')
  //     delete restApi.defaults.headers.common['']
  //   })
  // }
}
