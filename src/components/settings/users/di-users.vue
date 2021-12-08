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
            <div class="row justify-center">
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
                ref="moduleSelect"
                dense
                required
                filled
                notClear
                :api="$api.userCollaborator"
                fieldId="id"
                v-model="user.collaborator"
                bgColor="bg-red"
                queryParamFilter="name"
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
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import { api } from 'src/enumerator/api'
import infiniteSelect from 'src/components/common/InfiniteSelect.vue'

export default {
  name: 'di-user',

  events: ['on-close'],

  components: {
    infiniteSelect
  },
  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },

  data () {
    return {
      show: false,
      loading: false,
      user: {
        login: '',
        role: { value: 'collaborator', label: 'Colaborador' },
        collaborator: null
      },

      myLocale: {
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split(
          '_'
        ),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split(
          '_'
        ),
        firstDayOfWeek: 1
      },

      comboRole: [
        { value: 'admin', label: 'Admin' },
        { value: 'rh', label: 'Rh' },
        { value: 'supervisor', label: 'Gestor' },
        { value: 'collaborator', label: 'Colaborador' }
      ]
    }
  },

  validations: {
    user: {
      login: { required },
      role: { required },
      collaborator: { required }
    }
  },

  methods: {
    onShow (user) {
      this.cleanFields()

      this.show = true

      if (!user) return

      this.user = { ...user }
    },

    onHide () {
      this.$emit('on-close')
      this.show = false
    },

    async confirm () {
      try {
        if (!this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = api.user

        const payLoad = {
          ...this.user,
          type: this.user.type.value,
          date: moment(this.user.date).format('YYYY-MM-DD')
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

      return !this.$v.user.$error
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
