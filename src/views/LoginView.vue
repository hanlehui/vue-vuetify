<template>
  <v-container fill-height fluid class="bg" :style="{ '--blur': active ? 'blur(10px)' : 'blur(0px)' }">
    <v-row justify="center" class="d-flex align-center">
      <v-col class="d-flex justify-center">
        <v-card
          :elevation="active ? 12 : 2"
          :style="{ opacity: active ? 1 : 0.4, 'z-index': 11 }"
          min-width="300"
          width="500"
          shaped
          color="secondary"
          v-click-outside="clickOutside"
          @click="active = true"
        >
          <v-toolbar flat color="primary" dark class="d-flex flex-row-reverse">
            <v-toolbar-title
              ><h3>{{ tab ? '注册' : '登录' }}</h3></v-toolbar-title
            >
          </v-toolbar>
          <v-tabs v-model="tab" dark background-color="primary" grow>
            <v-tab key="login"> 登录 </v-tab>
            <v-tab key="register"> 注册 </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item key="login">
              <v-card-text v-show="loginType === 'captcha'">
                <captcha-login />
              </v-card-text>
              <v-card-text v-show="loginType === 'phone'">
                <phone-login />
              </v-card-text>
            </v-tab-item>
            <v-tab-item key="register">
              <v-card-text>
                <sys-user-register />
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
          <v-divider class="mt-5" style="border: 0" />
          <v-card-actions class="d-flex flex-row-reverse">
            <v-spacer />
            <v-btn :disabled="!valid" color="tertiary" @click="login"> 登录 </v-btn>
          </v-card-actions>
          <v-snackbar v-model="snackbar" :color="color" :top="true">
            {{ errorMessages }}
            <v-btn text @click="snackbar = false"> 关闭 </v-btn>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CaptchaLogin from '@/components/login/CaptchaLogin.vue'
import PhoneLogin from '@/components/login/PhoneLogin.vue'
import SysUserRegister from '@/components/login/SysUserRegister.vue'
export default {
  name: 'LoginView',
  components: {
    CaptchaLogin,
    PhoneLogin,
    SysUserRegister
  },
  data: () => ({
    tab: null,
    valid: true,
    active: false,
    errorMessages: null,
    snackbar: false,
    color: 'general',
    loginType: 'captcha'
  }),
  methods: {
    login() {
      const loginForm = this.$refs[this.loginType + '-login']
      if (loginForm.form.validate()) {
        const username = loginForm.usernmae
        const password = loginForm.password
        const captcha = loginForm.captcha
        const captchaKey = loginForm.captchaKey
        this.$store
          .dispatch('login', { username, password, captcha, captchaKey })
          .then(() => this.$router.push('/'))
          .catch((err) => {
            console.log(err)
            this.snackbar = true
          })
      }
    },
    clickOutside() {
      this.active = false
    }
  },
  metaInfo() {
    return {
      title: '枫桥夜泊 | 登录页'
    }
  }
}
</script>

<style>
.bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: url('@/assets/login_bg.jpg') no-repeat fixed;
  padding: 1px;
  box-sizing: border-box;
  z-index: 1;
  background-size: cover;
}
.bg::after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transition: filter 0.4s ease-in-out;
  background: inherit;
  filter: var(--blur);
  z-index: 2;
}
.v-card {
  transition: opacity 0.4s ease-in-out;
}
</style>

