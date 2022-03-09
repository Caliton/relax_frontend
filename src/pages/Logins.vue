<template>
  <div class="login-page">
    <!-- <div class="bg-primary justify-center row large-gutter sm-column">
      <img alt="logo" src="../statics/img_general/landix_negativa_hor_600x130.png" class="ldx-img" />
    </div> -->

    <div class="login-page-2">
      <div class="login-page-3">
        <div class="login-page-4">
          <div class="" style="height: inherit;">
            <div style="margin-top: 1.5rem; text-align: center">
              <img
                v-tilt="{ scale: 1.1 }"
                src="~assets/logo_2.png"
                width="310px"
                style="margin: 0 auto;"
              />
            </div>

            <div class="container-login">
              <div class="login-logo">
                <q-tab-panels
                  v-model="tab"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  class="text-center"
                >
                  <q-tab-panel name="btn1">
                    <q-form @submit="onLogin" class="login-form">
                      <q-input
                        v-model="user.email"
                        type="email"
                        input-style="color: #6F6F6F"
                        color="primary"
                        rounded
                        standout="bg-grey-3 text-black"
                        label="Email"
                        lazy-rules
                        :rules="[
                          val =>
                            (val && val.length > 0) ||
                            'Qual é mesmo o teu email?'
                        ]"
                        v-on:keyup.enter="onSubmit"
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="person"
                            style="color: #6F6F6F !important"
                          />
                        </template>
                      </q-input>

                      <q-input
                        v-model="user.password"
                        rounded
                        icon="eva-lock"
                        input-style="color: #6F6F6F"
                        standout="bg-grey-3"
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
                          <q-icon
                            name="eva-lock"
                            style="color: #6F6F6F !important"
                          />
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
                          class="action-button q-mr-sm"
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

                        <q-btn
                          unelevated
                          rounded
                          class="action-button"
                          no-caps
                          label="Sou novo por aqui"
                          color="primary"
                          @click="tab = 'btn2'"
                        >
                          <template v-slot:loading>
                            <q-spinner-bars />
                          </template>
                        </q-btn>
                      </div>
                    </q-form>
                  </q-tab-panel>

                  <q-tab-panel name="btn2">
                    <q-form @submit="onSingup" class="login-form">
                      <q-input
                        v-model="newUser.name"
                        input-style="color: #6F6F6F"
                        color="primary"
                        rounded
                        standout="bg-grey-3 text-black"
                        label="Diga-nos o seu Nome"
                        lazy-rules
                        :rules="[
                          val =>
                            (val && val.length > 0) ||
                            'Conte-nos qual é o seu nome?'
                        ]"
                        v-on:keyup.enter="onSubmit"
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="person"
                            style="color: #6F6F6F !important"
                          />
                        </template>
                      </q-input>

                      <q-input
                        v-model="newUser.email"
                        input-style="color: #6F6F6F"
                        color="primary"
                        rounded
                        type="email"
                        standout="bg-grey-3 text-black"
                        label="Email"
                        lazy-rules
                        :rules="[
                          val =>
                            (val && val.length > 0) ||
                            'Qual seu email, prometo que não vou te atormentar XD'
                        ]"
                        v-on:keyup.enter="onSubmit"
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="fas fa-envelope"
                            style="color: #6F6F6F !important"
                          />
                        </template>
                      </q-input>

                      <q-input
                        v-model="newUser.password"
                        rounded
                        icon="eva-lock"
                        input-style="color: #6F6F6F"
                        standout="bg-grey-3"
                        :type="isPwd ? 'password' : 'text'"
                        label="Password"
                        lazy-rules
                        :rules="[
                          val =>
                            (val && val.length > 0) ||
                            'Você precisa de uma senha (vai ser o nosso segredinho)'
                        ]"
                        v-on:keyup.enter="onSubmit"
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="eva-lock"
                            style="color: #6F6F6F !important"
                          />
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
                          class="action-button  q-mr-sm"
                          no-caps
                          label="voltar"
                          color="primary"
                          @click="tab = 'btn1'"
                        >
                          <template v-slot:loading>
                            <q-spinner-bars />
                          </template>
                        </q-btn>

                        <q-btn
                          unelevated
                          rounded
                          class="action-button"
                          :loading="loading"
                          label="Me Cadastre Por Favor!!!"
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
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
        localStorage.setItem('user_id', user.id)
        localStorage.setItem('user_collaborator_id', user.collaborator.id)
        localStorage.setItem('user_name', user.collaborator.name)
        localStorage.setItem('user_hiringdate', user.collaborator.hiringdate)
        localStorage.setItem('user_role', user.role)

        this.$router.push('/index')

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
@import url('https://fonts.googleapis.com/css?family=Montserrat:700|Poppins:400,500,700&display=swap');

