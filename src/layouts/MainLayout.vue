<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
          <q-icon name="beach_access" color="green" size="28px" />
          <q-toolbar-title shrink class>Relax</q-toolbar-title>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            v-for="link in links1"
            :key="link.text"
            v-ripple
            clickable
            :active="link.page === currentRoute()"
            @click="goPage(link.page)"
          >
            <q-item-section avatar>
              <q-icon :color="link.page === currentRoute()? 'blue': 'grey'" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-for="link in links2"
            :key="link.text"
            v-ripple
            clickable
            :active="link.page === currentRoute()"
            @click="goPage(link.page)"
          >
            <q-item-section avatar>
              <q-icon :color="link.page === currentRoute()? 'blue': 'grey'" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-lg" />

          <q-item v-ripple clickable @click="logoutNow">
            <q-item-section avatar>
              <q-icon color="grey" name="exit_to_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { EventBus } from "../functions/event_bus.js";
import { fabYoutube } from "@quasar/extras/fontawesome-v5";

export default {
  name: "MainLayout",

  created() {
    if (!localStorage.getItem("access_token")) {
      this.$router.push("/");
    }
  },

  beforeCreate() {
    EventBus.$on("showNotify", (notification) => {
      this.showNotify(notification);
    });

    EventBus.$on("expiredToken", () => {
      this.logoutNow();
    });
  },

  data() {
    return {
      user: {
        name: localStorage.getItem("userName"),
      },
      leftDrawerOpen: false,
      links1: [{ icon: "home", text: "Inicio", page: "dashboard" }],
      links2: [
        {
          icon: "perm_contact_calendar",
          text: "Colaboradores",
          page: "colaborator",
        },
      ],
    };
  },

  created() {
    this.fabYoutube = fabYoutube;
  },

  methods: {
    currentRoute() {
      return this.$route.name;
    },

    logoutNow() {
      this.$q.localStorage.remove("access_token");
      this.$q.localStorage.remove("userId");
      this.$q.localStorage.remove("userName");
      this.$q.localStorage.remove("userProfile");
      this.$q.localStorage.remove("userDepartament");
      this.$router.push("/");
    },

    goPage(page) {
      this.$router.push(page);
    },

    showNotify(notification) {
      this.$q.notify({
        color: notification.color,
        textColor: "white",
        icon: notification.icon,
        message: notification.message,
      });
    },
  },
};
</script>

<style lang="stylus">
@font-face {
  font-family: customfont;
  src: url('../css/fonts/VeganStylePersonalUse-5Y58.ttf');
}

.page-father {
  background: #9053c7;
  background: -webkit-linear-gradient(-135deg, #c850c0, #4158d0);
  background: -o-linear-gradient(-135deg, #c850c0, #4158d0);
  background: -moz-linear-gradient(-135deg, #c850c0, #4158d0);
  background: linear-gradient(-135deg, #c850c0, #4158d0);
}

.main-menu {
  color: #6F6F6F;
  width: 15rem;
}

.link-menu {
  display: block;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  color: #6F6F6F;
}

.profile-menu {
  padding-top: 1rem;
  cursor: pointer;
}
</style>

<style lang="sass">
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
