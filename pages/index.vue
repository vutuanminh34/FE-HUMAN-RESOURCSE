<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <div id="dashboard" style="height: 77vh">
        <v-alert
          icon="mdi-shield-lock-outline"
          text
          color="primary"
          type="info"
        >
          Welcome to Admin Human Resource Hybrid Technologies
        </v-alert>
      </div>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  head() {
    return {
      title: 'Dashboard',
    }
  },
}
</script>
