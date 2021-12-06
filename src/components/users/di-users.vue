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
                v-model="person.name"
                label="Nome"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.person.name.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-person-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="person.register"
                label="Matricula"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.person.register.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>
            </div>

            <div class="row justify-start ajusta-layout-calendar">
              <q-input
                class="col-md-12 q-ma-sm"
                filled
                dense
                v-model="person.birthday"
                mask="##-##-####"
                reverse-fill-mask
                label="Data de Nascimento"
                error-message="Campo precisa ser preenchido"
                :error="$v.person.birthday.$error"
                @blur="$v.person.birthday.$touch()"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="person.birthday"
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
                v-model="person.hiringdate"
                mask="##-##-####"
                label="Data de Admissão"
                error-message="Campo precisa ser preenchido"
                :error="$v.person.hiringdate.$error"
                @blur="$v.person.hiringdate.$touch()"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="person.hiringdate"
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
import { api } from 'src/enumerator/api'
import moment from 'moment'

export default {
  name: 'di-users',

  events: ['on-close'],

  created () {
    EventBus.$on('on-edit-person', person => {
      this.show = true
      this.person = person
      this.person.birthday = moment(this.person.birthday, 'YYYY-MM-DD').format(
        'DD-MM-YYYY'
      )
      this.person.hiringdate = moment(
        this.person.hiringdate,
        'YYYY-MM-DD'
      ).format('DD-MM-YYYY')
    })

    EventBus.$on('on-new-person', () => {
      this.person = {}
      this.$nextTick(() => {
        this.$v.$reset()
      })
      this.show = true
    })
  },

  beforeDestroy () {
    EventBus.$off('on-edit-person')

    EventBus.$off('on-new-person')
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
      person: {
        name: '',
        register: '',
        hiringdate: '',
        birthday: ''
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
    person: {
      name: { required },
      register: { required },
      hiringdate: { required },
      birthday: { required }
    }
  },

  methods: {
    onShow (person) {
      this.cleanFields()

      this.show = true

      if (!person) return

      const { birthday, hiringdate } = person
      this.person = person
      this.person.birthday = moment(birthday).format('DD-MM-YYYY')
      this.person.hiringdate = moment(hiringdate).format('DD-MM-YYYY')
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
        let url = api.users

        const employeePayload = Object.assign({}, this.person)
        employeePayload.hiringdate = moment(
          this.person.hiringdate,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD')
        employeePayload.birthday = moment(
          this.person.birthday,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD')

        if (employeePayload.id) {
          url += `/${employeePayload.id}/`
          axiosFunction = this.$axios.put
        }

        this.loading = true
        await axiosFunction(url, employeePayload)

        this.onHide()
        this.show = false
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    validationsFields () {
      this.$v.person.$touch()

      return !this.$v.person.$error
    },

    cleanFields () {
      this.person = {}
      this.$v.person.$reset()
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
