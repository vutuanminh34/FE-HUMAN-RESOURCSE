<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      <div class="NotFound" align="center">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card height="400" color="transparent" flat>
                <div class="display-3 mt-5">Page not found.</div>
                <br />
                <div class="grey--text lighten-5">
                  The page you are trying to get to never existed in this
                  reality, or has migrated to a parallel universe.
                </div>
                <div class="paragraph-text mt-2">
                  <br />
                  <br />Try going back to home page and repeating your action.
                  Or, contact helpdesk for support.
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </h1>
    <h1 v-else class="d-flex justify-center">
      {{ otherError }}
    </h1>
    <div class="d-flex justify-center">
      <v-btn color="primary" elevation="2"
        ><NuxtLink class="link" to="/"> Home page </NuxtLink></v-btn
      >
    </div>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
.paragraph-text {
  font-size: 18px;
}
.link {
  color: white;
  text-decoration: none;
}
</style>
