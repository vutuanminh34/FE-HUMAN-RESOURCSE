<template>
  <v-app>
    <page-nav-bar />
    <v-main>
      <v-snackbar
        v-model="snackbar"
        :color="this.$store.state.snackbarColor"
        :timeout="2000"
      >
        <span>{{ this.$store.state.notifyMessage }}</span>
        <v-btn text @click="closeSnackBar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <page-header />
      <v-container fluid>
        <Nuxt />
      </v-container>
      <page-footer />
    </v-main>
  </v-app>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import PageNavBar from '@/components/PageNavbar'
import PageFooter from '@/components/PageFooter'

// import NotificationList from '@/components/lists/NotificationList'
// import { ACCESS_ALL } from '@/utils'

export default {
  name: 'Default',
  components: {
    PageHeader,
    PageNavBar,
    PageFooter,
  },
  data() {
    return {}
  },
  middleware: 'authenticated',
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar
      },
      set(value) {
        this.$store.commit('SET_SNACKBAR', value)
      },
    },
  },
  methods: {
    closeSnackBar() {
      this.$store.commit('SET_SNACKBAR', false)
    },
  },
}
</script>

<style>
.v-snack__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0;
}
</style>
