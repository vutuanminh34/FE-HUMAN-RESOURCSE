<template>
  <v-layout>
    <v-container class="w-1000" style="height: 79vh">
      <v-card class="switch-tab mb-5 center">
        <v-tabs v-model="tab" centered icons-and-text>
          <v-tab href="#profile">
            Account
            <v-icon>mdi-account</v-icon>
          </v-tab>

          <v-tab href="#account">
            Password
            <v-icon>mdi-alphabetical</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="profile">
            <v-card class="switch-tab mb-5 center">
              <v-card-title class="headline">Account Settings </v-card-title>
              <v-form
                ref="accountForm"
                class="px-5 mt-5"
                @submit.prevent="updateAccount"
              >
                <v-chip color="primary" class="mb-3" outlined pill>
                  <v-icon left> mdi-account-outline </v-icon>
                  {{ formAccount.ROLE }}
                </v-chip>
                <v-text-field
                  v-model.trim="formAccount.USER_NAME"
                  label="Username"
                  outlined
                  dense
                  disabled
                ></v-text-field>

                <v-text-field
                  v-model.trim="formAccount.FULL_NAME"
                  :disabled="!disabledMode"
                  label="Fullname"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model.trim="formAccount.EMAIL"
                  :disabled="!disabledMode"
                  :rules="emailRules"
                  label="Email"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model.trim="formAccount.PHONE"
                  :disabled="!disabledMode"
                  :rules="phonenumberRules"
                  label="Phonenumber"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model.trim="formAccount.ADDRESS"
                  :disabled="!disabledMode"
                  :rules="addressRules"
                  label="Address"
                  outlined
                  dense
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="!disabledMode"
                    large
                    width="120"
                    color="primary"
                    @click.prevent="disabledMode = true"
                  >
                    Edit
                  </v-btn>
                  <v-btn
                    v-if="disabledMode"
                    large
                    width="120"
                    @click="disabledMode = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    v-if="disabledMode"
                    large
                    width="120"
                    type="submit"
                    color="primary"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-tab-item>
          <v-tab-item value="account">
            <v-card class="switch-tab mb-5 center">
              <v-card-title class="headline">Change Password </v-card-title>
              <v-form
                ref="passwordForm"
                class="px-5 mt-5"
                @submit.prevent="updatePassword"
              >
                <v-text-field
                  v-model.trim="password.CURRENT_PASSWORD"
                  label="Current Password"
                  :rules="passwordRules"
                  outlined
                  dense
                  :type="showCurrentPwd ? 'text' : 'password'"
                  :append-icon="showCurrentPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showCurrentPwd = !showCurrentPwd"
                ></v-text-field>
                <v-text-field
                  v-model.trim="password.NEW_PASSWORD"
                  label="New Password"
                  :rules="passwordRules"
                  outlined
                  dense
                  :type="showNewPwd ? 'text' : 'password'"
                  :append-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showNewPwd = !showNewPwd"
                ></v-text-field>
                <v-text-field
                  v-model.trim="password.CONFIRM_PASSWORD"
                  label="Confirm Password"
                  :rules="confirmPasswordRules"
                  outlined
                  dense
                  :type="showConfirmPwd ? 'text' : 'password'"
                  :append-icon="showConfirmPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showConfirmPwd = !showConfirmPwd"
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-btn large width="120" type="submit" color="primary">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import {
  getAccountById,
  updateAccount,
  updatePasswordAccount,
} from '@/api/account'
import { setAccountInfo } from '~/utils/auth'
export default {
  data() {
    return {
      tab: null,
      disabledMode: false,
      passwordRules: [
        (v) => !!v || 'Please input password',
        (v) =>
          (v && v.length >= 8) || 'Password must be more than 8 characters',
        (v) =>
          (v && /(?=.*\d)/.test(v)) ||
          'Password must contain at least one digit',
        (v) =>
          (v && /(?=.*[a-z])/.test(v)) ||
          'Password must contain at least one lower case',
        (v) =>
          (v && /(?=.*[A-Z])/.test(v)) ||
          'Password must contain at least one upper case',
      ],
      confirmPasswordRules: [
        (v) => !!v || 'Please input confirm password',
        (v) =>
          (v && v === this.password.NEW_PASSWORD) ||
          'Password & confirm password must be same',
      ],
      emailRules: [(v) => /.+@.+\..+/.test(v) || 'E-mail is not valid'],
      phonenumberRules: [
        (v) =>
          (v && v.length === 10) || 'Phone number must be equal 10 characters',
      ],
      addressRules: [(v) => !!v || 'Please input address'],
      accountItem: null,
      formAccount: {
        USER_NAME: null,
        FULL_NAME: null,
        EMAIL: null,
        PHONE: null,
        ADDRESS: null,
        ROLE: null,
      },
      password: {
        CURRENT_PASSWORD: null,
        NEW_PASSWORD: null,
        CONFIRM_PASSWORD: null,
      },
      showCurrentPwd: false,
      showNewPwd: false,
      showConfirmPwd: false,
    }
  },
  watch: {
    disabledMode: {
      handler() {
        if (this.disabledMode) {
          this.formAccount = { ...this.accountItem }
          this.$refs.accountForm.resetValidation()
        }
      },
      deep: true,
    },
  },
  created() {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Account Settings')
    this.getAccountById()
  },
  methods: {
    getAccountById() {
      const idAccount = this.$store.state.accountInfo.USER_NO
      if (idAccount) {
        getAccountById(idAccount)
          .then((res) => {
            const data = res.data.DataResult
            this.formAccount = data
            this.accountItem = data
          })
          .catch((e) => {
            this.$store.dispatch('showSnackbar', {
              status: false,
              message: e,
            })
          })
      } else {
        this.$store.dispatch('showSnackbar', {
          status: false,
        })
      }
    },
    updateAccount() {
      const valid = this.$refs.accountForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
        })
        return false
      } else {
        const data = this.formAccount
        updateAccount(data, data.USER_NO)
          .then((res) => {
            this.accountItem = data
            setAccountInfo(data)
            this.$store.commit('SET_ACCOUNT_INFO', data)
            this.$store.dispatch('showSnackbar', {
              status: true,
              message: res.data.Message,
            })
            this.disabledMode = false
          })
          .catch((error) => {
            this.$store.dispatch('showSnackbar', {
              status: false,
              message: error,
            })
          })
      }
    },
    updatePassword() {
      const valid = this.$refs.passwordForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
        })
        return false
      } else {
        const data = {
          oldPassword: this.password.CURRENT_PASSWORD,
          newPassword: this.password.NEW_PASSWORD,
        }
        updatePasswordAccount(data, this.accountItem.USER_NO)
          .then((res) => {
            this.$store.dispatch('showSnackbar', {
              status: true,
              message: res.data.Message + '. Please login again !',
            })
            this.disabledMode = false
            this.$refs.passwordForm.reset()
            // logout when change password success
            this.$store.dispatch('logout').then(() => {
              this.$router.push('/login')
            })
          })
          .catch((error) => {
            this.$store.dispatch('showSnackbar', {
              status: false,
              message: error,
            })
          })
      }
    },
  },
  head() {
    return {
      title: 'Profile',
    }
  },
}
</script>

<style lang="scss" scoped>
.w-1000 {
  max-width: 1000px !important;
}
.table--striped {
  table {
    th span {
      @extend .fs--18;
      color: #000;
      font-weight: 500;
    }
    tr:nth-of-type(even) {
      background-color: #edf0f5 !important;
    }
  }
}

.fs--18 {
  font-size: 18px;
}
</style>
