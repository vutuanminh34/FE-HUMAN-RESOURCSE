<template>
  <div class="edit-container mb-4">
    <div class="edit-container__header pa-5">
      <div class="d-flex justify-space-between align-center">
        <span
          class="d-inline-block edit-container__title font-weight-bold text-capitalize"
          >{{ title }}</span
        >
        <v-btn
          v-if="role !== 'User'"
          text
          color="primary"
          class="text-capitalize"
          @click="openDialog()"
        >
          Add
        </v-btn>
      </div>
    </div>
    <div class="edit-container__content">
      <div
        v-for="(education, index) of educations"
        :key="education.Id"
        class="education d-flex align-center justify-space-between px-5 py-3"
      >
        <div>
          <div class="education__name">
            <span class="font-weight-bold">{{ education.CollegeName }}</span>
          </div>
          <div class="education__content mt-2">
            <div class="education__date mr-2">
              <span class="education__start-date"
                >{{ education.StartDate }} -
              </span>
              <span class="education__end-date">{{ education.EndDate }} |</span>
              <span class="education__major">Major: {{ education.Major }}</span>
            </div>
          </div>
        </div>
        <div v-if="role !== 'User'" class="education__btns">
          <div v-if="educations.length > 1">
            <div
              v-if="index === 0"
              class="position-btn"
              @click.prevent="handleSwapCertificateOrder(index, index + 1)"
            >
              <v-icon x-small color="primary">south</v-icon>
            </div>
            <div
              v-else-if="index === educations.length - 1"
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
            <v-btn
              text
              color="primary"
              @click.prevent="editDialogEducation(education)"
            >
              Edit
            </v-btn>
          </div>
          <div class="content__delete-btn">
            <v-btn
              text
              color="#F44336"
              @click.prevent="openDialogDelete(education)"
            >
              Delete
            </v-btn>
          </div>
        </div>
      </div>
      <v-dialog v-model="dialog" width="800" persistent>
        <v-card>
          <v-card-title class="headline">
            {{ dialogTitle }} Education
          </v-card-title>
          <v-divider></v-divider>
          <v-form
            ref="submitForm"
            class="px-5 mt-5"
            @submit.prevent="handleSubmit()"
          >
            <v-text-field
              v-model="form.collegeName"
              :rules="nameRules"
              label="Name"
              outlined
              dense
            ></v-text-field>
            <div class="d-flex my-2">
              <v-select
                v-model="form.startDate"
                :items="years"
                label="From"
                dense
                outlined
                :rules="startDateRules"
                class="mr-6"
              ></v-select>
              <v-select
                v-model="form.endDate"
                :items="yearsForSelect"
                label="To"
                dense
                outlined
                :disabled="!form.startDate"
                :rules="endDateRules"
                @click="filterEndDate()"
              ></v-select>
            </div>
            <v-text-field
              v-model="form.major"
              :rules="majorRules"
              label="Major"
              outlined
              dense
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn width="100" @click="closeDialog()"> Cancel </v-btn>
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
            {{
              `Do you really want to delete " ${itemDelete.CollegeName} " ? This
            process cannot be undone.`
            }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="100" @click="dialogDelete = false">Cancel</v-btn>
            <v-btn
              color="error"
              width="100"
              @click="deleteEducation(itemDelete)"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog for swapping  -->
      <v-dialog v-model="dialogSwap" width="500">
        <v-card class="text-center">
          <v-card-text class="py-5 text-center title">
            Do you really want to move this Education {{ swappedTo }}?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="130" @click="dialogSwap = false">Cancel</v-btn>
            <v-btn color="error" width="130" @click="swapOrder()">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { generateDynamicYear, moveIndex } from '@/utils'
import {
  getEducationByPersonId,
  deleteEducation,
  updateEducation,
  createEducation,
  swapOrder,
} from '@/api/education'

export default {
  name: 'EditorEducation',
  data() {
    return {
      title: 'Education',
      dialog: false,
      dialogTitle: 'Add',
      personId: null,
      dialogDelete: false,
      dialogSwap: false,
      swappedFromIndex: null,
      swappedToIndex: null,
      itemDelete: {},
      form: {
        id: null,
        collegeName: null,
        major: null,
        startDate: null,
        endDate: null,
      },
      yearsForSelect: [],
      years: [],
      educations: [],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      majorRules: [
        (v) => !!v || 'Major is required',
        (v) =>
          (v && v.length <= 255) || 'Major must be less than 255 characters',
      ],
      startDateRules: [(v) => !!v || 'This field is required'],
      endDateRules: [(v) => !!v || 'This field is required'],
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
    educations() {
      this.$store.dispatch('resume/setListEducation', this.educations)
    },
  },
  created() {
    this.years = generateDynamicYear()
    this.yearsForSelect = generateDynamicYear()
    this.personId = +this.$route.params.id
    this.getEducationList(this.personId)
  },

  methods: {
    filterEndDate() {
      if (!this.form.startDate) this.yearsForSelect = this.years
      this.yearsForSelect = this.years.filter((y) => y >= this.form.startDate)
    },
    openDialogDelete(item) {
      this.itemDelete = item
      this.dialogDelete = true
    },
    handleSwapCertificateOrder(from, to) {
      this.dialogSwap = true
      this.swappedFromIndex = from
      this.swappedToIndex = to
    },
    swapOrder() {
      const [from, to] = [this.swappedFromIndex, this.swappedToIndex]
      const CurrentId = this.educations[from].Id
      const TurnedId = this.educations[to].Id
      this.dialogSwap = false
      return swapOrder({
        CurrentId,
        TurnedId,
      })
        .then(({ data }) => {
          moveIndex(this.educations, from, to)
          this.$store.dispatch('showSnackbar', {
            status: data.Result,
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
    deleteEducation(itemDelete) {
      return deleteEducation(itemDelete.Id)
        .then(({ data }) => {
          if (data.Result) {
            const index = this.educations.findIndex(
              (i) => i.Id === itemDelete.Id
            )
            this.educations.splice(index, 1)
          }
          this.$store.dispatch('showSnackbar', {
            status: data.Result,
            message: data.Message,
          })
          this.dialogDelete = false
        })
        .catch((error) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: error,
          })
        })
    },
    getEducationList(idPerson) {
      getEducationByPersonId(idPerson).then((res) => {
        this.educations = res.data.DataResult
      })
    },
    openDialog() {
      this.dialog = true
      this.dialogTitle = 'Add'
    },
    closeDialog() {
      this.dialog = false
    },
    editDialogEducation(education) {
      this.openDialog()
      this.dialogTitle = 'Save'
      this.form = {
        id: education.Id,
        collegeName: education.CollegeName,
        major: education.Major,
        startDate: education.StartDate,
        endDate: education.EndDate,
      }
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
        this.closeDialog()
        if (this.form.id) {
          const data = {
            Id: this.form.id,
            CollegeName: this.form.collegeName,
            Major: this.form.major,
            StartDate: this.form.startDate,
            EndDate: this.form.endDate,
          }
          return updateEducation(data)
            .then((res) => {
              const index = this.educations.findIndex((i) => i.Id === data.Id)
              this.educations.splice(index, 1, data)
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
        } else {
          const data = {
            CollegeName: this.form.collegeName,
            Major: this.form.major,
            StartDate: this.form.startDate,
            EndDate: this.form.endDate,
            PersonId: this.personId,
          }
          return createEducation(data)
            .then((res) => {
              this.$store.dispatch('showSnackbar', {
                status: res.data.Result,
                message: res.data.Message,
              })
              this.educations.push(res.data.DataResult)
            })
            .catch((error) => {
              this.$store.dispatch('showSnackbar', {
                status: false,
                message: error,
              })
            })
        }
      }
    },
    clearForm() {
      this.form = {
        collegeName: null,
        major: null,
        startDate: null,
        endDate: null,
      }
      this.$refs.submitForm.resetValidation()
    },
  },
}
</script>

<style lang="scss" scoped>
.education {
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
  .education {
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
