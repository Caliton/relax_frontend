<template>
  <q-layout>
    <q-page-container style="background-color: #FEFFF5">
      <q-page class="q-pa-lg gradient-background">
        <div class="relax-menu row q-pa-md justify-between">
          <span class="relax-logo">Relax</span>

          <div class="relax-menu-itens">
            <ul>
              <li>
                <q-btn
                  rounded
                  color="grey-1"
                  class="text-cyan"
                  no-caps
                  label="Acessar"
                >
                  <q-menu
                    :offset="[8, 8]"
                    content-style="border-radius: 16px;"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <div class="row no-wrap q-pa-lg">
                      <div class="column">
                        <q-form @submit="onLogin">
                          <q-input
                            v-model="user.login"
                            input-style="color: #6F6F6F"
                            color="primary"
                            borderless
                            dense
                            placeholder="Login"
                            lazy-rules
                            :rules="[
                              val =>
                                (val && val.length > 0) ||
                                'Qual é mesmo o teu login?'
                            ]"
                            v-on:keyup.enter="onSubmit"
                          >
                            <template v-slot:prepend>
                              <q-icon name="person" color="grey-5" />
                            </template>
                          </q-input>

                          <q-space style="heigth: 40px" />
                          <q-input
                            v-model="user.password"
                            icon="eva-lock"
                            input-style="color: #6F6F6F"
                            dense
                            borderless
                            :type="isPwd ? 'password' : 'text'"
                            placeholder="Password"
                            lazy-rules
                            :rules="[
                              val =>
                                (val && val.length > 0) ||
                                'Precisamos verificar se é você mesmo'
                            ]"
                            v-on:keyup.enter="onSubmit"
                          >
                            <template v-slot:prepend>
                              <q-icon name="eva-lock" color="grey-5" />
                            </template>

                            <template v-slot:append>
                              <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                color="grey-5"
                                @click="isPwd = !isPwd"
                              />
                            </template>
                          </q-input>

                          <div>
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
                      </div>
                    </div>
                  </q-menu>
                </q-btn>
              </li>
            </ul>
          </div>
        </div>

        <q-space class="q-pb-lg q-pt-lg" />

        <div class="relax-body ">
          <div class="relax-copywhite text-center text-white">
            Sinta-se de férias
            <br />
            ao fazer gestão de férias de seus Colaboradores.
          </div>

          <q-space class="q-pb-lg q-pt-lg" />

          <div class="flex flex-center">
            <img
              v-tilt="{ scale: 1.1 }"
              src="~assets/vacation.svg"
              width="500px"
              style="margin: 0 auto;"
            />
          </div>

          <!--
          <div class="col-md-4 bg-cyan-1 login-area q-pa-md flex-center flex">
            <div class="flex flex-center">
              <img
                v-tilt="{ scale: 1.1 }"
                src="~assets/logo.svg"
                width="310px"
                style="margin: 0 auto;"
              />
            </div>
            <q-card class="q-pa-lg login-card" flat>
              <q-card-section>
                <q-form @submit="onLogin">
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
                      <q-icon name="person" color="grey-5" />
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
                        'Precisamos verificar se é você mesmo'
                    ]"
                    v-on:keyup.enter="onSubmit"
                  >
                    <template v-slot:prepend>
                      <q-icon
                        name="eva-lock"
                        color="grey-5"
                      />
                    </template>

                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="grey-5"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>

                  <div>
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
          </div> -->
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
@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@600&display=swap');

.gradient-background {
  height: 600px;
   background: linear-gradient(62deg, #23A6D5, #23D5AB);
     animation: gradient 15s ease infinite;
      background-size: 400% 400%;

}
@-webkit-keyframes gradient{
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
     background-position: 0% 50%;
  }
}
@keyframes gradient{
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
     background-position: 0% 50%;
  }
}

.login-card
  border-radius: 20px
  // box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22) !important

.login-area
  height: 100vh !important

.relax-menu
  // color: #42C7B7
  color: white

.relax-menu-itens ul li
  display: inline-block;
  padding-right: 80px;
  font-family: 'Signika Negative', sans-serif;
  font-size: 1.3rem

// .relax-body

.relax-logo
.relax-copywhite
  font-family: 'Signika Negative', sans-serif;
  font-size: 2.5rem
</style>
