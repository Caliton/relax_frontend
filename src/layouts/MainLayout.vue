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
            v-for="link in modulesComputed"
            :key="link.text"
            v-ripple
            clickable
            :active="link.page === currentRoute()"
            @click="goPage(link.page)"
          >
            <q-item-section avatar>
              <q-icon
                :color="link.page === currentRoute() ? '#4CAF50' : 'grey'"
                :name="link.icon"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-lg" />

          <q-item
            v-ripple
            clickable
            @click="
              () => {
                EventBus.$emit('on-show-news')
              }
            "
          >
            <q-item-section avatar>
              <q-icon color="grey" name="eva-info-outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Informação</q-item-label>
            </q-item-section>
          </q-item>

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
    <di-news />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { EventBus } from '../functions/event_bus.js'
import DiNews from '../components/layout/DiNews.vue'

export default {
  name: 'MainLayout',

  components: {
    'di-news': DiNews
  },

  beforeCreate () {
    if (!localStorage.getItem('token')) {
      this.$router.push({ name: 'login' })
    }

    EventBus.$on('showNotify', notification => {
      this.showNotify(notification)
    })

    EventBus.$on('expiredToken', () => {
      this.logoutNow()
    })
  },

  data () {
    return {
      EventBus: EventBus,
      user: {
        name: localStorage.getItem('userName')
      },
      leftDrawerOpen: false,
      modules: [
        // { icon: 'home', text: 'Inicio', page: 'dashboard' },
        {
          icon: 'person',
          text: 'Colaboradores',
          page: 'colaborator',
          canView: this.getPermissions('colaborator')
        },
        {
          icon: 'far fa-address-book',
          text: 'Agendamentos',
          page: 'reserva',
          canView: this.getPermissions('reserva')
        },
        {
          icon: 'eva-loader-outline',
          text: 'Solicitar Férias',
          page: 'vacationrequest',
          canView: this.getPermissions('vacationrequest')
        },
        {
          icon: 'eva-pantone-outline',
          text: 'Configurações',
          page: 'settings',
          canView: this.getPermissions('settings')
        }
      ]
    }
  },

  computed: {
    modulesComputed: function () {
      return this.modules.filter(a => a.canView)
    }
  },

  methods: {
    getPermissions (module) {
      const modulesCollaborator = ['vacationrequest']

      const modulesSupervisor = ['colaborator', 'reserva', 'vacationrequest']

      const modulesAdmin = [
        'vacationrequest',
        'settings',
        'colaborator',
        'reserva'
      ]

      const role = localStorage.getItem('user_role')
      let permissions = false
      switch (role) {
        case 'hr':
        case 'admin':
          permissions = modulesAdmin.includes(module)
          break

        case 'manager':
          permissions = modulesSupervisor.includes(module)
          break
        case 'collaborator':
          permissions = modulesCollaborator.includes(module)
          break
        default:
          permissions = false
          break
      }

      return permissions
    },

    currentRoute () {
      return this.$route.name
    },

    logoutNow () {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_role')
      this.$router.push({ name: 'login' })
    },

    goPage (page) {
      this.$router.push(page)
    },

    showNotify (notification) {
      this.$q.notify({
        color: notification.color,
        textColor: 'white',
        icon: notification.icon,
        message: notification.message
      })
    }
  }
}
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

<style lang="stylus">
@media (max-width: 1368px) {
  body {
    zoom: 80%;
    -moz-transform: scale(0.8);
    -moz-transform-origin: 0 0;
  }

  .min-height {
    min-height: 768px !important;
  }
}

@media (min-width: 1900px) {
  body {
    zoom: 100%;
  }
}
</style>
