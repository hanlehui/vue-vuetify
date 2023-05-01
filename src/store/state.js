import SecureLS from 'secure-ls'

let ls = new SecureLS()

export default {
  token: ls.get('tokenKey') || ''
}
