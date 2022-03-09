<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row">
          <div
            class="col-md-8 flex-center flex"
            style="background-color: #FEFFF5"
          >
            <div class="flex flex-center">
              <img
                v-tilt="{ scale: 1.1 }"
                src="~assets/vacation.svg"
                width="310px"
                style="margin: 0 auto;"
              />
            </div>
          </div>

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
                        'Precisamos verificar se é você mesmo'
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
          </div>
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
.login-card
  border-radius: 20px
  // box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22) !important

.login-area
  height: 100vh !important
</style>
