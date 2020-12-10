<template>
  <v-layout class="d-flex flex-column">
    <transition name="fade">
      <v-card v-if="isShowSearchBar" class="mb-2" outlined>
        <v-card-text>
          <v-form ref="form" @submit.prevent="searchPerson()">
            <v-row>
              <v-col class="d-flex" cols="12" sm="6" dense>
                <v-text-field
                  v-model.trim="searchName"
                  label="Name"
                  dense
                  outlined
                  clearable
                />
              </v-col>
              <v-col class="d-flex" cols="12" sm="6" dense>
                <v-select
                  v-model.trim="searchOffice"
                  label="Office"
                  dense
                  outlined
                  :items="listOffice"
                  item-text="name"
                  item-value="id"
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" dense>
                <v-autocomplete
                  v-model="searchTechnologies"
                  chips
                  :items="technologyList"
                  label="Skills"
                  item-text="Name"
                  item-value="Id"
                  multiple
                  hide-selected
                  outlined
                  clearable
                  no-data-text="Data not found"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      color="primary"
                      close
                      small
                      @click="data.select"
                      @click:close="removeTechnology(data.item)"
                    >
                      {{ data.item.Name }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="data.item.Name"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
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
      :items="personList"
      :options.sync="options"
      :loading="loading"
      :loading-text="loadingText"
      :footer-props="footerProps"
      :no-data-text="noDataText"
      mobile-breakpoint="1264"
      :server-items-length="totalItems"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-row class="mt-5">
            <v-col cols="12" sm="6" class="py-0 py-md-5">
              <v-toolbar-title>Person List</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer />
            </v-col>
            <v-col cols="12" sm="6" class="mb-5 py-0 py-md-5">
              <v-row class="mb-5 mx-auto justify-sm-end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="primary"
                      dark
                      v-on="on"
                      @click="isShowSearchBar = !isShowSearchBar"
                    >
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                  <span>Search</span>
                </v-tooltip>
                <v-tooltip v-if="role !== 'User'" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="primary"
                      class="white--text mx-2"
                      v-on="on"
                      @click="dialogImport = importConfirm = true"
                    >
                      <v-icon dark> mdi-cloud-upload </v-icon>
                    </v-btn>
                  </template>
                  <span>Import File Excel</span>
                </v-tooltip>
                <v-tooltip v-if="role !== 'User'" bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      color="primary"
                      class="add-btn"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      @click="dialog = true"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Create Person</span>
                </v-tooltip>
              </v-row>
            </v-col>
            <v-dialog v-model="dialogDelete" width="500">
              <v-card class="text-center">
                <v-card-text class="py-5 text-center title">
                  Do you really want to delete ? This process cannot be undone.
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn width="100" @click="dialogDelete = false"
                    >Cancel</v-btn
                  >
                  <v-btn color="error" width="100" @click="handleDeletePerson()"
                    >Yes</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogImport" persistent width="500">
              <transition name="fade" mode="out-in">
                <v-card v-if="importConfirm" key="1">
                  <input
                    ref="importFile"
                    type="file"
                    name="importFile"
                    hidden
                    accept=".xls,.xlsx"
                    @change="progressImportFile($event)"
                  />
                  <v-card-text class="py-5 text-center title">
                    Do you have CV template?
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" @click="dialogImport = false"
                          >Cancel</v-btn
                        >
                      </template>
                      <span>Cancel</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="blue-grey"
                          class="mx-2 white--text"
                          v-on="on"
                          @click="downloadTemplate()"
                        >
                          No
                        </v-btn>
                      </template>
                      <span>Download Template</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="light-blue accent-4"
                          class="white--text"
                          v-on="on"
                          @click="chooseFIleImport()"
                        >
                          Yes
                        </v-btn>
                      </template>
                      <span>Choose File</span>
                    </v-tooltip>
                  </v-card-actions>
                </v-card>
                <v-card v-else key="2">
                  <v-card-text class="py-5 text-center title">
                    Do you really want to import
                    <span v-if="selectedFile" class="red--text"
                      >{{ selectedFile.name }}
                    </span>
                    file?
                    <div v-if="spinner" class="mt-3">
                      <v-progress-circular
                        indeterminate
                        size="35"
                        width="3"
                        color="primary"
                      ></v-progress-circular>
                    </div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn width="130" @click="dialogImport = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="error"
                      width="130"
                      :loading="importLoading"
                      :disabled="importLoading"
                      @click="importFile()"
                      >Yes
                      <template v-slot:loader>
                        <span>Loading... </span>
                      </template>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </transition>
            </v-dialog>
          </v-row>
        </v-toolbar>
      </template>
      <template v-slot:[`item.index`]="{ item }">
        <span class="px-2 font-weight-bold">{{ getIndex(item) }}</span>
      </template>
      <template v-slot:[`item.StaffId`]="{ item }">
        <span class="font-weight-bold">{{ item.StaffId }}</span>
      </template>
      <template v-slot:[`item.Location`]="{ item }">
        <span class="font-weight-bold">{{
          getLocationCode(item.Location)
        }}</span>
      </template>
      <template v-slot:[`item.FullName`]="{ item }">
        <v-col>
          <span class="fs--18 font-weight-medium">{{ item.FullName }}</span>
          <p class="description__line--4">{{ item.Description }}</p>
        </v-col>
      </template>
      <template v-slot:[`item.Avatar`]="{ item }">
        <v-avatar size="70" class="px-0">
          <img :src="handleImgSrc(item.Avatar)" />
        </v-avatar>
      </template>
      <template v-slot:[`item.Skills`]="{ item }">
        <div class="py-5">
          <div
            v-for="(category, index) in item.Categories"
            :key="index"
            class="py-1"
          >
            <v-row>
              <span class="font-weight-bold">{{ category.Name }}</span> :
              <span class="description__line--1 ml-2">{{
                category.Technologies.map((tech) => tech.Name).join(', ')
              }}</span>
            </v-row>
          </div>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div v-if="role === 'User'" class="d-flex flex-column pr-8 py-5">
          <v-btn
            small
            width="150"
            class="mb-3"
            color="primary"
            @click="redirectToPersonDetail(item)"
          >
            Detail
          </v-btn>
        </div>
        <div v-else class="d-flex flex-column py-5">
          <v-btn
            small
            width="150"
            class="mb-3"
            @click="redirectToPersonDetail(item)"
          >
            Edit
          </v-btn>
          <v-btn
            small
            width="150"
            color="error"
            @click="handleDeletePerson(item)"
          >
            Delete
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <ProfilePopup
      v-if="dialog"
      :dialog="dialog"
      @change-dialog="handleCloseDialog"
      @new-info="handleNewInfo"
    />

    <v-dialog v-model="dialogDelete" width="500">
      <v-card class="text-center">
        <v-card-text class="py-5 text-center title">
          Do you really want to delete? This process cannot be undone.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn width="120" @click="dialogDelete = false">Cancel</v-btn>
          <v-btn color="error" width="120" @click="deletePerson()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import {
  ACCOUNT_INACTIVE,
  ACCOUNT_ACTIVE,
  getStatusAccountName,
  LIST_OFFICE,
  handleImgSrc,
} from '@/utils'

