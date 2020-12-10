<template>
  <div class="edit-container mb-4">
    <div class="edit-container__header pa-5">
      <div class="d-flex justify-space-between align-center">
        <span
          class="d-inline-block edit-container__title font-weight-bold text-capitalize"
          >Skills</span
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

        <!-- create || update dialog -->
        <v-dialog v-model="dialog" max-width="800" persistent>
          <v-card>
            <v-card-title class="headline">
              {{ skillForm.Id ? 'Edit' : 'Add' }} Skills
            </v-card-title>
            <v-divider></v-divider
            ><v-form
              ref="submitForm"
              class="px-5 py-4"
              @submit.prevent="handleSubmit"
            >
              <v-select
                v-model="skillForm.PersonCategoryId"
                :items="categoryList"
                item-text="Name"
                item-value="Id"
                :rules="[(v) => !!v || 'This field is required']"
                label="Category"
                :disabled="!!skillForm.Id"
                outlined
                dense
                @change="getTechnologyByCategoryId(skillForm.PersonCategoryId)"
              ></v-select>
              <v-autocomplete
                v-model="skillForm.Technologies"
                :items="technologyByCategoryId"
                chips
                label="Technologies"
                item-text="Name"
                item-value="Id"
                :rules="technologyRules"
                multiple
                outlined
                dense
                :disabled="!skillForm.PersonCategoryId"
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
                <v-btn width="100" @click="closeDialog()"> CANCEL </v-btn>
                <v-btn type="submit" width="100" color="primary darken-1">
                  {{ skillForm.Id ? 'SAVE' : 'ADD' }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </div>
    <div>
      <ul class="skill__list">
        <li
          v-for="(skill, index) in skillList"
          :key="skill.Id"
          class="skill__item px-5 py-3"
        >
          <div class="d-flex flex-column">
            <span class="font-weight-bold">{{ skill.Name }}</span>
            <span class="mt-2">
              {{ formatTechName(skill) }}
            </span>
          </div>
          <div v-if="role !== 'User'" class="skill__btns">
            <div v-if="skillList.length > 1" class="d-flex align-center">
              <div
                v-if="index === 0"
                class="position-btn"
                @click.prevent="handleSwapCertificateOrder(index, index + 1)"
              >
                <v-icon x-small color="primary">south</v-icon>
              </div>
              <div
                v-else-if="index === skillList.length - 1"
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
              <v-btn text color="primary" @click="openUpdateForm(skill)">
                Edit
              </v-btn>
            </div>
            <div class="content__delete-btn">
              <v-btn text color="#F44336" @click="openDeleteForm(skill)">
                Delete
              </v-btn>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- delete dialog -->
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
          Do you really want to move this Skill {{ swappedTo }}?
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
</template>

<script>
import {
  getSkillByPersonId,
  createSkill,
  updateSkill,
  deleteSkill,
  swapOrder,
} from '@/api/skill.js'
import { getCategoryList } from '@/api/category.js'
import { getTechnologyList } from '@/api/technology.js'
import { moveIndex } from '@/utils/index'

export default {
  name: 'EditorSkill',
  components: {},
  data() {
    return {
      dialog: false,
      dialogSwap: false,
      swappedFromIndex: null,
      swappedToIndex: null,
      dialogDelete: false,
      personId: 0,
      skillList: [],
      technologyByCategoryId: [],
      categoryList: [],
      technologyList: [],
      skillForm: {
        PersonCategoryId: null,
        Technologies: [],
      },
      skillId: null,
      technologyRules: [
        (v) =>
          (Array.isArray(v) && v.length !== 0) || 'This field is required.',
      ],
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
    skillList() {
      this.$store.dispatch('resume/setListSkill', this.skillList)
    },
  },
  created() {
    this.personId = +this.$route.params.id
    this.getSkillList()
    this.getCategoryList()
    this.getTechnologyList()
  },
  methods: {
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    openDeleteForm(skill) {
      this.skillId = skill.PersonCategoryId
      this.dialogDelete = true
    },
    getSkillList() {
      getSkillByPersonId(this.personId).then((res) => {
        this.skillList = res.data.DataResult
      })
    },
    getCategoryList() {
      getCategoryList().then((res) => {
        this.categoryList = res.data.DataResult
      })
    },
    getTechnologyList() {
      getTechnologyList().then((res) => {
        this.technologyList = res.data.DataResult
      })
    },
    openUpdateForm(skill) {
      this.skillId = skill.PersonCategoryId
      this.getTechnologyByCategoryId(skill.Id)
      this.openDialog()
      this.skillForm = {
        Id: skill.Id, // categoryId
        Technologies: skill.Technologies.map((i) => i.Id),
        PersonCategoryId: { Id: skill.Id, Name: skill.Name },
      }
    },
    getTechnologyByCategoryId(categoryId) {
      this.technologyByCategoryId = this.skillForm.Technologies = []
      return (this.technologyByCategoryId = this.technologyList.filter(
        (i) => i.CategoryId === categoryId
      ))
    },
    handleDelete() {
      deleteSkill(this.skillId)
        .then(({ data }) => {
          if (data?.Result) {
            const index = this.skillList.findIndex(
              (i) => i.PersonCategoryId === this.skillId
            )
            this.skillList.splice(index, 1)
          }
          this.$store.dispatch('showSnackbar', {
            status: data.Result,
            message: data.Message,
          })
        })
        .catch((err) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
      this.dialogDelete = false
    },
    removeTechnology(item) {
      const index = this.skillForm.Technologies.findIndex((i) => i === item.Id)
      if (index >= 0) this.skillForm.Technologies.splice(index, 1)
    },
    handleSubmit() {
      const valid = this.$refs.submitForm.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'This field is not valid',
        })
        return false
      } else {
        const newSkill = {
          PersonId: this.personId,
          CategoryId: this.skillForm.PersonCategoryId,
          TechnologyId: this.skillForm.Technologies,
        }
        if (!this.skillForm.Id) {
          createSkill(newSkill)
            .then(({ data }) => {
              this.skillList.unshift(data.DataResult)
              this.$store.dispatch('showSnackbar', {
                status: data.Result,
                message: data.Message,
              })
            })
            .catch((err) => {
              this.$store.dispatch('showSnackbar', {
                status: false,
                message: err,
              })
            })
        } else {
          newSkill.CategoryId = this.skillForm.PersonCategoryId.Id
          updateSkill(this.skillId, newSkill)
            .then(({ data }) => {
              const index = this.skillList.findIndex(
                (i) => i.PersonCategoryId === this.skillId
              )
              this.skillList.splice(index, 1, data.DataResult)
              this.$store.dispatch('showSnackbar', {
                status: data.Result,
                message: data.Message,
              })
            })
            .catch((err) => {
              this.$store.dispatch('showSnackbar', {
                status: false,
                message: err,
              })
            })
        }
        this.closeDialog()
      }
    },
    clearForm() {
      this.skillForm = {
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
      const CurrentId = this.skillList[from].PersonCategoryId
      const TurnedId = this.skillList[to].PersonCategoryId
      this.dialogSwap = false
      return swapOrder({
        CurrentId,
        TurnedId,
      })
        .then(({ data }) => {
          moveIndex(this.skillList, from, to)
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
    formatTechName(skill) {
      return skill.Technologies.map((i) => i.Name).join(', ')
    },
  },
}
</script>

<style lang="scss" scoped>
.skill {
  &__list {
    padding-left: 0;
    list-style: none;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    &:not(:first-child) {
      padding-top: 10px;
      border-top: 0.5px solid #0000001f;
    }
  }
  &__btns {
    display: flex;
    align-items: center;
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
  .skill {
    &__content {
      display: flex;
    }
    &__btns {
      flex-direction: column;
    }
  }

  .content {
    &__edit-btn {
      margin: 0.5rem 0;
    }
  }
}
</style>
