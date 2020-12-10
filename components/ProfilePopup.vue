<template>
  <v-dialog v-if="dialogProp" v-model="dialogProp" width="800" persistent>
    <v-card>
      <v-card-title
        >{{ personInfoProp.Id ? 'Edit' : 'Create' }} Person
      </v-card-title>
      <v-divider></v-divider>
      <v-form
        ref="form_profile"
        enctype="multipart/form-data"
        class="px-8 py-4"
        @submit.prevent="onSubmit()"
      >
        <div class="d-flex mb-4">
          <v-avatar size="100">
            <img
              :src="personInfoProp.Avatar"
              alt="Avatar"
              class="hover__zoom"
              width="120"
              @click="chooseImage()"
            />
          </v-avatar>
          <div class="ml-5 d-flex flex-column justify-center">
            <label class="text__link mb-2" @click="chooseImage()"
              >Change Avatar</label
            >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="changeAvatar($event)"
            />
            <label class="text__link" @click="resetAvatar">Reset</label>
          </div>
        </div>
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-text-field
              v-model.trim="personInfoProp.FullName"
              label="Name"
              outlined
              :rules="nameRules"
              dense
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-select
              v-model="personInfoProp.Location"
              :items="itemsOffice"
              item-text="name"
              item-value="id"
              :rules="[(v) => v !== null || 'This field is required']"
              label="Office"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-select
              v-model="personInfoProp.Gender"
              :items="itemsGender"
              item-text="name"
              item-value="id"
              :rules="[(v) => v !== null || 'This field is required']"
              label="Gender"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-menu
              ref="menu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="personInfoProp.YearOfBirth"
                  outlined
                  dense
                  label="Year of Birth"
                  readonly
                  v-bind="attrs"
                  :rules="yearOfBirthRules"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="personInfoProp.YearOfBirth"
                :max="maxDOB"
                @change="saveDate()"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-text-field
              v-model.trim="personInfoProp.Email"
              label="Email"
              :rules="emailRules"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-text-field
              v-model.trim="personInfoProp.Phone"
              label="Phone"
              :rules="phoneRules"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="white" width="120" @click="closeDialog()">Cancel</v-btn>
          <v-btn
            width="120"
            color="primary"
            type="submit"
            :disabled="loading"
            :loading="loading"
            >Save</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { LIST_OFFICE, LIST_GENDER, handleImgSrc } from '@/utils'
import { createPerson, updatePerson } from '@/api/person.js'
import moment from 'moment'

export default {
  name: 'ProfilePopup',
  props: {
    dialog: Boolean,
    personInfo: {
      type: Object,
      default() {
        return {
          Id: null,
          FullName: null,
          Email: null,
          Location: null,
          Avatar: null,
          YearOfBirth: null,
          Gender: null,
          Phone: null,
        }
      },
    },
  },
  data() {
    return {
      itemsOffice: LIST_OFFICE,
      itemsGender: LIST_GENDER,
      dateMenu: false,
      emailRules: [
        (v) => !!v || 'This field is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail is not valid',
      ],
      nameRules: [
        (v) => !!v || 'This field is required',
        (v) =>
          (!!v && v.length <= 255) ||
          'This field must be less than 255 characters',
      ],
      yearOfBirthRules: [(v) => !!v || 'This field is required'],
      phoneRules: [
        (v) => !!v || 'This field is required',
        (v) =>
          (v && v.length === 10) || 'Phone number must be equal 10 characters',
      ],
      selectedFile: null,
      personInfoProp: { ...this.personInfo },
      loading: false,
    }
  },
  computed: {
    dialogProp: {
      get() {
        return this.dialog
      },
      set(newValue) {
        if (!newValue) {
          this.$emit('change-dialog', false)
        }
      },
    },
    maxDOB() {
      return moment(new Date(), 'YYYY-MM-DD').subtract(18, 'years').format() // current date minus 18 year
    },
  },
  watch: {
    dateMenu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  created() {
    this.personInfoProp.Avatar = handleImgSrc(this.personInfoProp.Avatar)
  },
  methods: {
    closeDialog() {
      this.dialogProp = false
    },
    saveDate(date) {
      this.$refs.menu.save(date)
    },
    chooseImage() {
      this.$refs.fileInput.click()
    },
    changeAvatar(event) {
      this.selectedFile = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(this.selectedFile)
      reader.onload = () => {
        this.$set(this.personInfoProp, 'Avatar', reader.result)
      }
    },
    resetAvatar() {
      this.$set(
        this.personInfoProp,
        'Avatar',
        this.$store.getters.getAvatarDefault
      )
      this.selectedFile = 'reset'
    },
    onSubmit() {
      this.loading = true
      const valid = this.$refs.form_profile.validate()
      if (!valid) {
        this.$store.dispatch('showSnackbar', {
          status: false,
          message: 'This field is not valid',
        })
        return false
      }
      const formData = new FormData()
      const {
        FullName,
        Location,
        Gender,
        YearOfBirth,
        Email,
        Phone,
      } = this.personInfoProp
      formData.append('FullName', FullName)
      formData.append('Location', Location)
      formData.append('Gender', Gender)
      formData.append('YearOfBirth', YearOfBirth)
      formData.append('Email', Email)
      formData.append('Phone', Phone)
      if (this.selectedFile === 'reset')
        formData.append('file', this.selectedFile)
      else formData.append('files', this.selectedFile)

      const formAction = this.personInfoProp.Id
        ? updatePerson(this.personInfoProp.Id, formData)
        : createPerson(formData)
      formAction
        .then(({ data }) => {
          this.loading = false
          this.personInfoProp.Id = data.DataResult.Id
          this.personInfoProp.StaffId = data.DataResult.StaffId
          if (this.selectedFile === null)
            this.personInfoProp.Avatar = this.personInfo.Avatar
          this.$emit('new-info', this.personInfoProp)
          this.$store.dispatch('showSnackbar', {
            status: true,
            message: 'Successfully!',
          })
          this.closeDialog()
        })
        .catch((err) => {
          this.$store.dispatch('showSnackbar', {
            status: false,
            message: err,
          })
        })
    },
  },
}
</script>