import ProfilePopup from '@/components/ProfilePopup'
import { deletePerson, getListPerson } from '@/api/person'
import { getTechnologyList } from '@/api/technology'
import { importCV, downloadCVTemplate } from '@/api/person.js'
export default {
  components: { ProfilePopup },
  data() {
    return {
      listOffice: LIST_OFFICE,
      totalUsers: 0,
      dialog: false,
      dialogDelete: false,
      loading: false,
      loadingText: 'Loading...',
      totalItems: 0,
      options: {
        page: 1,
        itemsPerPage: 10,
        location: null,
        fullName: null,
        technologiesId: [],
      },
      footerProps: {
        'items-per-page-text': 'Items per page',
        'items-per-page-options': [10, 20, 50, 100],
      },
      noDataText: 'No data',
      headers: [
        {
          text: '#',
          align: 'center',
          sortable: false,
          value: 'index',
          width: 50,
        },
        { text: 'Staff ID', sortable: false, value: 'StaffId', width: 100 },
        { text: 'Office', sortable: false, value: 'Location', width: 70 },
        { text: 'Avatar', sortable: false, value: 'Avatar', width: 70 },
        { text: 'Full Name', sortable: false, value: 'FullName', width: 200 },
        { text: 'Skills', sortable: false, value: 'Skills', width: 300 },
        {
          text: 'Actions',
          sortable: false,
          value: 'actions',
          width: 100,
        },
      ],
      personList: [],
      searchName: null,
      searchOffice: null,
      searchTechnologies: [],
      technologyList: [],
      deletedPerson: null,
      statusItems: [
        {
          value: ACCOUNT_INACTIVE,
          text: getStatusAccountName(ACCOUNT_INACTIVE),
        },
        {
          value: ACCOUNT_ACTIVE,
          text: getStatusAccountName(ACCOUNT_ACTIVE),
        },
      ],
      isShowSearchBar: false,
      importLoading: false,
      selectedFile: File,
      dialogImport: false,
      spinner: false,
      handleImgSrc,
      importConfirm: false,
    }
  },
  computed: {
    role() {
      return this.$store.state.accountInfo.ROLE
    },
  },
  watch: {
    options: {
      handler(newOption, oldOption) {
        if (
          oldOption.fullName !== newOption.fullName ||
          oldOption.location !== newOption.location ||
          JSON.stringify(oldOption.technologiesId) !==
            JSON.stringify(newOption.technologiesId) ||
          oldOption.itemsPerPage !== newOption.itemsPerPage ||
          oldOption.page !== newOption.page
        ) {
          this.getListPerson()
        }
      },
    },
  },
  created() {
    this.getListPerson()
    getTechnologyList()
      .then((res) => {
        const { DataResult } = res.data
        this.technologyList = DataResult
        return DataResult
      })
      .catch((e) => {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: e,
        })
      })
  },
  methods: {
    getLocationCode(id) {
      return LIST_OFFICE.find((l) => l.id === id).name
    },
    searchPerson() {
      this.options = {
        ...this.options,
        page: 1,
        fullName: this.searchName,
        location: this.searchOffice,
        technologiesId: [...this.searchTechnologies],
      }
    },
    getListPerson() {
      const {
        page,
        itemsPerPage,
        fullName,
        location,
        technologiesId,
      } = this.options

      const params = {
        page,
        limit: itemsPerPage,
      }

      if (fullName) {
        params.FullName = fullName
      }

      if (location !== null) {
        params.Location = location
      }

      if (technologiesId.length) {
        params.TechnologyId = technologiesId.toString()
      }

      this.loading = true
      return getListPerson(params)
        .then((res) => {
          const { DataResult } = res.data
          this.totalItems = res.data.totalCount
          this.personList = DataResult
        })
        .catch((e) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: e,
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDeletePerson(item) {
      this.dialogDelete = true
      this.deletedPerson = item
    },
    deletePerson() {
      deletePerson(this.deletedPerson.Id)
        .then((res) => {
          const index = this.personList.findIndex(
            (c) => c.Id === this.deletedPerson.Id
          )
          this.personList.splice(index, 1)
          this.totalItems -= 1
          this.dialogDelete = false
          this.$store.dispatch('showSnackbar', {
            status: true,
            message: res.data.DataResult,
          })
        })
        .catch((e) =>
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: e,
          })
        )
    },
    handleCloseDialog(value) {
      this.dialog = value
    },
    getIndex(item) {
      const index = this.personList.map((v) => v.Id).indexOf(item.Id)
      const { page, itemsPerPage } = this.options
      return index + 1 + (page - 1) * itemsPerPage
    },
    redirectToPersonDetail(item) {
      if (item) this.$router.push({ path: `/person/${item.Id}` })
    },
    removeTechnology(item) {
      const index = this.searchTechnologies.find((tech) => tech.Id === item.Id)
      this.searchTechnologies.splice(index, 1)
    },
    handleNewInfo(newInfo) {
      this.personList.unshift(newInfo)
      if (this.personList.length >= 10) {
        this.personList.pop()
      }
      this.totalItems++
    },
    closeDialogImport() {
      this.dialogImport = false
    },
    chooseFIleImport() {
      this.$refs.importFile.click()
    },
    progressImportFile(event) {
      this.selectedFile = event.target.files[0]
      this.importConfirm = false
    },
    importFile() {
      this.spinner = this.importLoading = true
      const formData = new FormData()
      formData.append('files', this.selectedFile)
      return importCV(formData)
        .then(({ data }) => {
          this.spinner = this.importLoading = false
          this.closeDialogImport()
          this.$store.dispatch('showSnackbar', {
            status: data.Result,
            message: data.Message,
          })
          this.$router.push({ path: `/person/${data.DataResult}` })
        })
        .catch((err) => {
          this.spinner = this.importLoading = false
          this.closeDialogImport()
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
    },
    downloadTemplate() {
      return downloadCVTemplate()
        .then(({ data }) => {
          this.dialogImport = false
          window.open(data.DataResult)
        })
        .catch((err) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
    },
  },
  head() {
    return {
      title: 'Resource List',
    }
  },
}
</script>
<style lang="scss"></style>
