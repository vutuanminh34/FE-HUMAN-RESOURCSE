<template>
  <div class="edit-container mb-4">
    <div class="edit-container__header pa-5">
      <div class="d-flex justify-space-between align-center">
        <span
          class="d-inline-block edit-container__title font-weight-bold text-capitalize"
          >Certificates</span
        >
        <v-btn
          v-if="role !== 'User'"
          text
          color="primary"
          class="text-capitalize"
          @click="OpenDialog()"
        >
          Add
        </v-btn>
      </div>
    </div>
    <div class="edit-container__content d-flex flex-column">
      <div
        v-for="(certificate, index) of certificates"
        :key="certificate.Id"
        class="certificate px-5 py-3"
      >
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex flex-column">
            <div class="certificate__name font-weight-bold word-break">
              <span>{{ certificate.Name }}</span>
            </div>
            <div class="mt-2 certificate__content">
              <div class="certificate__provider word-break">
                <span>{{ certificate.Provider }}</span>
              </div>
              <div class="certificate__date ml-1">
                <span
                  >(
                  {{ certificate.StartDate }}
                  {{ certificate.EndDate ? '-' : '' }}
                  {{ certificate.EndDate ? certificate.EndDate : '' }}
                  )</span
                >
              </div>
            </div>
          </div>
          <div v-if="role !== 'User'" class="certificate__btns">
            <div v-if="certificates.length > 1" class="d-flex align-center">
              <div
                v-if="index === 0"
                class="position-btn"
                @click.prevent="handleSwapCertificateOrder(index, index + 1)"
              >
                <v-icon x-small color="primary">south</v-icon>
              </div>
              <div
                v-else-if="index === certificates.length - 1"
                class="position-btn"
                @click.prevent="handleSwapCertificateOrder(index, index - 1)"
              >
                <v-icon x-small color="primary">north</v-icon>
              </div>
              <div v-else class="d-flex">
                <div
                  class="position-btn"
                  @click.prevent="handleSwapCertificateOrder(index, index - 1)"
                >
                  <v-icon x-small color="primary">north</v-icon>
                </div>
                <div
                  class="position-btn ml-2"
                  @click.prevent="handleSwapCertificateOrder(index, index + 1)"
                >
                  <v-icon x-small color="primary">south</v-icon>
                </div>
              </div>
            </div>
            <div class="content__edit-btn ml-3">
              <v-btn text color="primary" @click="editCertificate(certificate)">
                Edit
              </v-btn>
            </div>
            <div class="content__delete-btn">
              <v-btn
                text
                color="#F44336"
                @click="handleDeleteCertificate(certificate)"
              >
                Delete
              </v-btn>
            </div>
          </div>
        </div>
      </div>
      <v-dialog v-model="dialog" width="800" persistent>
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
              v-model="form.Name"
              :rules="nameRules"
              label="Name"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="form.Provider"
              :rules="providerRules"
              label="Provider"
              outlined
              dense
            ></v-text-field>
            <div class="d-flex my-2">
              <v-select
                v-model="form.StartDate"
                :items="years"
                label="From"
                dense
                outlined
                class="mr-6"
                :rules="startDateRules"
              ></v-select>
              <v-select
                v-model="form.EndDate"
                :items="yearsForSelect"
                label="To"
                dense
                :disabled="!form.StartDate"
                outlined
                :rules="endDateRules"
                @click="filterEndDate()"
              ></v-select>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn width="100" @click="CloseDialog()"> Cancel </v-btn>
              <v-btn width="100" type="submit" color="primary">
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
            <v-btn color="error" width="130" @click="deleteCertificate()"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSwap" width="500">
        <v-card class="text-center">
          <v-card-text class="py-5 text-center title">
            Do you really want to move this certificate {{ swappedTo }}?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="130" @click="dialogSwap = false">Cancel</v-btn>
            <v-btn color="error" width="130" @click="swapCertificateOrder()"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { generateDynamicYear } from '@/utils/index'
