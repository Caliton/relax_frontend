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
        <q-toolbar-title class="flex flex-center">Colaborador</q-toolbar-title>
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
                v-model="collaborator.name"
                label="Nome"
                maxlength="50"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.collaborator.name.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-person-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                maxlength="5"
                v-model="collaborator.register"
                label="Matricula"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.collaborator.register.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-credit-card-outline" />
                </template>
              </q-input>
            </div>

            <div class="row justify-start ajusta-layout-calendar">
              <q-input
                class="col-md-12 q-ma-sm"
                filled
                dense
                v-model="collaborator.birthday"
                mask="##-##-####"
                reverse-fill-mask
                label="Data de Nascimento"
                error-message="Campo precisa ser preenchido"
                :error="$v.collaborator.birthday.$error"
                @blur="$v.collaborator.birthday.$touch()"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-calendar-outline" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="collaborator.birthday"
                        mask="DD-MM-YYYY"
                        default-view="Years"
                        :locale="myLocale"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fechar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                reverse-fill-mask
                dense
                v-model="collaborator.hiringdate"
                mask="##-##-####"
                maxlength="10"
                label="Data de Admissão"
                error-message="Campo precisa ser preenchido"
                :error="$v.collaborator.hiringdate.$error"
                @blur="$v.collaborator.hiringdate.$touch()"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-calendar-outline" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="collaborator.hiringdate"
                        mask="DD-MM-YYYY"
                        default-view="Years"
                        :locale="myLocale"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fechar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-select
                class="col-md-12 q-ma-sm"
                filled
                :options="comboType"
                v-model="collaborator.type"
                label="Tipo de Contratação"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.collaborator.type.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-bookmark-outline" />
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
import { EventBus } from 'src/functions/event_bus.js'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'di-collaborator',

  events: ['on-close'],

  created () {
    EventBus.$on('on-edit-collaborator', collaborator => {
      this.show = true
      this.collaborator = collaborator
      this.collaborator.birthday = moment(
        this.collaborator.birthday,
        'YYYY-MM-DD'
      ).format('DD-MM-YYYY')
      this.collaborator.hiringdate = moment(
        this.collaborator.hiringdate,
        'YYYY-MM-DD'
      ).format('DD-MM-YYYY')
    })

    EventBus.$on('on-new-collaborator', () => {
      this.collaborator = {}
      this.$nextTick(() => {
        this.$v.$reset()
      })
      this.show = true
    })
  },

  beforeDestroy () {
    EventBus.$off('on-edit-collaborator')

    EventBus.$off('on-new-collaborator')
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
      collaborator: {
        name: '',
        register: '',
        hiringdate: '',
        birthday: '',
        type: { value: 'effective', label: 'Efetivo' }
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

      comboType: [
        { value: 'effective', label: 'Efetivo' },
        { value: 'intern', label: 'Estagiário' }
      ]
    }
  },

  validations: {
    collaborator: {
      name: { required },
      register: { required },
      hiringdate: { required },
      birthday: { required },
      type: { required }
    }
  },

  methods: {
    onShow (collaborator) {
      this.cleanFields()

      this.show = true

      if (!collaborator) return

      const { birthday, hiringdate } = collaborator
      this.collaborator = collaborator
      this.collaborator.birthday = moment(birthday).format('DD-MM-YYYY')
      this.collaborator.hiringdate = moment(hiringdate).format('DD-MM-YYYY')
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
        let url = this.$api.collaborators

        const { hiringdate, birthday } = this.collaborator

        const payload = {
          ...this.collaborator,
          hiringdate: moment(hiringdate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          birthday: moment(birthday, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          type: this.collaborator.type.value
        }

        if (payload.id) {
          url += `/${payload.id}/`
          axiosFunction = this.$axios.put
        }

        this.loading = true
        await axiosFunction(url, payload)
        this.onHide()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    validationsFields () {
      this.$v.collaborator.$touch()

      return !this.$v.collaborator.$error
    },

    cleanFields () {
      this.collaborator = {}
      this.$v.collaborator.$reset()
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
