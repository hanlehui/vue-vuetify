import { restApi } from '@/plugins/axios'

export function Get(url, params, timeout) {
  return restApi({
    url,
    params,
    timeout,
    method: 'get'
  })
}

export function Post(url, data, timeout) {
  return restApi({
    url,
    data,
    timeout,
    method: 'post'
  })
}

export function Put(url, data, timeout) {
  return restApi({
    url,
    data,
    timeout,
    method: 'put'
  })
}

export function Delete(url, data, timeout) {
  return restApi({
    url,
    data,
    timeout,
    method: 'delete'
  })
}