<!-- <template>
  <div class="login_container">
    <div class="login_form">
      <register-dialog style="float: right"></register-dialog>
      <p class="login_title">系统登录</p>

      <el-form
        v-show="loginType === 'captcha'"
        ref="captchaLoginForm"
        :model="captchaLoginForm"
        :rules="captchaRules"
        status-icon
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="captchaLoginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="captchaLoginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <img
          v-if="codeImage !== null"
          style="width: 130px; height: 48p; margin-left: 100px"
          @click="getCodeImage"
          :src="codeImage"
        />
        <el-form-item label="验证码" prop="captchaCode">
          <el-input v-model="captchaLoginForm.captchaCode" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="captchaLogin">登录</el-button>
        </el-form-item>
      </el-form>

      <el-form
        v-show="loginType === 'phoneNumber'"
        ref="phoneNumberForm"
        :model="phoneLoginForm"
        :rules="phoneRules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model.number="phoneLoginForm.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="sendCode"> 发送手机验证码 </el-button>
        </el-form-item>
      </el-form>

      <el-form
        v-show="loginType === 'phoneCode'"
        ref="phoneLoginForm"
        :model="phoneLoginForm"
        :rules="phoneCodeRules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="验证码" prop="phoneCode">
          <el-input v-model.number="phoneLoginForm.phoneCode" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="phoneCodeLogin">登录</el-button>
        </el-form-item>
      </el-form>

      <el-button class="changeButton" v-show="loginType !== 'captcha'" type="primary" size="mini" @click="changeCaptchaLoginType"
        >图片验证码登录</el-button
      >

      <el-button
        class="changeButton"
        v-show="loginType === 'captcha'"
        type="primary"
        size="mini"
        @click="loginType = 'phoneNumber'"
        >手机号登录</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCodeImg, sendPhoneCode } from '@/api/login'
import registerDialog from '@/components/RegisterDialog'
export default {
  name: 'login-view',
  components: {
    registerDialog
  },
  computed: {
    ...mapState({
      registerUsername: (state) => state.register.registerUsername
    })
  },
  watch: {
    registerUsername(val) {
      this.captchaLoginForm.username = val
    },
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  data() {
    return {
      loginType: 'captcha',
      // dialogVisible: false,
      captchaLoginForm: {
        username: null,
        password: null,
        captchaCode: null,
        captchaKey: null
      },
      phoneLoginForm: {
        phoneNumber: null,
        phoneCode: null,
        phoneCodeKey: null
      },
      captchaRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captchaCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      phoneRules: {
        phoneNumber: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ]
      },
      phoneCodeRules: {
        phoneCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          {
            pattern: /^\d{6}$/,
            message: '请输入6位数字验证码',
            trigger: 'blur'
          }
        ]
      },
      codeImage: null,
      redirect: undefined
    }
  },
  created() {
    this.getCodeImage()
  },
  methods: {
    sendCode() {
      this.$refs.phoneNumberForm.validate((valid) => {
        if (valid) {
          sendPhoneCode(this.phoneLoginForm.phoneNumber).then((res) => {
            if (res.code === 500) {
              this.$message(res.data)
            }
            if (res.data === 'success') {
              this.phoneLoginForm.phoneCodeKey = res.phoneCodeKey
              this.$message('验证码发送成功, 请注意查收')
              this.loginType = 'phoneCode'
            }
          })
        } else {
          return false
        }
      })
    },
    getCodeImage() {
      getCodeImg().then((res) => {
        if (res.data === 'success') {
          this.codeImage = res.image
          this.captchaLoginForm.captchaKey = res.captchaKey
        }
      })
    },
    phoneCodeLogin() {
      this.$refs.phoneLoginForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('PhoneLogin', this.phoneLoginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {})
          })
        } else {
          this.$message.error('errot submit!')
          return false
        }
      })
    },
    captchaLogin() {
      this.$refs.captchaLoginForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('CaptchaLogin', this.captchaLoginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {})
          })
        } else {
          this.$message.error('errot submit!')
          return false
        }
      })
    },
    changeCaptchaLoginType() {
      this.loginType = 'captcha'
      this.getCodeImage()
    }
  }
}
</script>

