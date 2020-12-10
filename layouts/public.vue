<template>
  <v-app class="primary">
    <v-snackbar
      v-model="snackbar"
      :color="this.$store.state.snackbarColor"
      :timeout="10000"
    >
      {{ this.$store.state.notifyMessage }}
      <v-btn text @click="closeSnackBar()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
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
