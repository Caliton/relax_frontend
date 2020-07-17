<template>
  <q-layout view="lHh Lpr lFf" class="page-father" style="background-color: #eeeeee">
    <q-header elevated>
      <q-page-sticky position="top-left" :offset="[18, 18]">
        <q-btn round>
          <q-avatar size="50px">
            <img src="../statics/default_user.png">
          </q-avatar>
          <q-menu anchor="bottom right" self="top left" content-class="main-menu">
            <div class="text-center profile-menu">
              <a href="/profile" class="link-menu">
                <q-avatar size="40px">
                  <img src="../statics/default_user.png">
                </q-avatar>
                <span style="display: block; margin: .5rem 0;">{{user.name}}</span>
              </a>
            </div>

            <q-separator />

            <q-item clickable>
              <q-item-section>
                <a href="/events" class="link-menu">
                  Inicio
                </a>
              </q-item-section>
            </q-item>

            <q-item clickable>
             <q-item-section>
                <a href="/managerevents" class="link-menu">
                  Gerenciar meus Eventos
                </a>
             </q-item-section>
            </q-item>
            <q-separator />

            <q-item clickable @click="logoutNow">
              <q-item-section>
                  Sair
              </q-item-section>
            </q-item>

          </q-menu>
        </q-btn>
      </q-page-sticky>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { EventBus } from '../functions/event_bus.js'

export default {
  name: 'MainLayout',

  created () {
    if (!localStorage.getItem('access_token')) {
      this.$router.push('/')
    }
  },

  beforeCreate () {
    EventBus.$on('showNotify', (notification) => {
      this.showNotify(notification)
    })

    EventBus.$on('expiredToken', () => {
      this.logoutNow()
    })
  },

  data () {
    return {
      user: {
        name: localStorage.getItem('userName')
      }
    }
  },
  methods: {
    logoutNow () {
      this.$q.localStorage.remove('access_token')
      this.$q.localStorage.remove('userId')
      this.$q.localStorage.remove('userName')
      this.$q.localStorage.remove('userProfile')
      this.$q.localStorage.remove('userDepartament')
      this.$router.push('/')
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
  src: url(../css/fonts/VeganStylePersonalUse-5Y58.ttf);
}

.page-father
  background: #9053c7;
  background: -webkit-linear-gradient(-135deg, #c850c0, #4158d0);
  background: -o-linear-gradient(-135deg, #c850c0, #4158d0);
  background: -moz-linear-gradient(-135deg, #c850c0, #4158d0);
  background: linear-gradient(-135deg, #c850c0, #4158d0);

.main-menu
  color #6F6F6F
  width: 15rem

.link-menu
  display: block
  text-decoration: none
  white-space: nowrap
  cursor: pointer
  color: #6F6F6F

.profile-menu
  padding-top: 1rem
  cursor: pointer

.profile-menu:hover
  background-color #F1F1F1
</style>
