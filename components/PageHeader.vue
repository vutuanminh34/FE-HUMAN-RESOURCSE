<template>
  <v-container fluid>
    <v-layout row class="align-center layout px-4 pt-4 app--page-header">
      <div class="page-header-left">
        <h3 class="pr-3">
          <nuxt-link
            :to="{ path: '/' }"
            class="text-decoration-none"
            style="color: #434343ed"
            >Home</nuxt-link
          >
        </h3>
      </div>
      <v-icon>home</v-icon>
      <v-breadcrumbs divider="-" :items="breadcrumbs" />
      <v-spacer />
      <div class="page-header-right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="reload()">
              <v-icon class="text--secondary" v-on="on"> refresh </v-icon>
            </v-btn>
          </template>
          <span>Refresh</span>
        </v-tooltip>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import menus from '@/api/menu'

export default {
  computed: {
    breadcrumbs() {
      if (this.$route.path === '/') {
        this.$store.commit('SET_PAGE_HEADER_TITLE', 'Dashboard')
        return [{ text: 'Dashboard' }]
      }
      const breadcrumbs = []
      menus.forEach((item) => {
        if (item.items) {
          const child = item.items.find((i) => {
            return this.$route.path.includes(i.name)
          })
          if (child) {
            breadcrumbs.push({ text: item.title })
            breadcrumbs.push({ text: child.title, disabled: true })
            this.$store.commit('SET_PAGE_HEADER_TITLE', child.title)
          }
        } else if (this.$route.path.includes(item.name)) {
          this.title = item.title
          breadcrumbs.push({ text: item.title })
          this.$store.commit('SET_PAGE_HEADER_TITLE', item.title)
        }
      })
      return breadcrumbs
    },
  },
  methods: {
    reload: () => {
      location.reload()
    },
  },
}
</script>
