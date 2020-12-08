<template >
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale" persistent style="height: auto !important">
    <q-card style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto !important">
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">Colaborador</q-toolbar-title>
        <q-btn class="float-right" flat round dense icon="close" @click="canceled" />
      </q-toolbar>

      <q-card-section style="height: auto !important;">
        <div class="row justify-center">
          <q-input
            class="col-md-8 q-ma-sm"
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
        </div>

        <div class="row justify-center ajusta-layout-calendar">
          <q-input
            class="col-md-4 q-ma-sm"
            filled
            dense
            v-model="person.birthDay"
            mask="##/##/####"
            reverse-fill-mask
            label="Data de Aniversário"
            error-message="Campo precisa ser preenchido"
            :error="$v.person.birthDay.$error"
            @blur="$v.person.birthDay.$touch()"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="person.birthDay" mask="DD/MM/YYYY" :locale="myLocale">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            class="col-md-4 q-ma-sm"
            filled
            reverse-fill-mask
            dense
            v-model="person.hiringDate"
            mask="##/##/####"
            label="Data de admissão"
            error-message="Campo precisa ser preenchido"
            :error="$v.person.hiringDate.$error"
            @blur="$v.person.hiringDate.$touch()"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="person.hiringDate" mask="DD/MM/YYYY" default-view="Years" :locale="myLocale">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
<!--           
          <v-date-picker class="col-md-4 q-ma-sm"  :value="person.hiringDate" color="green">
            <template v-slot="{ inputValue }">
              <div>
                <div v-show="false">
                  {{ person.hiringDate = inputValue? inputValue : person.hiringDate }}
                </div>
                <div>
                  <q-input
                    class="col-md-4 q-ma-sm"
                    filled
                    dense
                    mask="##/##/####"
                    v-model="person.hiringDate"
                    label="Data de admissão"
                    error-message="Campo precisa ser preenchido"
                    :error="$v.person.hiringDate.$error"
                    @blur="$v.person.hiringDate.$touch()"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </v-date-picker>

          <v-date-picker class="col-md-4 q-ma-sm" :value="person.birthDay" color="green">
            <template v-slot="{ inputValue }">
              <div>
                <div v-show="false">
                  {{ person.birthDay = inputValue? inputValue : person.birthDay }}
                </div>
                <div>
                  <q-input
                    class="col-md-4 q-ma-sm"
                    filled
                    dense
                    mask="##/##/####"
                    v-model="person.birthDay"
                    label="Data de aniversário"
                    error-message="Campo precisa ser preenchido"
                    :error="$v.person.birthDay.$error"
                    @blur="$v.person.birthDay.$touch()"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </v-date-picker> -->
        </div>

        <!-- <q-btn label="INSERE TUDO" @click="insertMonster" /> -->
        <!-- <q-input outlined v-model="text" :dense="dense" /> -->
      </q-card-section>

      <q-card-section></q-card-section>
      <q-card-actions style="margin: 10px;" class="text-teal container-card absolute-bottom-right">
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
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import { cloneDeep } from 'lodash'

export default {
  name: 'di-collaborator',

  components: {
    'v-date-picker': DatePicker
  },

  events: ['on-close'],

  created () {
    EventBus.$on('on-edit-person', (person) => {
      this.onShow = true
      this.person = person
      this.person.birthDay = moment(this.person.birthDay, 'YYYY-MM-DD').format('DD/MM/YYYY')
      this.person.hiringDate = moment(this.person.hiringDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
    })

    EventBus.$on('on-new-person', () => {
      this.person = {}
      this.$nextTick(() => { this.$v.$reset() })
      this.onShow = true
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
      onShow: false,
      loading: false,
      person: {
        name: '',
        hiringDate: '',
        birthDay: ''
      },

      myLocale: {
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        firstDayOfWeek: 1
      }
    }
  },

  validations: {
    person: {
      name: { required },
      hiringDate: { required },
      birthDay: { required }
    }
  },

  methods: {
    removeAt (idx) {
      this.guests.splice(idx, 1)
    },

    add () {
      this.id++
      this.guests.push({ id: this.id, name: '', relationShip: '' })
    },

    onShowModal () {
      this.onShow = true
    },

    onHideModal () {
      this.$emit('on-close')
      this.onShow = false
    },

    async confirm () {
      try {
        if (!this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = 'person'

        let employeePayload = Object.assign({}, this.person)
        employeePayload.hiringDate = moment(this.person.hiringDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        employeePayload.birthDay = moment(this.person.birthDay, 'DD/MM/YYYY').format('YYYY-MM-DD')

        if (employeePayload.id) {
          url += `/${employeePayload.id}/`
          axiosFunction = this.$axios.put
        }

        this.loading = true
        await axiosFunction(url, employeePayload)
        this.loading = false

        this.cleanFields()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    validationsFields () {
      this.$v.person.$touch()

      return !this.$v.person.$error
    },

    cleanFields () {
      this.person = {}
      this.$nextTick(() => { this.$v.$reset() })
      EventBus.$emit('on-refresh-person')
      this.onHideModal()
    },

    canceled () {
      this.onHideModal()
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