import {
  getCertificateById,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  swapCertificateOrder,
} from '@/api/certificate'
export default {
  name: 'EditorCertificates',
  data() {
    return {
      title: 'Certificate',
      dialog: false,
      dialogTitle: 'Add',
      dialogDelete: false,
      dialogSwap: false,
      form: {
        Name: null,
        Provider: null,
        StartDate: null,
        EndDate: null,
      },
      yearsForSelect: [],
      years: [],
      certificates: [],
      providerRules: [(v) => !!v || 'Name is required'],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (!!v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      startDateRules: [(v) => !!v || 'This field is required'],
      endDateRules: [(v) => !!v || 'This field is required'],
      startDateMenu: false,
      endDateMenu: false,
      deletedCertificate: null,
      swappedFromIndex: null,
      swappedToIndex: null,
    }
  },
  computed: {
    swappedTo() {
      return this.swappedFromIndex > this.swappedToIndex ? 'up' : 'down'
    },
    role() {
      return this.$store.state.accountInfo.ROLE
    },
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.clearForm()
      }
    },
    certificates() {
      this.$store.dispatch('resume/setListCertificate', this.certificates)
    },
  },
  created() {
    this.years = generateDynamicYear()
    this.yearsForSelect = generateDynamicYear()
    this.getCertificates()
  },
  methods: {
    getCertificates() {
      getCertificateById(this.$route.params.id)
        .then((res) => {
          this.certificates = res.data.DataResult
        })
        .catch((e) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: e,
          })
        })
    },
    filterEndDate() {
      this.yearsForSelect = this.years.filter((y) => y >= this.form.StartDate)
    },
    OpenDialog() {
      this.dialog = true
      this.dialogTitle = 'Add'
    },
    CloseDialog() {
      this.dialog = false
    },
    editCertificate(certificate) {
      this.OpenDialog()
      this.dialogTitle = 'Save'
      this.form = { ...certificate }
    },
    deleteCertificate() {
      const certificate = this.deletedCertificate
      deleteCertificate(certificate.Id)
        .then((res) => {
          this.certificates.splice(
            this.findCertificateIndexById(certificate.Id),
            1
          )

          this.dialogDelete = false
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
    },
    handleDeleteCertificate(certificate) {
      this.dialogDelete = true
      this.deletedCertificate = certificate
    },
    handleSubmit() {
      const valid = this.$refs.submitForm.validate()
      if (this.form.startDate > this.form.endDate) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'Start date must come before end date',
        })

        return false
      }
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'Please fill all the fields',
        })

        return false
      } else {
        const certificate = this.form
        if (certificate.Id) {
          updateCertificate(
            {
              Name: this.form.Name,
              Provider: this.form.Provider,
              StartDate: this.form.StartDate,
              EndDate: this.form.EndDate,
            },
            certificate.Id
          )
            .then((res) => {
              this.certificates.splice(
                this.findCertificateIndexById(certificate.Id),
                1,
                { ...certificate }
              )

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
          addCertificate({ ...this.form, personId: this.$route.params.id })
            .then((res) => {
              const newCertificate = res.data.DataResult
              this.certificates.push(newCertificate)
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
    handleSwapCertificateOrder(from, to) {
      this.dialogSwap = true
      this.swappedFromIndex = from
      this.swappedToIndex = to
    },
    async swapCertificateOrder() {
      const [from, to] = [this.swappedFromIndex, this.swappedToIndex]
      const CurrentId = this.certificates[from].Id
      const TurnedId = this.certificates[to].Id
      try {
        const res = await swapCertificateOrder({
          CurrentId,
          TurnedId,
        })
        this.swapItem(from, to)
        this.dialogSwap = false
        this.$store.dispatch('showSnackbar', {
          status: true,
          message: res.data.Message,
        })
      } catch (e) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: e,
        })
      }
    },
    swapItem(from, to) {
      this.certificates.splice(to, 0, this.certificates.splice(from, 1)[0])
      return this
    },
    clearForm() {
      this.form = {
        Name: null,
        Provider: null,
        StartDate: null,
        EndDate: null,
      }
      this.$refs.submitForm.resetValidation()
    },
    findCertificateIndexById(id) {
      return this.certificates.findIndex((c) => c.Id === id)
    },
  },
}
</script>

<style lang="scss" scoped>
.certificate {
  border-bottom: 1px solid #eeeeee;
  &__btns {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.content {
  &__edit-btn {
    margin: 0.5rem 0;
  }
}

.position-btn {
  text-align: center;
  width: 25px;
  height: 25px;
  border: 1px solid #1867c0;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #1867c0;
    i {
      color: #fff !important;
    }
  }
}

@media screen and (min-width: 600px) {
  .certificate {
    &__content {
      display: flex;
    }
    &__btns {
      flex-direction: row;
    }
  }

  .content {
    &__edit-btn {
      margin: 0;
    }
  }
}
</style>
