<template>
  <div class="edit-container mb-4">
    <div class="edit-container__header pa-5">
      <div class="d-flex justify-space-between align-center">
        <span
          class="d-inline-block edit-container__title font-weight-bold text-capitalize"
          >Project</span
        >
        <v-btn
          v-if="role !== 'User'"
          text
          color="primary"
          class="text-capitalize"
          @click="toggleDialogInsertOrUpdate()"
        >
          Add
        </v-btn>
      </div>
    </div>
    <div class="edit__container--content">
      <ul class="list__group">
        <li
          v-for="(item, index) in listProject"
          :key="index"
          class="list__item px-5 py-3"
        >
          <div>
            <div class="list__item--header word-break">
              <span class="font-weight-bold"
                >{{ item.Name }}({{ item.StartDate | formatDate }} -
                {{ item.EndDate | formatDate }})</span
              >
              <p class="mt-2">
                {{ item.Description }}
              </p>
            </div>
            <div class="list__item--content">
              <p class="mb-1">
                <span class="font-weight-bold">Role: </span>
                {{ item.Position }}
              </p>
              <p class="mb-1">
                <span class="font-weight-bold">Responsibilities: </span>
                {{ item.Responsibilities }}
              </p>
              <p class="mb-1">
                <span class="font-weight-bold">Team size: </span>
                {{ item.TeamSize }}
              </p>
              <p class="mb-1">
                <span class="font-weight-bold">Technologies: </span>
                {{ item.listTechnologies }}
              </p>
            </div>
          </div>
          <div v-if="role !== 'User'" class="list__item--action">
            <div v-if="listProject.length > 1" class="d-flex">
              <div
                v-if="index === 0"
                class="position-btn"
                @click.prevent="handleSwapCertificateOrder(index, index + 1)"
              >
                <v-icon x-small color="primary">south</v-icon>
              </div>

              <div
                v-else-if="index === listProject.length - 1"
                class="position-btn"
                @click.prevent="handleSwapCertificateOrder(index, index - 1)"
              >
                <v-icon x-small color="primary">north</v-icon>
              </div>
              <div v-else class="d-flex">
                <div
                  class="position-btn mr-2"
                  @click.prevent="handleSwapCertificateOrder(index, index - 1)"
                >
                  <v-icon x-small color="primary">north</v-icon>
                </div>
                <div
                  class="position-btn mr-2"
                  @click.prevent="handleSwapCertificateOrder(index, index + 1)"
                >
                  <v-icon x-small color="primary">south</v-icon>
                </div>
              </div>
            </div>
            <div v-if="role !== 'User'" class="d-flex--custom">
              <v-btn
                text
                class="ml-1 pr-1"
                color="primary"
                @click="toggleDialogInsertOrUpdate(item, index)"
              >
                EDIT
              </v-btn>
              <v-btn
                text
                color="error"
                @click="toggleDialogDelete(index, item.Id)"
              >
                DELETE
              </v-btn>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <v-dialog v-model="isDelete" width="500">
      <v-card class="text-center">
        <v-card-text class="py-5 text-center title">
          Do you really want to delete ? This process cannot be undone.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn width="130" @click="isDelete = false">Cancel</v-btn>
          <v-btn color="error" width="130" @click="handleDelete()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-form
          ref="submitForm"
          class="px-5 mt-5"
          @submit.prevent="handleSubmit()"
        >
          <!--input project name-->
          <v-text-field
            v-model="form.Name"
            :rules="nameRules"
            label="Name"
            outlined
            dense
          ></v-text-field>
          <!-- datepicker-->
          <div class="d-flex my-2">
            <v-menu
              ref="menu"
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.StartDate"
                  :rules="dateRules"
                  outlined
                  dense
                  label="From"
                  class="mr-6"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="form.StartDate"
                min="1950-01-01"
                @input="startDateMenu = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              ref="menu"
              v-model="endDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.EndDate"
                  :rules="dateRules"
                  outlined
                  dense
                  label="To"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="form.EndDate"
                :min="form.StartDate"
                @input="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </div>
          <!--input position-->
          <v-text-field
            v-model="form.Position"
            :rules="positionRules"
            label="Position"
            outlined
            dense
          ></v-text-field>
          <!--input description-->
          <v-text-field
            v-model="form.Description"
            :rules="descriptionRules"
            label="Description"
            outlined
            dense
          ></v-text-field>
          <!--input responsibilities-->
          <v-text-field
            v-model="form.Responsibilities"
            :rules="responsibilitiesRules"
            label="Responsibilities"
            outlined
            dense
          ></v-text-field>
          <!--input team size-->
          <v-text-field
            v-model="form.TeamSize"
            :rules="sizeRules"
            label="Team size"
            outlined
            dense
          ></v-text-field>
          <!--select autocomplete-->
          <v-autocomplete
            v-model="technology"
            chips
            :items="technologies"
            label="Technologies"
            item-text="Name"
            item-value="Id"
            :rules="[technologyRules]"
            multiple
            outlined
            dense
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="100" @click="toggleDialogInsertOrUpdate()">
              Cancel
            </v-btn>
            <v-btn
              width="100"
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- Dialog for swapping  -->
    <v-dialog v-model="dialogSwap" width="500">
      <v-card class="text-center">
        <v-card-text class="py-5 text-center title">
          Do you really want to move this Project {{ swappedTo }}?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn width="130" @click="dialogSwap = false">Cancel</v-btn>
          <v-btn color="error" width="130" @click="moveElement()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import {
  getProjectById,
  insertProject,
  insertListTechnology,
  updateProject,
  updateListTechnology,
  deleteProject,
  swapOrder,
} from '@/api/project'
export default {
  name: 'EditorProject',
  filters: {
    formatDate(date) {
      return moment(date).format('MMM YYYY')
    },
  },
  data() {
    return {
      loading: false,
      id: '',
      title: 'Project',
      isDelete: false,
      isCreate: false,
      indexItem: '',
      idItem: '',
      dialog: false,
      dialogSwap: false,
      swappedFromIndex: null,
      swappedToIndex: null,
      form: {
        Name: '',
        StartDate: '',
        EndDate: '',
        Position: '',
        Description: '',
        Responsibilities: '',
        TeamSize: '',
      },
      technology: [],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      dateRules: [(v) => !!v || 'Date is required'],
      positionRules: [
        (v) => !!v || 'Position is required',
        (v) =>
          /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(v) ||
          'Position is not valid',
      ],
      descriptionRules: [(v) => !!v || 'Description is required'],
      responsibilitiesRules: [(v) => !!v || 'Responsibilities is required'],
      sizeRules: [
        (v) => !!v || 'Team size is required',
        (v) => /^[0-9]*$/.test(v) || 'Team size is not number',
      ],
      startDateMenu: false,
      endDateMenu: false,
    }
  },
  computed: {
    ...mapGetters({
      listProject: 'resume/GET_LIST_PROJECT',
      technologies: 'resume/GET_LIST_TECHNOLOGY',
    }),
    swappedTo() {
      return this.swappedFromIndex > this.swappedToIndex ? 'up' : 'down'
    },
    role() {
      return this.$store.state.accountInfo.ROLE
    },
  },
  watch: {
    dialog(value) {
      if (value === false) {
        this.formReset()
      }
    },
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.getListProject()
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    handleSwapCertificateOrder(from, to) {
      this.dialogSwap = true
      this.swappedFromIndex = from
      this.swappedToIndex = to
    },
    moveElement() {
      const [from, to] = [this.swappedFromIndex, this.swappedToIndex]
      const CurrentId = this.listProject[from].Id
      const TurnedId = this.listProject[to].Id
      this.dialogSwap = false
      swapOrder({
        CurrentId,
        TurnedId,
      })
        .then(({ data }) => {
          this.$store.commit('resume/MOVE_ITEM_IN_LIST_PROJECT', {
            from,
            to,
          })
          this.notificationMessage(
            'success darken-4',
            data.Message || 'Swap successfully'
          )
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },
    insertProject() {
      this.form.personId = this.id
      insertProject(this.form)
        .then(({ data }) => {
          this.form.Id = data.DataResult.Id
          this.idItem = data.DataResult.Id
          this.insertTechnology()
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },
    convertTechnology() {
      const data = []
      this.technology.map((item) => {
        data.push({ TechnologyId: item, ProjectId: this.idItem })
      })
      return data
    },
    insertTechnology() {
      insertListTechnology(this.convertTechnology())
        .then(({ data }) => {
          this.loading = false
          this.form.Technologies = data.DataResult
          const Technologies = data.DataResult.map((value) => value.Name)
          this.form.listTechnologies = Technologies.join(', ')
          this.$store.commit('resume/INSERT_ITEM_IN_LIST_PROJECT', this.form)
          this.toggleDialogInsertOrUpdate()
          this.formReset()
          this.notificationMessage(
            'success darken-4',
            data.Message || 'insert project successfully'
          )
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },
    updateProject() {
      updateProject(this.idItem, this.form)
        .then(() => {
          this.updateTechnology()
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },
    updateTechnology() {
      updateListTechnology(this.idItem, this.convertTechnology())
        .then(({ data }) => {
          this.loading = false
          this.form.Technologies = data.DataResult
          const Technologies = data.DataResult.map((value) => value.Name)
          this.form.listTechnologies = Technologies.join(', ')
          this.listProject[this.indexItem] = { ...this.form }
          const newListProjects = [...this.listProject]
          this.$store.commit('resume/SET_LIST_PROJECT', newListProjects)
          this.toggleDialogInsertOrUpdate()
          this.formReset()
          this.notificationMessage(
            'success darken-4',
            data.Message || 'Edit project successfully'
          )
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },
    deleteProject() {
      deleteProject(this.idItem)
        .then(({ data }) => {
          this.$store.commit(
            'resume/DELETE_ITEM_IN_LIST_PROJECT',
            this.indexItem
          )
          this.notificationMessage(
            'success darken-4',
            data.Message || 'Delete project successfully'
          )
          this.toggleDialogDelete()
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },
    getListProject() {
      getProjectById(this.id)
        .then(({ data }) => {
          const formatData = data.DataResult
          formatData.map((item) => {
            item.StartDate = this.formatDate(item.StartDate)
            item.EndDate = this.formatDate(item.EndDate)
            const Technologies = []
            item.Technologies.map((value) => {
              Technologies.push(value.Name)
            })
            item.listTechnologies = Technologies.join(', ')
          })
          this.$store.commit('resume/SET_LIST_PROJECT', formatData)
        })
        .catch((error) => {
          this.notificationMessage('red darken-4', error || 'An error occurred')
        })
    },

    toggleDialogDelete(index, id) {
      if (id) {
        this.indexItem = index
        this.idItem = id
      }
      this.isDelete = !this.isDelete
    },
    toggleDialogInsertOrUpdate(value, index) {
      if (value) {
        this.title = 'Edit Project'
        const listIdTechnology = []
        value.Technologies.map((item) => {
          listIdTechnology.push(item.Id)
        })
        this.idItem = value.Id
        this.technology = listIdTechnology
        this.indexItem = index
        const cloneData = Object.assign({}, value)
        this.form.Name = cloneData.Name
        this.form.StartDate = cloneData.StartDate
        this.form.EndDate = cloneData.EndDate
        this.form.Position = cloneData.Position
        this.form.Description = cloneData.Description
        this.form.Responsibilities = cloneData.Responsibilities
        this.form.TeamSize = cloneData.TeamSize
        this.form.Id = cloneData.Id
      } else {
        this.title = 'Add Project'
        this.isCreate = true
      }
      this.dialog = !this.dialog
    },
    formReset() {
      this.loading = false
      this.isCreate = false
      this.indexItem = ''
      this.idItem = ''
      this.technology = []
      this.$refs.submitForm.reset()
    },
    notificationMessage(color, message, value = true) {
      this.$store.commit('SET_SNACKBAR', value)
      this.$store.commit('SET_SNACKBAR_COLOR', color)
      this.$store.commit('SET_NOTIFY_MESSAGE', message)
    },
    handleDelete() {
      this.deleteProject()
    },
    handleSubmit() {
      const valid = this.$refs.submitForm.validate()
      if (!valid) {
        this.notificationMessage('red darken-4', 'This field is not valid')
        return false
      }
      if (!this.checkCompareDate(this.form.StartDate, this.form.EndDate)) {
        this.notificationMessage(
          'red darken-4',
          'Invalid start date and end date'
        )
        return false
      }
      this.loading = true
      if (this.isCreate) {
        this.insertProject()
      } else {
        this.updateProject()
      }
    },
    removeTechnology(item) {
      const index = this.technology.findIndex((i) => i === item.Id)
      if (index >= 0) this.technology.splice(index, 1)
    },
    technologyRules(value) {
      if (Array.isArray(value) && value.length === 0) {
        return 'This field is required.'
      }
      return true
    },
    checkCompareDate(start, end) {
      const startDate = moment(start).valueOf()
      const endDate = moment(end).valueOf()
      return endDate > startDate
    },
  },
}
</script>

<style lang="scss" scoped>
.list__group {
  padding-left: 0;
  list-style: none;
  .list__item {
    display: flex;
    justify-content: space-between;
    &:not(:first-child) {
      padding-top: 10px;
      border-top: 0.5px solid #0000001f;
    }
    &--action {
      display: flex;
      align-items: center;
    }
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
.d-flex--custom {
  display: flex;
}
@media screen and (max-width: 37.5em) {
  .d-flex--custom {
    display: unset;
  }
  .list__item--action {
    flex-direction: column;
    justify-content: center;
  }
}
</style>
