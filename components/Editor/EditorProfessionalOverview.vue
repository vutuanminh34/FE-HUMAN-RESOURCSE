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
          Edit
        </v-btn>
      </div>
    </div>
    <div class="edit-container__content pa-5">
      <div class="personal-overview">
        <p>{{ personInfo.Description }}</p>
      </div>
    </div>

    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-divider></v-divider
        ><v-form
          ref="submitForm"
          class="px-5 py-4"
          @submit.prevent="handleSubmit()"
        >
          <v-textarea
            v-model="description"
            outlined
            name="description"
            required
            placeholder="Description"
          />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="100" @click="closeDialog()"> Cancel </v-btn>
            <v-btn width="100" type="submit" color="primary"> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { updateDescription } from '@/api/person.js'
export default {
  name: 'EditorProfessionalOverview',
  data() {
    return {
      title: 'Professional Overview',
      dialog: false,
      description: '',
    }
  },
  computed: {
    personInfo() {
      return this.$store.getters['resume/GET_PERSON_INFO']
    },
    role() {
      return this.$store.state.accountInfo.ROLE
    },
  },
  watch: {
    dialog() {
      if (this.dialog === false) {
        this.clearForm()
      }
    },
    personInfo() {
      this.description = this.personInfo.Description
    },
  },
  methods: {
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    clearForm() {
      this.description = this.personInfo.Description
      this.$refs.submitForm.resetValidation()
    },
    handleSubmit() {
      updateDescription(this.$route.params.id, {
        Description: this.description,
      })
        .then(({ data }) => {
          if (data.Result) {
            this.$store.dispatch('resume/setPersonInfo', data.DataResult)
          }
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
    },
  },
}
</script>

<style lang="scss"></style>
