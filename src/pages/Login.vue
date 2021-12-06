<template>
  <q-layout class="login">
    <q-page-container>
      <q-page>
        <div class="totalcontainer">
          <div class="laya-please layer-1"></div>

          <div class="laya-please layer-2"></div>

          <div class="container1">
            <div class="laya-please layer-3"></div>
            <div class="laya-please layer-4"></div>
            <div class="laya-please layer-5"></div>
            <div class="laya-please layer-6"></div>
          </div>

          <div class="container2">
            <div class="laya-please layer-7"></div>
            <div class="laya-please layer-8"></div>
          </div>

          <q-card class="form-login ajust-screen">
            <q-img
              src="~assets/logo_2.png"
              style="max-width: 750px; position: absolute; transform: translateY(-120px)"
            />
            <q-card-section>
              <q-form @submit="onLogin" class="login-form">
                <q-input
                  v-model="user.login"
                  input-style="color: #6F6F6F"
                  color="primary"
                  filled
                  label="Login"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0) || 'Qual é mesmo o teu login?'
                  ]"
                  v-on:keyup.enter="onSubmit"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" style="color: #6F6F6F !important" />
                  </template>
                </q-input>

                <q-input
                  v-model="user.password"
                  icon="eva-lock"
                  input-style="color: #6F6F6F"
                  filled
                  :type="isPwd ? 'password' : 'text'"
                  label="Password"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0) ||
                      'Por favor precisamos saber se é você mesmo'
                  ]"
                  v-on:keyup.enter="onSubmit"
                >
                  <template v-slot:prepend>
                    <q-icon name="eva-lock" style="color: #6F6F6F !important" />
                  </template>

                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      style="color: #6F6F6F !important"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <div style="margin-top: 1rem">
                  <q-btn
                    unelevated
                    rounded
                    class="action-button q-mr-sm full-width"
                    :loading="loading"
                    label="Entrar"
                    no-caps
                    type="submit"
                    color="light-blue"
                  >
                    <template v-slot:loading>
                      <q-spinner-bars />
                    </template>
                  </q-btn>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { EventBus } from '../functions/event_bus.js'
import { api } from 'src/enumerator/api'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        login: '',
        password: ''
      },
      newUser: {
        name: '',
        login: '',
        password: '',
        isGuest: false,
        profileId: 2,
        departamentId: 2
      },
      isPwd: true,
      loading: false,
      tab: 'btn1'
    }
  },

  mounted () {
    const elems = document.querySelectorAll('.laya-please')
    // const layer2 = document.querySelector('.layer-2')
    const layer3 = document.querySelector('.layer-3')
    const layer4 = document.querySelector('.layer-4')
    const layer5 = document.querySelector('.layer-5')
    const layer6 = document.querySelector('.layer-6')
    const layer7 = document.querySelector('.layer-7')
    const layer8 = document.querySelector('.layer-8')

    setTimeout(function () {
      elems.forEach(function (elem, index) {
        elem.style.animation = 'none'
      })
    }, 1500)

    document.body.addEventListener('mousemove', function (e) {
      if (!e.currentTarget.dataset.triggered) {
        elems.forEach(function (elem, index) {
          if (elem.getAttribute('style')) {
            elem.style.transition = 'all .5s'
            elem.style.transform = 'none'
          }
        })
      }
      e.currentTarget.dataset.triggered = true

      const width = window.innerWidth / 2
      const mouseMoved2 = (width - e.pageX) / 70
      const mouseMoved3 = (width - e.pageX) / 8
      const mouseMoved4 = (width - e.pageX) / 50
      const mouseMoved5 = (width - e.pageX) / 30
      const mouseMoved6 = (width - e.pageX) / 25
      const mouseMoved7 = (width - e.pageX) / 20

      layer3.style.transform = 'translateX(' + mouseMoved2 + 'px)'
      layer4.style.transform = 'translateX(' + mouseMoved3 + 'px)'
      layer5.style.transform = 'translateX(' + mouseMoved4 + 'px)'
      layer6.style.transform = 'translateX(' + mouseMoved5 + 'px)'
      layer7.style.transform = 'translateX(' + mouseMoved6 + 'px)'
      layer8.style.transform = 'translateX(' + mouseMoved7 + 'px)'
    })

    document.body.addEventListener('mouseleave', function (e) {
      elems.forEach(function (elem, index) {
        elem.style.transition = 'all .5s'
        elem.style.transform = 'none'
      })
    })

    document.body.addEventListener('mouseenter', function (e) {
      elems.forEach(function (elem, index) {
        setTimeout(function () {
          elem.style.transition = 'none'
        }, 500)
      })
    })
  },

  beforeCreate () {
    if (localStorage.getItem('token')) {
      this.$router.push({ name: 'colaborator' })
    }

    EventBus.$on('showNotify', notification => {
      this.showNotify(notification)
    })
  },

  beforeDestroy () {
    EventBus.$off('showNotify')
  },

  methods: {
    async onLogin () {
      try {
        this.loading = true
        const { data } = await this.$axios.post(api.signin, this.user)

        const { token, user } = data
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', user.collaborator.id)
        localStorage.setItem('user_name', user.collaborator.name)
        localStorage.setItem('user_hiringdate', user.collaborator.hiringdate)
        localStorage.setItem('user_role', user.role)

        this.$router.push('/dashboard')

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Seja Bem Vindo!'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
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
html {
  overflow-x: hidden;
}

html, body {
  padding: 0;
  margin: 0;
}

.form-login {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  background-color: var(--md-theme-default-background, #fff);
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%); /* 3 */
  z-index: 9999 !important;
}

.totalcontainer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container1 {
  transform: scaleX(1.11);
}

.container2 {
  transform: scaleX(1.25);
}

.layer-1 {
  height: 100vh;
  width: 100%;
  background-color: #00adef;
}

.layer-2 {
  background: url('../statics/colorido/lay2.svg');
  no-repeat: center center fixed;
  animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.layer-3 {
  background: url('../statics/colorido/lay3.svg');
  no-repeat: center center fixed;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

.layer-4 {
  background: url('../statics/colorido/lay4.svg');
  no-repeat: center center fixed;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
}

.layer-5 {
  background: url('../statics/colorido/lay6.svg');
  no-repeat: center center fixed;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.55s both;
}

.layer-6 {
  background: url('../statics/colorido/lay5.svg');
  no-repeat: center center fixed;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.75s both;
}

.layer-7 {
  background: url('../statics/colorido/lay7.svg');
  no-repeat: center center fixed;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.85s both;
}

.layer-8 {
  background: url('../statics/colorido/teste2.svg');
  no-repeat: center center fixed;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s both;
}

.laya-please {
  position: absolute;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0px;
}

@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-top {
  0% {
    -webkit-transform: translateY(-1000px);
    transform: translateY(-1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

.ajust-screen {
  zoom: 0.8;
}
</style>
