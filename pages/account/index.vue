<template>
  <div>
    <transition name="fade">
      <v-card v-if="isShowSearchBar" class="mb-2" outlined>
        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSearch">
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="6" sm="6" class="d-flex flex-row" dense>
                <v-text-field
                  v-model.trim="search.name"
                  outlined
                  label="Full name"
                  dense
                  class="mr-3"
                />
              </v-col>
              <v-col cols="12" md="6" sm="6" class="d-flex flex-row" dense>
                <v-text-field
                  v-model.trim="search.email"
                  outlined
                  label="Email"
                  dense
                  class="mr-3"
                />
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="6" sm="6" class="d-flex flex-row" dense>
                <v-text-field
                  v-model.trim="search.phone"
                  outlined
                  label="Phone"
                  dense
                  class="mr-3"
                />
              </v-col>
              <v-col cols="12" md="6" sm="6" class="d-flex flex-row" dense>
                <v-text-field
                  v-model.trim="search.address"
                  outlined
                  label="Address"
                  dense
                  class="mr-3"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="text-center" dense>
                <v-btn color="primary" type="submit" dark> Search </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </transition>
    <v-data-table
      class="table--striped"
      :headers="headers"
      :items="accountList"
      :options.sync="options"
      :server-items-length="totalAccounts"
      :loading="loading"
      :loading-text="loadingText"
      :footer-props="footerProps"
      :no-data-text="noDataText"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Account List</v-toolbar-title>
          <v-spacer />
          <v-row class="justify-end">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  class="mr-2"
                  v-on="on"
                  @click="isShowSearchBar = !isShowSearchBar"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Search</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  class="mb-2"
                  @click="toggleDialog()"
                  v-on="on"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Create Account</span>
            </v-tooltip>
          </v-row>
        </v-toolbar>
      </template>
      <template v-slot:[`item.index`]="{ item }">
        <span class="px-2 font-weight-bold">{{ getIndex(item) }}</span>
      </template>
      <template v-slot:[`item.USER_CD`]="{ item }">
        <span class="font-weight-bold">{{ item.USER_CD }}</span>
      </template>
      <template v-slot:[`item.USER_NAME`]="{ item }">
        <span class="font-weight-bold">{{ item.USER_NAME }}</span>
      </template>
      <template v-slot:[`item.FULL_NAME`]="{ item }">
        <span class="font-weight-medium">{{ item.FULL_NAME }}</span>
      </template>
      <template v-slot:[`item.EMAIL`]="{ item }">
        <span class="font-weight-medium">{{ item.EMAIL }}</span>
      </template>
      <template v-slot:[`item.PHONE`]="{ item }">
        <span class="font-weight-medium">{{ item.PHONE }}</span>
      </template>
      <template v-slot:[`item.ROLE`]="{ item }">
        <span class="font-weight-medium">{{ item.ROLE }}</span>
      </template>
      <template v-slot:[`item.ADDRESS`]="{ item }">
        <span class="font-weight-medium description__line--4">{{
          item.ADDRESS
        }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex flex-column my-2">
          <v-btn
            v-if="item.USER_NAME.toUpperCase() !== 'ADMIN'"
            small
            width="150"
            class="mb-3"
            @click="toggleDialog(item, getIndex(item) - 1)"
          >
            Edit
          </v-btn>
          <v-btn
            v-if="item.USER_NAME.toUpperCase() !== 'ADMIN'"
            small
            width="150"
            color="error"
            @click="onDelete(item, getIndex(item) - 1)"
          >
            Delete
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <!-- dialog for creating or editing account -->
    <v-dialog v-model="isDialog" width="800">
      <v-card class="pb-5">
        <v-card-title>{{ title }}</v-card-title>
        <v-divider></v-divider>
        <v-form ref="accountForm" class="mx-8" @submit.prevent="onSubmit()">
          <v-row>
            <v-col cols="12" class="pa-0 pt-5">
              <v-text-field
                v-model.trim="accountItem.USER_NAME"
                label="Username"
                :disabled="!isCreate"
                :rules="userNameRules"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-text-field
                v-model.trim="accountItem.EMAIL"
                label="Email"
                :rules="emailRules"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-text-field
                v-model.trim="accountItem.FULL_NAME"
                label="Full name"
                :rules="fullNameRules"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-text-field
                v-model.trim="accountItem.PHONE"
                label="Phone number"
                :rules="phonenumberRules"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-combobox
                v-model="accountItem.ROLE"
                :items="roles"
                label="Role"
                :rules="roleRules"
                outlined
                dense
              ></v-combobox>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-textarea
                v-model="accountItem.ADDRESS"
                label="Address"
                :rules="addressRules"
                outlined
                dense
              ></v-textarea>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  v-model="PASSWORD"
                  label="Password"
                  :rules="passwordRules"
                  autocomplete
                  outlined
                  dense
                  :type="showPwd ? 'text' : 'password'"
                  :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPwd = !showPwd"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  v-model="CONFIRM_PASSWORD"
                  label="Confirm Password"
                  autocomplete
                  :rules="confirmPasswordRules"
                  outlined
                  dense
                  :type="showPwdConfirm ? 'text' : 'password'"
                  :append-icon="showPwdConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPwdConfirm = !showPwdConfirm"
                >
                </v-text-field>
              </v-col>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-end px-0" dense>
            <v-btn color="white" width="130" @click="resetDialog">Cancel</v-btn>
            <v-btn type="submit" width="130" color="primary">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- delete form -->
    <v-dialog v-model="dialogDelete" width="500">
      <v-card class="text-center">
        <v-card-text class="py-5 text-center title">
          Do you really want to delete ? This process cannot be undone.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn width="120" @click="dialogDelete = false">Cancel</v-btn>
          <v-btn color="error" width="120" @click="handleDelete()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  deleteAccount,
  getAccountList,
  insertAccount,
  updateAccount,
} from '@/api/account'
export default {
  data() {
    return {
      title: 'Add Account',
      imgSrc:
        'https://cuongtruyen.com/wp-content/uploads/2018/11/Shank-1024x576.jpg',
      totalAccounts: 0,
      loading: false,
      isCreate: false,
      loadingText: 'Loading...',
      footerProps: {
        'items-per-page-text': 'Items per page',
        'items-per-page-options': [10, 20, 50, 100],
      },
      noDataText: 'No data',
      options: {
        page: 1,
        itemsPerPage: 10,
        search: {
          name: '',
          email: '',
          phone: '',
          address: '',
        },
      },
      headers: [
        {
          text: '#',
          sortable: false,
          value: 'index',
          width: 30,
        },
        { text: 'User ID', align: 'center', sortable: false, value: 'USER_CD' },
        {
          text: 'Username',
          sortable: false,
          value: 'USER_NAME',
        },
        {
          text: 'Full name',
          sortable: false,
          value: 'FULL_NAME',
        },
        { text: 'Email', sortable: false, value: 'EMAIL' },
        {
          text: 'Phone number',
          sortable: false,
          value: 'PHONE',
          width: 150,
        },
        {
          text: 'Role',
          sortable: false,
          value: 'ROLE',
          width: 150,
        },
        {
          text: 'Address',
          sortable: false,
          value: 'ADDRESS',
          width: 300,
        },
        {
          text: 'Actions',
          sortable: false,
          align: 'center',
          value: 'actions',
          width: 100,
        },
      ],
      roles: ['User', 'Admin', 'Mod'],
      accountList: [],
      isDialog: false,
      dialogDelete: false,
      editItem: {},
      search: {
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      accountItem: {
        USER_NAME: null,
        FULL_NAME: null,
        EMAIL: null,
        PHONE: null,
        ADDRESS: null,
        ROLE: null,
      },
      CONFIRM_PASSWORD: null,
      PASSWORD: null,
      accountDelete: {},
      userNameRules: [(v) => !!v || 'Please input UserName'],
      emailRules: [
        (v) => !!v || 'Please input Email',
        (v) => /.+@.+\..+/.test(v) || 'E-mail is not valid',
      ],
      fullNameRules: [(v) => !!v || 'Please input full name'],
      addressRules: [(v) => !!v || 'Please input address'],
      roleRules: [(v) => !!v || 'Please input role'],
      passwordRules: [
        (v) => !!v || !this.isCreate || 'Please input password',
        (v) =>
          (v && v.length >= 8) ||
          !this.isCreate ||
          'Password must be more than 8 characters',
        (v) =>
          (v && /(?=.*\d)/.test(v)) ||
          !this.isCreate ||
          'Password must contain at least one digit',
        (v) =>
          (v && /(?=.*[a-z])/.test(v)) ||
          !this.isCreate ||
          'Password must contain at least one lower case',
        (v) =>
          (v && /(?=.*[A-Z])/.test(v)) ||
          !this.isCreate ||
          'Password must contain at least one upper case',
      ],
      confirmPasswordRules: [
        (v) => !!v || !this.isCreate || 'Please input confirm password',
        (v) =>
          v === this.PASSWORD || 'Password & confirm password must be same',
      ],
      phonenumberRules: [
        (v) =>
          (v && v.length === 10) || 'Phone number must be equal 10 characters',
        (v) => !!v || 'Please input phone number',
      ],
      isShowSearchBar: false,
      showPwd: false,
      showPwdConfirm: false,
    }
  },
  watch: {
    isDialog() {
      if (!this.isDialog) {
        this.resetDialog()
      }
    },
    options: {
      handler(newValue, oldValue) {
        if (this.checkChange(newValue, oldValue)) {
          this.getDataList()
        }
      },
    },
  },
  created() {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Account List')
    this.getDataList()
  },
  methods: {
    checkChange(newValue, oldValue) {
      return (
        oldValue.search.name !== newValue.search.name ||
        oldValue.search.email !== newValue.search.email ||
        oldValue.search.phone !== newValue.search.phone ||
        oldValue.search.address !== newValue.search.address ||
        oldValue.page !== newValue.page ||
        oldValue.itemsPerPage !== newValue.itemsPerPage
      )
    },
    handleSearch() {
      this.options = {
        ...this.options,
        page: 1,
        search: { ...this.search },
      }
    },
    getDataList() {
      const { page, itemsPerPage, search } = this.options

      const params = { iPageNum: page, iPageSize: itemsPerPage }
      if (search.name) params.fullname = search.name
      if (search.email) params.email = search.email
      if (search.phone) params.phone = search.phone
      if (search.address) params.address = search.address
      this.loading = true
      return getAccountList(params)
        .then(({ data }) => {
          this.loading = false
          this.totalAccounts = data.DataResult.Pagging.TotalNum
          if (data.DataResult.ListAccount) {
            this.accountList = data.DataResult.ListAccount
          }
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error.Message,
          })
        })
    },
    insertAccount() {
      this.accountItem.PASSWORD = this.PASSWORD
      insertAccount(this.accountItem)
        .then(({ data }) => {
          this.totalAccounts += 1
          this.accountList.unshift({ ...data.DataResult })
          if (this.accountList.length >= 10) {
            this.accountList.pop()
          }
          this.toggleDialog()
          this.resetDialog()
          this.$store.dispatch('showSnackbar', {
            status: true,
            message: data.Message,
          })
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    updateAccount() {
      const data = {
        FULL_NAME: this.accountItem.FULL_NAME,
        EMAIL: this.accountItem.EMAIL,
        PHONE: this.accountItem.PHONE,
        ADDRESS: this.accountItem.ADDRESS,
        ROLE: this.accountItem.ROLE,
      }
      if (this.PASSWORD) data.PASSWORD = this.PASSWORD
      updateAccount(data, this.accountItem.USER_NO)
        .then(({ data }) => {
          this.accountList.splice(this.indexItem, 1, { ...this.accountItem })
          this.$store.dispatch('showSnackbar', {
            status: true,
            message: data.Message,
          })
          this.toggleDialog()
          this.resetDialog()
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    handleDelete() {
      deleteAccount(this.accountItem.USER_NO)
        .then(({ data }) => {
          this.dialogDelete = false
          const index = this.accountList.findIndex(
            (c) => c.Id === this.accountItem.Id
          )
          this.accountList.splice(index, 1)
          this.totalAccounts -= 1
          this.$store.dispatch('showSnackbar', {
            status: true,
            message: data.Message,
          })
          this.resetDialog()
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    resetDialog() {
      this.indexItem = ''
      this.isCreate = false
      this.isDialog = false
      this.showPwd = this.showPwdConfirm = false
      this.$refs.accountForm.reset()
    },
    toggleDialog(value, index) {
      this.indexItem = index
      this.isDialog = !this.isDialog
      if (value) {
        this.title = 'Edit Account'
        this.accountItem = { ...value }
        return false
      }
      this.title = 'Create Account'
      this.isCreate = true
    },
    onSubmit() {
      const valid = this.$refs.accountForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'This field is not valid',
        })
        return false
      }
      if (this.isCreate) {
        this.insertAccount()
        return false
      }
      this.updateAccount()
    },
    onDelete(value, index) {
      this.dialogDelete = true
      this.indexItem = index
      this.accountItem = { ...value }
    },
    getIndex(item) {
      const index = this.accountList.map((v) => v.USER_NO).indexOf(item.USER_NO)
      const { page, itemsPerPage } = this.options
      return index + 1 + (page - 1) * itemsPerPage
    },
  },
  head() {
    return {
      title: 'Account',
    }
  },
}
</script>
<style lang="scss"></style>
