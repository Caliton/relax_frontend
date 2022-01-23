<template>
  <q-dialog
    v-model="show"
    transition-show="scale"
    transition-hide="scale"
    persistent
    style="height: auto !important"
  >
    <q-card
      style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto !important"
    >
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">
          Usuário
        </q-toolbar-title>
        <q-btn
          class="float-right"
          flat
          round
          dense
          icon="close"
          @click="canceled"
        />
      </q-toolbar>

      <q-card-section style="height: auto !important;">
        <div class="row justify-around">
          <div class="col-md-5 flex flex-center">
            <q-img
              src="~src/statics/users.png"
              style="max-width: 350px; opacity: .8"
            />
          </div>

          <div class="col-md-5">
            <div class="column justify-center">
              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="user.login"
                label="Login"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.user.login.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-person-outline" />
                </template>
              </q-input>

              <infinite-select
                class="col-md-12 q-ma-sm"
                ref="collaborator"
                dense
                required
                filled
                notClear
                :api="$api.userCollaborator"
                fieldId="id"
                v-model="user.collaborator"
                queryParamFilter="filter"
                fieldLabel="name"
                label="Colaborador"
                icon="eva-person"
              />

              <q-select
                class="col-md-12 q-ma-sm"
                filled
                :options="comboRole"
                v-model="user.role"
                label="Perfil de Acesso"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.user.role.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-credit-card-outline" />
                </template>
              </q-select>

              <div class="col-12">
                <q-btn
                  v-if="isEditing"
                  label="Alterar senha"
                  class="q-mb-md"
                  rounded
                  :outline="!showPassword"
                  size="sm"
                  color="green"
                  no-caps
                  @click="showPassword = !showPassword"
                />

                <q-slide-transition>
                  <div class="" v-if="showPassword || !isEditing">
                    <q-input
                      filled
                      dense
                      class="q-ma-sm"
                      :maxlength="50"
                      label="Senha do Usuário"
                      v-model="user.password"
                      minlenght
                      :type="isPwd ? 'password' : 'text'"
                      :error="this.$v.user.password.$error"
                      error-message="Campo obrigatório"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>

                    <q-input
                      filled
                      dense
                      class="q-ma-sm"
                      :maxlength="50"
                      label="Confirmar senha"
                      v-model="confirmPassword"
                      minlenght
                      :type="isPwd ? 'password' : 'text'"
                      debounce="300"
                      :error="!isEqualPassword"
                      error-message="As senhas não são iguais. Tente novamente."
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>
                  </div>
                </q-slide-transition>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section></q-card-section>
      <q-card-actions
        style="margin: 10px;"
        class="text-teal container-card absolute-bottom-right"
      >
        <q-btn color="primary" dense no-caps label="salvar" @click="confirm" />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-facebook color="light-blue" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import { api } from 'src/enumerator/api'
import infiniteSelect from 'src/components/common/InfiniteSelect.vue'

export default {
  name: 'di-user',

  events: ['on-close'],

  components: {
    infiniteSelect
  },

  data () {
    return {
      show: false,
      loading: false,
      user: {
        login: '',
        role: { value: 'collaborator', label: 'Colaborador' },
        collaborator: null,
        password: ''
      },

      showPassword: false,
      isEditing: false,
      confirmPassword: '',
      isPwd: 'password',

      comboRole: [
        { value: 'admin', label: 'Admin' },
        { value: 'hr', label: 'Rh' },
        { value: 'manager', label: 'Gestor' },
        { value: 'collaborator', label: 'Colaborador' }
      ]
    }
  },

  validations: {
    user: {
      login: { required },
      role: { required },
      password: {
        required: requiredIf(function () {
          return this.showPassword || !this.isEditing
        })
      },

      collaborator: { required }
    }
  },

  computed: {
    isEqualPassword: function () {
      return this.confirmPassword === this.user.password
    }
  },

  methods: {
    onShow (user) {
      this.cleanFields()

      this.user = { ...this.user, password: '' }
      this.showPassword = false
      this.isEditing = false

      this.show = true

      if (!user) return

      this.isEditing = true

      this.user = { ...user, password: '' }
    },

    onHide () {
      this.$emit('on-close')
      this.show = false
    },

    async confirm () {
      try {
        if (this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = api.user

        const payLoad = {
          ...this.user,
          collaboratorId: this.user.collaborator.id,
          role: this.user.role.value
        }

        if (payLoad.id) {
          url += `/${payLoad.id}/`
          axiosFunction = this.$axios.put
        }

        this.loading = true
        await axiosFunction(url, payLoad)

        this.onHide()
        this.show = false
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    validationsFields () {
      this.$v.user.$touch()

      this.$refs.collaborator.validyEmptyError()

      return this.$v.user.$error || !this.isEqualPassword
    },

    cleanFields () {
      this.user = {}
      this.$v.user.$reset()
    },

    canceled () {
      this.onHide()
    }
  }
}
</script>

<style lang="stylus">
.list-guest {
  list-style: none;

  .q-field--focused .q-field__control {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    background: #F2F2F2 !important;
  }
}
</style>