<style scoped>
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url('../assets/login_bg.jpg');
  background-size: cover;
  position: absolute;
  left: 0;
  top: 0;
}
.login_form {
  width: 510px;
  margin: 0 auto;
  padding: 0 55px 15px 35px;
  background-color: #fff;
  border: none;
  border-radius: 5px;
  /* box-shadow: 0 0 25px #cac6c6; */

  position: absolute;
  /* transform: translate(-50%, -50%); */
  /* pointer-events: none; */
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  background: transparent;
  backdrop-filter: blur(10px);
  transition: 0.2s;
}
.login_title {
  font-family: '微软雅黑 Bold', '微软雅黑';
  font-weight: 700;
  text-decoration: none;
  color: rgb(0, 121, 254);
  font-size: 32px;
  margin-top: 50px;
  margin-bottom: 30px;
  text-align: center;
}
.changeButton {
  float: right;
  margin: 0 10px;
}
</style> -->

<!-- <template>
  <section>
    <h2>毛玻璃特效</h2>
    <div class="glass"></div>
  </section>
</template>

<script>
export default {
  name: "index",
  methods:{
    show(){
      document.addEventListener('mousemove', function (e) {
        const glass = document.querySelector('.glass')
        glass.style.left = e.offsetX + 'px'
        glass.style.top = e.offsetY + 'px'
      })
    }
  },
  mounted() {
    this.show()
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
section{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* background: url(ttf.jpg); */
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
}
section h2 {
  font-size: 5em;
  color: #fff;
  pointer-events: none;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}
section .glass{
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  width: 300px;
  height: 200px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  background: transparent;
  backdrop-filter: blur(10px);
  transition: 0.2s;
}
</style> -->

<!-- <template>
  <h3>蜘蛛网特效</h3>
</template>

<script>
export default {
  name: "index",
  methods:{
    show(){
      !function () {
        function n(n, e, t) {
          return n.getAttribute(e) || t
        }
        function e(n) {
          return document.getElementsByTagName(n)
        }
        function t() {
          var t = e("script"), o = t.length, i = t[o - 1];
          return {l: o, z: n(i, "zIndex", -1), o: n(i, "opacity", .5), c: n(i, "color", "0,0,0"), n: n(i, "count", 99)}
        }
        function o() {
          a = m.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, c = m.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }
        function i() {
          r.clearRect(0, 0, a, c);
          var n, e, t, o, m, l;
          s.forEach(function (i, x) {
            for (i.x += i.xa, i.y += i.ya, i.xa *= i.x > a || i.x < 0 ? -1 : 1, i.ya *= i.y > c || i.y < 0 ? -1 : 1, r.fillRect(i.x - .5, i.y - .5, 1, 1), e = x + 1; e < u.length; e++) n = u[e], null !== n.x && null !== n.y && (o = i.x - n.x, m = i.y - n.y, l = o * o + m * m, l < n.max && (n === y && l >= n.max / 2 && (i.x -= .03 * o, i.y -= .03 * m), t = (n.max - l) / n.max, r.beginPath(), r.lineWidth = t / 2, r.strokeStyle = "rgba(" + d.c + "," + (t + .2) + ")", r.moveTo(i.x, i.y), r.lineTo(n.x, n.y), r.stroke()))
          }), x(i)
        }
        var a, c, u, m = document.createElement("canvas"), d = t(), l = "c_n" + d.l, r = m.getContext("2d"),
            x = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (n) {
              window.setTimeout(n, 1e3 / 45)
            }, w = Math.random, y = {x: null, y: null, max: 2e4};
        m.id = l, m.style.cssText = "position:fixed;top:0;left:0;z-index:" + d.z + ";opacity:" + d.o, e("body")[0].appendChild(m), o(), window.onresize = o, window.onmousemove = function (n) {
          n = n || window.event, y.x = n.clientX, y.y = n.clientY
        }, window.onmouseout = function () {
          y.x = null, y.y = null
        };
        for (var s = [], f = 0; d.n > f; f++) {
          var h = w() * a, g = w() * c, v = 2 * w() - 1, p = 2 * w() - 1;
          s.push({x: h, y: g, xa: v, ya: p, max: 6e3})
        }
        u = s.concat([y]), setTimeout(function () {
          i()
        }, 100)
      }();
    }
  },
  mounted() {
    this.show()
  }
}
</script>

<style scoped>
</style> -->
