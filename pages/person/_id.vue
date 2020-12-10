<template>
  <v-layout>
    <v-container>
      <v-card class="switch-tab mb-5 center" max-width="220">
        <v-tabs v-model="tab" centered>
          <v-tab href="#editor" class="text-primary"> Editor </v-tab>

          <v-tab href="#preview" class="text-primary"> Preview </v-tab>
        </v-tabs>
      </v-card>
      <div align="right" class="container__resume btn__flex--mobile">
        <v-btn
          v-if="role !== 'User'"
          densi
          color="blue-grey"
          class="ma-2 white--text is__mobile"
          @click="dialogImport = importConfirm = true"
        >
          Update CV
          <v-icon right dark> edit </v-icon>
        </v-btn>
        <v-dialog
          v-if="dialogImport"
          v-model="dialogImport"
          persistent
          width="500"
        >
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
                Do you really want to update CV with
                <span v-if="selectedFile" class="red--text"
                  >{{ selectedFile.name }}
                </span>
                ?
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
                <v-btn
                  width="130"
                  :disabled="spinner"
                  @click="dialogImport = false"
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
        <v-menu transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              id="btn-download"
              densi
              :class="[
                'ma-2 white--text is__mobile',
                { disabled: downloadLoading },
              ]"
              color="deep-orange darken-1"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Download CV <v-icon right dark> mdi-cloud-download </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item link @click="downloadCV('pdf')">
              <v-list-item-title
                ><v-icon left color="error"> picture_as_pdf </v-icon>Download
                PDF</v-list-item-title
              >
            </v-list-item>
            <v-list-item link @click="downloadCV('excel')">
              <v-list-item-title
                ><v-icon left color="teal">explicit</v-icon> Download
                Excel</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-tabs-items v-model="tab" class="mt-10">
        <v-tab-item value="editor" class="container__resume">
          <Index></Index>
        </v-tab-item>
        <v-tab-item value="preview">
          <Preview></Preview>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-layout>
</template>

<script>
import Preview from '@/components/Preview'
import Index from '@/components/Editor/Index'
import {
  getPersonById,
  updateCV,
  downloadCVTemplate,
  downloadCV,
} from '@/api/person.js'
export default {
  name: 'Id',
  components: { Index, Preview },
  data() {
    return {
      downloadLoading: false,
      importLoading: false,
      tab: null,
      title: 'Editor',
      selectedFile: File,
      dialogImport: false,
      spinner: false,
      importConfirm: false,
    }
  },
  computed: {
    role() {
      return this.$store.state.accountInfo.ROLE
    },
  },
  created() {
    this.checkExistPerson()
  },
  methods: {
    checkExistPerson() {
      return getPersonById(this.$route.params.id).catch((error) => {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: error,
        })
        this.$router.push('/404')
      })
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
      return updateCV(+this.$route.params.id, formData)
        .then(({ data }) => {
          this.$store.dispatch('showSnackbar', {
            status: data.Result,
            message: data.Message,
          })
          this.$router.go(0) // re-render person info
        })
        .catch((err) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
        .finally(() => {
          this.spinner = this.importLoading = false
          this.closeDialogImport()
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
    downloadCV(type) {
      this.downloadLoading = true
      return downloadCV(this.$route.params.id, type)
        .then(({ data }) => {
          window.open(data.DataResult)
        })
        .catch((err) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
        .finally(() => (this.downloadLoading = false))
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss">
@media screen and (max-width: 600px) {
  .is__mobile {
    height: 40px !important;
    min-width: 60px !important;
    padding: 0 10px !important;
    font-size: 12px !important;
  }
  .btn__flex--mobile {
    display: flex;
    justify-content: center;
  }
}
.container__resume {
  margin: 0 auto;
  max-width: 1000px;
}
.center {
  margin: auto;
}
.text-primary {
  color: #177fd2 !important;
}
.switch-tab {
  border-radius: 20px !important;
}
.v-tab--active {
  background-color: #177fd2;
  border-radius: 20px;
  color: white !important;
  margin: 6px;
}
.v-tabs-slider-wrapper {
  height: 0 !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#btn-download.disabled {
  pointer-events: none;
  background-color: #ccc !important;
}
</style>
