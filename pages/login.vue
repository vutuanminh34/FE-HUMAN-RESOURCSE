<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 lg3>
        <v-card class="elevation-1 pa-3">
          <v-form ref="loginForm" @submit.prevent="doLogin">
            <v-card-text>
              <div class="layout column align-center">
                <h1 class="flex my-4 primary--text title-login">
                  Human Resource Admin
                </h1>
              </div>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
                name="username"
                prepend-icon="mdi-account"
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                :type="isShow ? 'text' : 'password'"
                :append-icon="isShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="isShow = !isShow"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <div class="d-flex flex-column" style="width: 100%">
                <Recaptcha class="mx-auto mb-5" />
                <v-btn
                  type="submit"
                  block
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                >
                  Log In
                </v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Recaptcha from '@/components/Recaptcha'
import { validateCaptcha } from '@/api/recaptcha'
export default {
  components: {
    Recaptcha,
  },
  data: () => ({
    username: '',
    usernameRules: [(v) => !!v || 'Please input username'],
    password: '',
    passwordRules: [(v) => !!v || 'Please input password'],
    loading: false,
    isShow: false,
  }),
  methods: {
    resetReCaptcha() {
      const iframe = document.querySelector('#g-recaptcha iframe')
      const source = iframe.src
      iframe.src = ''
      setTimeout(function () {
        iframe.src = source
      }, 500)
    },
    async doLogin(e) {
      const res = e.target['g-recaptcha-response'].value

      const valid = this.$refs.loginForm.validate()

      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'Please fill all the fields',
        })
        return false
      }

      if (!res) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'Please fill the captcha',
        })
        return false
      }

      const userInfo = {
        username: this.username,
        password: this.password,
      }

      try {
        this.loading = true
        await validateCaptcha({
          encodedResponse: res,
        })

        const login = await this.$store.dispatch('login', userInfo)
        if (login) {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery,
          })
        }
      } catch (error) {
        if (error.message !== 'Invalid Recaptcha!') {
          this.resetReCaptcha()
        }
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
      } finally {
        this.loading = false
      }
    },
  },
  head() {
    return {
      script: [
        {
          src: 'https://www.google.com/recaptcha/api.js',
        },
      ],
    }
  },
  layout: 'public',
  loading: true,
  middleware: 'notAuthenticated',
}
</script>
