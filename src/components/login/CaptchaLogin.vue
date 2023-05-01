<template>
  <v-form ref="login-form" v-model="valid" @keydown.enter="login" lazy-validation>
    <v-text-field
      ref="username"
      v-model="username"
      prepend-icon="mdi-account"
      label="用户名"
      placeholder="请输入用户名"
      :rules="[(v) => !!v || '用户名不能为空', (v) => /^[a-zA-Z0-9]{8,20}$/.test(v) || '用户名必须是 8-20 位字母或数字']"
    />
    <v-text-field
      ref="password"
      v-model="password"
      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      :type="showPassword ? 'text' : 'password'"
      prepend-icon="mdi-lock"
      label="密码"
      placeholder="请输入密码"
      @click:append="showPassword = !showPassword"
      :rules="[
        (v) => !!v || '密码不能为空',
        (v) => /^[A-Za-z0-9@$!%*?&+_@#./,-]{8,20}$/gm.test(v) || '密码必须是 8-20 位字母数字或特殊字符'
      ]"
    />
    <v-text-field
      ref="captcha"
      prepend-icon="mdi-alarm-light"
      label="验证码"
      placeholder="请输入验证码"
      v-model="captcha"
      :rules="[(v) => !!v || '验证码不能为空', (v) => /^[a-zA-Z0-9]{6}$/.test(v) || '请正确输入验证码']"
    >
      <v-img slot="append" :src="captchaImage ? captchaImage : loadFailImage" height="48" width="130" @click="codeImage"></v-img>
    </v-text-field>
  </v-form>
</template>

<script>
import { getCodeImage } from '@/api/login'
export default {
  name: 'CaptchaLogin',
  data: () => ({
    form: this.$refs['login-form'],
    captchaLoginParams: {
      username: null,
      password: null,
      captcha: null,
      captchaKey: null
    },
    showPassword: false,
    captchaImage: null,
    loadFailImage: require('@/assets/load_fail.png')
  }),
  created() {
    this.codeImage()
  },
  methods: {
    codeImage() {
      getCodeImage().then((res) => {
        if (res.data === 'success') {
          this.captchaImage = res.image
          this.captchaLoginParams.captchaKey = res.captchaKey
        }
      })
    }
  }
}
</script>

<style></style>
