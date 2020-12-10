<template>
  <div class="edit-container mb-4">
    <div class="edit-container__header pa-5">
      <div class="d-flex justify-space-between align-center">
        <span
          class="d-inline-block edit-container__title font-weight-bold text-capitalize"
          >Work History</span
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
        v-for="(workHistory, index) of workHistoryList"
        :key="workHistory.id"
        class="workHistory px-5 py-3"
      >
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex flex-column word-break">
            <div class="font-weight-bold">
              <span>{{ workHistory.Position }}</span>
            </div>
            <div class="mt-2 d-flex workHistory__info">
              <div>
                <span>{{ workHistory.CompanyName }} </span>
              </div>
              <div class="workHistory__date">
                <span
                  >(
                  {{ workHistory.StartDate ? workHistory.StartDate : '' }}
                  {{ workHistory.StartDate ? '-' : '' }}
                  {{ workHistory.EndDate }} )</span
                >
              </div>
            </div>
          </div>
          <div v-if="role !== 'User'" class="workHistory__btns">
            <div v-if="workHistoryList.length > 1" class="d-flex align-center">
              <div
                v-if="index === 0"
                class="position-btn"
                @click.prevent="handleSwapCertificateOrder(index, index + 1)"
              >
                <v-icon x-small color="primary">south</v-icon>
              </div>
              <div
                v-else-if="index === workHistoryList.length - 1"
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
            <div class="content__edit-btn">
              <v-btn text color="primary" @click="openUpdateForm(workHistory)">
                Edit
              </v-btn>
            </div>
            <div class="content__delete-btn">
              <v-btn
                text
                color="#F44336"
                @click="openDeleteForm(workHistory, index)"
              >
                Delete
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- create || update dialog -->
      <v-dialog v-model="dialog" width="800" persistent>
        <v-card>
          <v-card-title class="headline">
            {{ workHistoryForm.Id ? 'Edit' : 'Add' }} Work History
          </v-card-title>
          <v-divider></v-divider>
          <v-form
            ref="submitForm"
            class="px-5 py-4"
            @submit.prevent="handleSubmit()"
          >
            <v-text-field
              v-model.trim="workHistoryForm.Position"
              :rules="positionRules"
              label="Position"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model.trim="workHistoryForm.CompanyName"
              :rules="companyRules"
              label="Commpany"
              outlined
              dense
            ></v-text-field>
            <v-row class="justify-space-between">
              <v-col cols="6">
                <v-menu
                  ref="startDateRef"
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="workHistoryForm.StartDate"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="workHistoryForm.StartDate"
                      label="Start date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      :rules="startDateRules"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="workHistoryForm.StartDate"
                    type="month"
                    no-title
                    scrollable
                    @change="saveStartDate($event)"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="endDateRef"
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="workHistoryForm.EndDate"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="workHistoryForm.EndDate"
                      label="End date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      :rules="endDateRules"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="workHistoryForm.EndDate"
                    type="month"
                    no-title
                    scrollable
                    :min="workHistoryForm.StartDate"
                    @change="saveEndDate($event)"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn width="100" @click="closeDialog()"> Cancel </v-btn>
              <v-btn width="100" type="submit" color="primary">
                {{ workHistoryForm.Id ? 'Save' : 'Add' }}
              </v-btn>
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
      <!-- Dialog for swapping  -->
      <v-dialog v-model="dialogSwap" width="500">
        <v-card class="text-center">
          <v-card-text class="py-5 text-center title">
            Do you really want to move this Work History {{ swappedTo }}?
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
import {
  getWorkHistoryByPersonId,
  deleteWorkHistory,
  createWorkHistory,
  updateWorkHistory,
  swapOrder,
} from '@/api/work-history.js'
import { moveIndex } from '@/utils/index'

