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
          Status do periodo
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
              src="~src/statics/new_person.png"
              style="max-width: 500px; opacity: .8"
            />
          </div>

          <div class="col-md-5">
            <div class="row justify-start">
              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.icon"
                label="Icone"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.icon.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.color"
                label="Cor"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.color.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.description"
                label="Nome"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.description.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.limitMonths"
                label="Diferença do prazo final em meses"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.limitMonths.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.tooltip"
                label="Diferença do prazo final em meses"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.tooltip.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>
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
import { api } from 'src/enumerator/api'

export default {
  name: 'di-situation',

  events: ['on-close'],

  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },

  data () {
    return {
      show: false,
      loading: false,
      situation: {
        description: '',
        limitMonths: '',
        tooltip: '',
        icon: '',
        color: ''
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
      }
    }
  },

  validations: {
    situation: {
      description: { required },
      limitMonths: { required },
      tooltip: { required },
      icon: { required },
      color: { required }
    }
  },

  methods: {
    onShow (situation) {
      this.cleanFields()

      this.show = true

      if (!situation) return

      this.situation = situation
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
        let url = api.collaborators

        const payLoad = { ...this.situation }

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
      this.$v.situation.$touch()

      return !this.$v.situation.$error
    },

    cleanFields () {
      this.situation = {}
      this.$v.situation.$reset()
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
