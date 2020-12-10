<template>
  <div class="page-navbar">
    <v-app-bar :clipped-left="clipped" :fixed="fixed" app color="primary" dark>
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />
      <v-toolbar-title>Hybrid Technologies CMS</v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
        origin="center center"
        :nudge-right="140"
        :nudge-bottom="14"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn slot="activator" icon v-bind="attrs" v-on="on">
            <v-avatar color="primary lighten-1" size="30">
              <span class="white--text">{{
                userName.charAt(0).toUpperCase()
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold text-center">{{
                userName
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-center">{{
                fullName
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(item, index) in accountMenus"
            :key="index"
            :to="!item.href ? { name: item.name } : null"
            :href="item.href"
            ripple
            :disabled="item.disabled"
            :target="item.target"
            :class="item.class"
            rel="noopener"
            @click="item.click"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title
              :class="{ 'font-weight-bold': item.name === 'fullName' }"
              >{{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
        <v-menu>
          <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-menu>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      :fixed="fixed"
      app
    >
      <v-toolbar color="light-blue lighten-5">
        <img src="../static/logo.svg" height="60" alt="human resource App" />
      </v-toolbar>
      <v-list dense expand>
        <template v-for="(item, i) in getMenu">
          <!--group with subitems-->
          <v-list-group
            v-if="item.items"
            :key="item.name"
            :group="item.group"
            :prepend-icon="item.icon"
            no-action="no-action"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-for="(subItem, iItem) in item.items">
              <!--sub group-->
              <v-list-group
                v-if="subItem.items"
                :key="subItem.name"
                :group="subItem.group"
                sub-group="sub-group"
              >
                <v-list-item slot="activator" ripple="ripple">
                  <v-list-item-content>
                    <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="(grand, index) in subItem.children"
                  :key="index"
                  :to="grand.href ? grand.href : null"
                  ripple
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ grand.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              <!--child item-->
              <v-list-item
                v-else
                :key="iItem"
                :to="subItem.href ? subItem.href : null"
                :disabled="subItem.disabled"
                :target="subItem.target"
                ripple
              >
                <v-list-item-content>
                  <v-list-item-title
                    ><span>{{ subItem.title }}</span></v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action v-if="subItem.action">
                  <v-icon :class="[subItem.actionClass || 'success--text']">
                    {{ subItem.action }}
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list-group>
          <v-subheader v-else-if="item.header" :key="i">
            {{ item.header }}
          </v-subheader>
          <v-divider v-else-if="item.divider" :key="i" />
          <!--top-level link-->
          <v-list-item
            v-else
            :key="item.name"
            :to="item.href ? item.href : null"
            ripple
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="item.subAction">
              <v-icon class="success--text">
                {{ item.subAction }}
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import menus from '@/api/menu'

export default {
  data() {
    return {
      miniVariant: false,
      clipped: false,
      fixed: false,
      right: true,
      drawer: true,
      rightDrawer: false,
      accountMenus: [
        {
          icon: 'mdi-account',
          name: 'profile',
          title: 'Account',
          class: 'account-menu',
          click: (e) => {
            this.$router.push('/profile')
          },
        },
        {
          icon: 'mdi-logout',
          href: '',
          title: 'Log out',
          class: 'account-menu',
          click: this.logout,
        },
      ],
    }
  },
  computed: {
    getMenu() {
      const newMenu = []
      menus.map((item) => {
        if (item.header) {
          newMenu.push({ ...item })
        } else if (
          item.permissions.includes(this.$store.state.accountInfo.ROLE)
        )
          newMenu.push({ ...item })
      })
      return newMenu
    },
    userName() {
      const accountInfo = this.$store.state.accountInfo
      return accountInfo ? accountInfo.USER_NAME : 'Hybrid'
    },
    fullName() {
      const accountInfo = this.$store.state.accountInfo
      return accountInfo ? accountInfo.FULL_NAME : 'Hybrid'
    },
  },
  methods: {
    toggleRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    },
    logout() {
      return this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.account-menu:last-child:before {
  background-color: transparent;
}
</style>
