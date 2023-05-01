import { Get } from './index'

export function getCodeImage() {
  return Get('/captchaCode')
}