export default {
  name: 'EditorWorkHistory',
  data() {
    return {
      dialog: false,
      dialogSwap: false,
      swappedFromIndex: null,
      swappedToIndex: null,
      dialogDelete: false,
      personId: null,
      workHistoryForm: {
        Position: null,
        CompanyName: null,
        StartDate: null,
        EndDate: null,
      },
      startDateMenu: false,
      endDateMenu: false,
      years: [],
      workHistoryList: [],
      workHistoryDelete: null,
      positionRules: [
        (v) => !!v || 'This field is required',
        (v) =>
          (!!v && v.length <= 255) ||
          'This field must be less than 255 characters',
      ],
      companyRules: [
        (v) => !!v || 'This field is required',
        (v) =>
          (!!v && v.length <= 255) ||
          'This field must be less than 255 characters',
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
    workHistoryList() {
      this.$store.dispatch('resume/setListWorkHistory', this.workHistoryList)
    },
  },
  created() {
    this.personId = +this.$route.params.id
    this.getWorkHistoryList()
  },
  methods: {
    getWorkHistoryList() {
      getWorkHistoryByPersonId(this.personId).then((res) => {
        this.workHistoryList = res.data.DataResult
      })
    },
    formatDate(date) {
      return date.split('/').reverse().join('-')
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },

    openUpdateForm(workHistory) {
      this.openDialog()
      this.workHistoryForm = { ...workHistory }
      this.workHistoryForm.StartDate = this.formatDate(workHistory.StartDate)
      this.workHistoryForm.EndDate = this.formatDate(workHistory.EndDate)
    },
    openDeleteForm(workHistory, index) {
      this.dialogDelete = true
      this.workHistoryDelete = workHistory
      this.workHistoryDelete.Index = index
    },
    handleDelete() {
      deleteWorkHistory(this.workHistoryDelete.Id)
        .then(({ data }) => {
          this.workHistoryList.splice(this.workHistoryDelete.Index, 1)
          this.$store.dispatch('showSnackbar', {
            status: data.Result,
            message: data.Message,
          })
          this.dialogDelete = false
        })
        .catch((err) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
    },
    saveStartDate(date) {
      this.$refs.startDateRef.save(date)
    },
    saveEndDate(date) {
      this.$refs.endDateRef.save(date)
    },
    handleSubmit() {
      const workHistory = this.workHistoryForm
      const valid = this.$refs.submitForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'This field is not valid',
        })
        return false
      }
      if (this.workHistoryForm.StartDate > this.workHistoryForm.EndDate) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'Start date must come before End date',
        })
        return false
      } else if (!this.workHistoryForm.Id) {
        workHistory.PersonId = this.personId
        createWorkHistory(workHistory)
          .then(({ data }) => {
            this.workHistoryList.push(data.DataResult)
            this.$store.dispatch('showSnackbar', {
              status: data.Result,
              message: data.Message,
            })
            this.closeDialog()
          })
          .catch((err) => {
            this.$store.dispatch('showSnackbar', {
              status: false,
              message: err,
            })
          })
      } else {
        updateWorkHistory(workHistory.Id, workHistory)
          .then(({ data }) => {
            const index = this.workHistoryList.findIndex(
              (i) => i.Id === workHistory.Id
            )
            this.workHistoryList.splice(index, 1, workHistory)
            this.$store.dispatch('showSnackbar', {
              status: data.Result,
              message: data.Message,
            })
            this.closeDialog()
          })
          .catch((err) => {
            this.$store.dispatch('showSnackbar', {
              status: false,
              message: err,
            })
          })
      }
    },
    clearForm() {
      this.workHistoryForm = {
        Id: null,
      }
      this.$refs.submitForm.resetValidation()
    },
    handleSwapCertificateOrder(from, to) {
      this.dialogSwap = true
      this.swappedFromIndex = from
      this.swappedToIndex = to
    },
    swapOrder() {
      const [from, to] = [this.swappedFromIndex, this.swappedToIndex]
      const CurrentId = this.workHistoryList[from].Id
      const TurnedId = this.workHistoryList[to].Id
      this.dialogSwap = false
      return swapOrder({
        CurrentId,
        TurnedId,
      })
        .then(({ data }) => {
          moveIndex(this.workHistoryList, from, to)
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
  },
}
</script>

<style lang="scss" scoped>
.workHistory {
  border-bottom: 1px solid #eeeeee;
  &__btns {
    display: flex;
    align-items: center;
  }
  &__date {
    margin-left: 5px;
  }
}

.position-btn {
  text-align: center;
  width: 25px;
  height: 25px;
  border: 1px solid #1867c0;
  border-radius: 5px;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #1867c0;
    i {
      color: #fff !important;
    }
  }
}

.content__edit-btn {
  margin-left: 12px;
}

@media screen and (max-width: 37.5em) {
  .workHistory {
    &__content {
      display: flex;
    }
    &__btns,
    &__info {
      flex-direction: column;
    }
    &__date {
      margin-left: 0;
    }
  }

  .content {
    &__edit-btn {
      margin: 0.5rem 0;
    }
  }
}
</style>
