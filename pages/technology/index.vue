<template>
  <v-layout>
    <v-container>
      <transition name="fade">
        <v-card v-if="isShowSearchBar" class="mb-2" outlined>
          <v-card-text>
            <v-form ref="form" @submit.prevent="getSearchList">
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="6" sm="6" class="d-flex flex-row" dense>
                  <v-text-field
                    v-model.trim="searchName"
                    outlined
                    label="Search technology by name"
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
        :headers="headers"
        :items="technologyList"
        :options.sync="options"
        :server-items-length="totalItems"
        :loading="loading"
        :loading-text="loadingText"
        :footer-props="footerProps"
        :no-data-text="noDataText"
        mobile-breakpoint="960"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-row>
              <v-col cols="12" sm="6" class="py-0 py-md-5">
                <v-toolbar-title class="my-auto h-100"
                  >Technology List</v-toolbar-title
                >
                <v-divider class="mx-4" inset vertical />
                <v-spacer />
              </v-col>
              <v-col cols="12" sm="6" class="mb-5 py-0 py-md-5">
                <v-row class="justify-sm-end mx-auto">
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
                        @click="openDialog()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Add Technology</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot:[`item.index`]="{ item }">
          <span class="px-2">{{ getIndex(item) }}</span>
        </template>
        <template v-slot:[`item.Name`]="{ item }">
          <span class="w-300 description__line--4">{{ item.Name }}</span>
        </template>
        <template v-slot:[`item.CategoryName`]="{ item }">
          <span class="w-150 description__line--4">{{
            item.CategoryName
          }}</span>
        </template>
        <template v-slot:[`item.CreatedAt`]="{ item }">
          <span class="w-300 description__line--4">{{
            item.CreatedAt | DateFormat
          }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex flex-column pr-md-8 py-md-3 pr-sm-0 my-2">
            <v-btn
              small
              width="150"
              class="mb-3"
              @click="editTechnology(item, getIndex(item) - 1)"
            >
              Edit
            </v-btn>
            <v-btn
              small
              width="150"
              color="error"
              @click="getTechnologyDelete(item, getIndex(item))"
            >
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" width="800">
        <v-card>
          <v-card-title class="headline">
            {{ form.Id ? 'Edit' : 'Create' }}
          </v-card-title>
          <v-divider></v-divider>
          <v-form
            ref="submitForm"
            class="px-5 mt-5"
            @submit.prevent="handleSubmit()"
          >
            <v-text-field
              v-model.trim="form.Name"
              :rules="techNameRules"
              label="Name"
              outlined
              dense
            ></v-text-field>
            <v-select
              v-model="form.CategoryId"
              :items="categoryList"
              :rules="[(v) => !!v || 'This field is required']"
              item-text="Name"
              item-value="Id"
              label="Category"
              dense
              outlined
            ></v-select>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn large width="120" @click="closeDialog()"> Cancel </v-btn>
              <v-btn large width="120" type="submit" color="primary">
                {{ form.Id ? 'Save' : 'Add' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- delete form -->
      <v-dialog v-model="dialogDelete" width="500">
        <v-card class="text-center">
          <v-card-text class="py-5 text-center title">
            {{
              `Do you really want to delete "${itemDelete.Name}" ? This process cannot be undone.`
            }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="120" @click="dialogDelete = false">Cancel</v-btn>
            <v-btn
              color="error"
              width="120"
              @click="deleteTechnology(itemDelete)"
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
  getTechnologyList,
  updateTechnology,
  createTechnology,
  deleteTechnology,
} from '@/api/technology'
import { getCategoryList } from '@/api/category'
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      itemDelete: {},
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
        'items-per-page-options': [10, 20, 50, 100],
      },
      noDataText: 'No data',
      headers: [
        {
          text: '#',
          sortable: false,
          value: 'index',
          width: 50,
        },
        { text: 'Name', sortable: true, value: 'Name', width: 300 },
        {
          text: 'Category',
          sortable: true,
          value: 'CategoryName',
          width: 150,
        },
        { text: 'Created At', sortable: true, value: 'CreatedAt', width: 150 },
        {
          text: 'Actions',
          sortable: false,
          value: 'actions',
          width: 100,
        },
      ],
      searchName: '',
      technologyList: [],
      categoryList: [],
      form: {
        Id: null,
        Name: null,
        CategoryId: null,
      },
      techNameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (!!v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
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
      handler(oldValue, newValue) {
        if (
          oldValue.search !== newValue.search ||
          oldValue.itemsPerPage !== newValue.itemsPerPage ||
          oldValue.page !== newValue.page
        ) {
          this.getDataList()
        }
      },
      deep: true,
    },
  },
  created() {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Technology List')
    this.getDataList()
    this.getCategory()
  },
  methods: {
    getSearchList() {
      this.options = {
        ...this.options,
        page: 1,
        search: this.searchName.trim(),
      }
    },
    getDataList() {
      this.loading = true
      const { page, itemsPerPage, search } = this.options
      const params = {
        page,
        limit: itemsPerPage,
      }
      if (search) params.search = search
      return getTechnologyList(params)
        .then((res) => {
          const { DataResult } = res.data
          this.totalItems = res.data.totalCount
          this.loading = false
          this.technologyList = DataResult
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    getCategory() {
      return getCategoryList({})
        .then((res) => {
          const { DataResult } = res.data
          this.loading = false
          this.categoryList = DataResult
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    getTechnologyDelete(item, index) {
      this.itemDelete = item
      this.itemDelete.index = index
      this.dialogDelete = true
    },
    createOrEditTechnology(tech) {
      if (tech.Id) {
        const data = {
          Id: tech.Id,
          CategoryId: tech.CategoryId,
          Name: tech.Name,
        }
        return updateTechnology(data)
          .then((res) => {
            const categoryItem = this.categoryList.find(
              (i) => i.Id === data.CategoryId
            )
            data.CategoryName = categoryItem.Name
            this.technologyList.splice(this.form.indexTech, 1, data)
            this.$store.dispatch('showSnackbar', {
              status: true,
              message: res.data.Message,
            })
            this.closeDialog()
          })
          .catch((error) => {
            this.$store.dispatch('showSnackbar', {
              status: false,
              message: error,
            })
          })
      } else {
        const params = {
          CategoryId: tech.CategoryId,
          Name: tech.Name,
        }
        return createTechnology(params)
          .then((res) => {
            this.closeDialog()
            this.totalItems += 1
            this.technologyList.unshift(res.data.DataResult)
            if (this.technologyList.length >= 10) {
              this.technologyList.pop()
            }
            this.$store.dispatch('showSnackbar', {
              status: true,
              message: res.data.Message,
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
    deleteTechnology(itemDelete) {
      return deleteTechnology(itemDelete.Id)
        .then((res) => {
          const technologiesIndex = this.technologyList.findIndex(
            (c) => c.Id === itemDelete.Id
          )
          this.technologyList.splice(technologiesIndex, 1)
          this.dialogDelete = false
          this.totalItems -= 1
          this.$store.dispatch('showSnackbar', {
            status: true,
            message: res.data.Message,
          })
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    editTechnology(tech, index) {
      this.openDialog()
      this.form = { ...tech }
      this.form.indexTech = index
    },
    handleSubmit() {
      const valid = this.$refs.submitForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
        })
        return false
      } else {
        this.createOrEditTechnology(this.form)
      }
    },
    clearForm() {
      this.form = {
        Id: null,
      }
      this.$refs.submitForm.resetValidation()
    },
    getIndex(item) {
      const index = this.technologyList.map((v) => v.Id).indexOf(item.Id)
      const { page, itemsPerPage } = this.options
      return index + 1 + (page - 1) * itemsPerPage
    },
  },
  head() {
    return {
      title: 'Technology',
    }
  },
}
</script>

<style lang="scss" scoped></style>
