<template>
  <div class="edit-container mb-4">
    <div class="edit-container__header pa-5">
      <div class="d-flex justify-space-between align-center">
        <span
          class="d-inline-block edit-container__title font-weight-bold text-capitalize"
          >Profile</span
        >
        <v-btn
          v-if="role !== 'User'"
          text
          color="primary"
          class="text-capitalize"
          @click="dialog = true"
        >
          Edit
        </v-btn>
      </div>
    </div>
    <div class="profile pa-5">
      <div class="d-flex align-center">
        <v-avatar size="100" class="mr-7">
          <img :src="handleImgSrc(personInfo.Avatar)" />
        </v-avatar>
        <div class="profile__info text-left">
          <div class="text-h6 text-md-h5 font-weight-medium">
            {{ personInfo.FullName }}
          </div>
          <div>
            {{ personInfo.LocationName }}
          </div>
          <div>
            <span class="font-weight-normal">Phone:</span>
            <a
              v-if="role !== 'User'"
              :href="`tel:${personInfo.Phone}`"
              class="text__link"
              >{{ personInfo.Phone }}</a
            >
            <a
              v-else
              href="javascript:void(0)"
              class="text__link"
              personInfo.Phone
              >{{ personInfo.Phone | formatPhone }}</a
            >
          </div>
          <div>
            <span class="font-weight-normal">Email:</span>
            <a
              v-if="role !== 'User'"
              :href="`mailto:${personInfo.Email}`"
              class="text__link"
              >{{ personInfo.Email }}</a
            >
            <a v-else href="javascript:void(0)" class="text__link">{{
              personInfo.Email | formatEmail
            }}</a>
          </div>
        </div>
      </div>
    </div>
    <ProfilePopup
      v-if="dialog"
      :dialog="dialog"
      :person-info="personInfo"
      @change-dialog="handleCloseDialog"
      @new-info="handleNewInfo"
    />
  </div>
</template>

<script>
import ProfilePopup from '@/components/ProfilePopup'
import { LIST_OFFICE, handleImgSrc } from '@/utils'
import { getPersonById } from '@/api/person.js'
import moment from 'moment'

export default {
  name: 'EditorProfile',
  components: { ProfilePopup },
  filters: {
    formatPhone(value) {
      if (!value) return
      return value.toString().substring(0, 7) + '***'
    },
    formatEmail(value) {
      if (!value) return
      const index = value.toString().search('@')
      return '*'.repeat(index) + value.toString().substring(index)
    },
  },
  data() {
    return {
      dialog: false,
      personId: null,
      personInfo: {},
      listOffice: LIST_OFFICE,
      handleImgSrc,
    }
  },
  computed: {
    role() {
      return this.$store.state.accountInfo.ROLE
    },
  },
  watch: {
    personInfo() {
      this.$store.dispatch('resume/setPersonInfo', this.personInfo)
    },
  },
  created() {
    this.personId = this.$route.params.id
    this.getPersonInfo()
  },
  methods: {
    handleCloseDialog() {
      this.dialog = false
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    getPersonInfo() {
      getPersonById(this.personId).then(({ data }) => {
        this.personInfo = data.DataResult
        this.personInfo.YearOfBirth = this.formatDate(
          data.DataResult.YearOfBirth
        )
      })
    },
    handleNewInfo(newInfo) {
      newInfo.YearOfBirth = this.formatDate(newInfo.YearOfBirth)
      this.personInfo = newInfo
    },
  },
}
</script>

<style lang="scss" scoped>
.profile {
  overflow-x: hidden;
  .profile__info {
    word-break: break-all;
  }
}
</style>
