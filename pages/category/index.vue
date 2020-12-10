<template>
  <v-layout>
    <v-container>
      <transition name="fade">
        <v-card v-if="isShowSearchBar" class="mb-2" outlined>
          <v-card-text>
            <v-form ref="form" @submit.prevent="getDataList">
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="6" sm="6" class="d-flex flex-row" dense>
                  <v-text-field
                    v-model.trim="searchCategoryName"
                    outlined
                    label="Search category by name"
                    dense
                    class="mr-5"
                  />
                  <v-btn color="primary" type="submit" dark> Search </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </transition>
      <v-data-table
        class="table--striped"
        mobile-breakpoint="960"
        :headers="headers"
        :items="categoryList"
        :options.sync="options"
        :loading="loading"
        :server-items-length="totalItems"
        :loading-text="loadingText"
        :footer-props="footerProps"
        :no-data-text="noDataText"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-row>
              <v-col cols="12" sm="6" class="py-0 py-md-5">
                <v-toolbar-title>Category List</v-toolbar-title>
                <v-divider class="mx-4" inset vertical />
                <v-spacer />
              </v-col>
              <v-row cols="12" sm="6" class="mb-5 py-0 py-md-5 px-5">
                <v-row class="mx-auto justify-sm-end">
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
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="OpenDialog()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Add Category</span>
                  </v-tooltip>
                </v-row>
              </v-row>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot:[`item.index`]="{ item }">
          <span class="px-2 font-weight-bold">{{ getIndex(item) }}</span>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span class="w-300 description__line--4">{{ item.Name }}</span>
        </template>
        <template v-slot:[`item.CreatedAt`]="{ item }">
          <span class="w-300 description__line--4">{{
            item.CreatedAt | DateFormat
          }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex flex-column py-3">
            <v-btn small width="150" class="mb-3" @click="editCategory(item)">
              Edit
            </v-btn>
            <v-btn
              small
              width="150"
              color="error"
              @click="handleDeleteCategory(item)"
            >
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" width="800">
        <v-card>
          <v-card-title class="headline">
            {{ dialogTitle }} {{ title }}
          </v-card-title>
          <v-divider></v-divider>
          <v-form
            ref="submitForm"
            class="px-5 mt-5"
            @submit.prevent="handleSubmit()"
          >
            <v-text-field
              v-model.trim="form.Name"
              :rules="categoryNameRules"
              label="Name"
              outlined
              dense
            ></v-text-field>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn large width="130" @click="CloseDialog()"> Cancel </v-btn>
              <v-btn large width="130" type="submit" color="primary">
                {{ dialogTitle }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" width="500">
        <v-card class="text-center">
          <v-card-text class="py-5 text-center title">
            Do you really want to delete ? This process cannot be undone.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="130" @click="dialogDelete = false">Cancel</v-btn>
            <v-btn color="error" width="130" @click="deleteCategory()"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-layout>
</template>
<script>
import {
  getCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/api/category'

export default {
  data() {
    return {
      dialog: false,
      dialogTitle: 'Add',
      dialogDelete: false,
      title: 'Category',
      totalItems: 0,
      loading: false,
      loadingText: 'Loading...',
      options: {
        page: 1,
        itemsPerPage: 10,
        search: null,
      },
      footerProps: {
        'items-per-page-text': 'Items per page',
        'items-per-page-options': [10, 20, 50],
      },
      noDataText: 'No data',
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'index',
          width: 50,
        },
        { text: 'Name', sortable: true, value: 'name', width: 300 },
        { text: 'Created At', sortable: true, value: 'CreatedAt', width: 150 },
        {
          text: 'Actions',
          sortable: false,
          value: 'actions',
          width: 100,
        },
      ],
      searchCategoryName: '',
      categoryList: [],
      form: {
        Name: null,
      },
      categoryNameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (!!v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      deletedCategory: null,
      isShowSearchBar: false,
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.clearForm()
      }
    },
    options: {
      handler(newValue, oldValue) {
        if (
          oldValue.search !== newValue.search ||
          oldValue.itemsPerPage !== newValue.itemsPerPage ||
          oldValue.page !== newValue.page
        ) {
          this.getCategoryList()
        }
      },
    },
  },
  created() {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Category List')
    this.getCategoryList()
  },
  methods: {
    getDataList() {
      this.options = {
        ...this.options,
        page: 1,
        search: this.searchCategoryName.trim(),
      }
    },
    getCategoryList() {
      const { page, itemsPerPage, search } = this.options

      const params = {
        page,
        limit: itemsPerPage,
      }

      if (search) params.search = search

      getCategoryList(params)
        .then((res) => {
          const data = res.data.DataResult
          this.totalItems = res.data.totalCount
          this.categoryList = data
        })
        .catch((e) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: e,
          })
        })
    },
    OpenDialog() {
      this.dialog = true
      this.dialogTitle = 'Add'
    },
    CloseDialog() {
      this.dialog = false
    },
    editCategory(category) {
      this.OpenDialog()
      this.dialogTitle = 'Edit'
      this.form = { ...category }
    },
    handleDeleteCategory(category) {
      this.dialogDelete = true
      this.deletedCategory = { ...category }
    },
    deleteCategory() {
      const category = this.deletedCategory
      deleteCategory(category.Id)
        .then((res) => {
          const categoryIndex = this.categoryList.findIndex(
            (c) => c.Id === category.Id
          )
          this.categoryList.splice(categoryIndex, 1)
          this.totalItems -= 1
          this.dialogDelete = false
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'success darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', res.data.Message)
        })
        .catch((e) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: e,
          })
        })
    },
    handleSubmit() {
      const valid = this.$refs.submitForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'Please fill all the fields',
        })
        return false
      } else {
        const category = this.form
        if (category.Id) {
          updateCategory(
            {
              Name: category.Name,
            },
            category.Id
          )
            .then((res) => {
              const index = this.categoryList.findIndex(
                (c) => c.Id === category.Id
              )
              this.categoryList.splice(index, 1, { ...category })
              this.$store.dispatch('showSnackbar', {
                status: true,
                message: res.data.Message,
              })
            })
            .catch((e) => {
              this.$store.dispatch('showSnackbar', {
                status: false,
                message: e,
              })
            })
        } else {
          addCategory(this.form)
            .then((res) => {
              const newCategory = res.data.DataResult
              this.categoryList.unshift(newCategory)
              if (this.categoryList.length >= 10) {
                this.categoryList.pop()
              }
              this.totalItems += 1
              this.$store.dispatch('showSnackbar', {
                status: true,
                message: res.data.Message,
              })
            })
            .catch((e) => {
              this.$store.dispatch('showSnackbar', {
                status: false,
                message: e,
              })
            })
        }
        this.CloseDialog()
      }
    },
    searchCategory() {
      this.categoryListForShow = this.categoryList.filter((category) =>
        category.Name.toLowerCase().includes(
          this.searchCategoryName.toLowerCase()
        )
      )
    },
    findCategoyById(id) {
      return this.categoryList.find((c) => c.Id === id)
    },
    clearForm() {
      this.form = {
        Name: null,
      }
      this.$refs.submitForm.resetValidation()
    },
    getIndex(item) {
      const index = this.categoryList.map((v) => v.Id).indexOf(item.Id)
      const { page, itemsPerPage } = this.options
      return index + 1 + (page - 1) * itemsPerPage
    },
  },
  head() {
    return {
      title: 'Category',
    }
  },
}
</script>

<style lang="scss" scoped></style>