@font-face {
  font-family: customfont;
  src: url(../css/fonts/VeganStylePersonalUse-5Y58.ttf);
}

.login-page
  font-family: 'Poppins', sans-serif;
  background-color: #eee
  letter-spacing: unset
  color: #3c4858

  .login-page-2
    height: auto
    min-height: 100vh

  .login-page-3
    // background-image: url('https://picsum.photos/1920/1080?random')
    background: #9053c7;
    background: -webkit-linear-gradient(-135deg, #42C7B7, #7DFF8A);
    background: -o-linear-gradient(-135deg,#42C7B7, #7DFF8A);
    background: -moz-linear-gradient(-135deg,#42C7B7, #7DFF8A);
    background: linear-gradient(-135deg,#42C7B7, #7DFF8A);
    width 100%
    height: 100%
    min-height: 100vh
    background-position: top
    background-size: cover
    margin: 0
    padding: 0
    border: 0
    display: -webkit-box
    display: -ms-flexbox
    display: flex
    -webkit-box-align: center
    -ms-flex-align: center
    align-items: center

  // .login-page-3::before
  //   position: absolute
  //   z-index: 1
  //   width: 100%
  //   height: 100%
  //   display: block
  //   left: 0
  //   top: 0
  //   content: ""
  //   background: rgba(0,0,0,.6)

  .login-page-4
    border-radius 12px
    width: 50%
    min-height: 70vmin
    margin: 0 auto
    -webkit-transform: translateZ(0)
    transform: translateZ(0)
    background-color: white
    z-index 9999 !important
    display: -webkit-box
    display: -ms-flexbox
    display: flex
    -webkit-box-orient: vertical
    -webkit-box-direction: normal
    -ms-flex-direction: column
    flex-direction: column
    position: relative
    overflow: unset
    font-size: .875rem
    -webkit-box-shadow: 0 1px 4px 0 rgba(0,0,0,.14)
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.14)
    color: #333

  .login-form
    padding: 15px 20px
    line-height: 1.75em
    position: relative
    font-size: 14px

  .bg-text
    padding: 15px
    z-index: 2
    z-stclass="text-center" style="max-width: 50%"

  .login-logo
    margin-top: 1.5rem
    text-align center
    font-size 1.5rem

  .q-field--focused .q-field__control {
      box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
      background: #F2F2F2 !important
  }

  .action-button
    -webkit-transition-property: opacity, -webkit-transform !important;
    transition-property: opacity, -webkit-transform !important;
    transition-property: transform, opacity !important;
    transition-property: transform, opacity, -webkit-transform !important;
    -webkit-transition-timing-function: ease-in-out !important;
    transition-timing-function: ease-in-out !important;
    -webkit-transition-duration: 40ms !important;
    transition-duration: 40ms !important;

  .action-button:active
    -webkit-transform: scale(0.96)
    transform: scale(0.96)

  .container-login
    max-width: 50%;
    transition .3s
    margin: 0 auto

  .name-login
    font-family: customfont
    font-size: 1.8rem

  @media (max-width: 1440px)
    .container-login
      max-width: 60%;
</style>
