<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale" @before-hide="onHideDialog">
    <q-card style="width:600px; max-width: 80vw;">
      <q-card-section>
        <p style="color: #4caf50; font-size: 20pt">{{this.colaborator.name}}</p>
        Status:<p :style="[{'color': this.getColor(this.colaborator.status)}, 'font-size: 13pt']">{{getNameStatus(this.colaborator.status)}}</p>

      </q-card-section>
      <q-card-section class="q-gutter-lg">
        <div class="row">
          <p style="color: #4caf50; font-size: 20pt">Período</p>
        </div>
        <!-- <q-input outlined v-model="text" :dense="dense" /> -->

        <div class="row">
          <q-select
            label="Período"
            class="col-md-10 col-sm-10"
            transition-show="scale"
            transition-hide="scale"
            filled
            @input="setVacationCombo"
            v-model="selectedOption"
            :options="vacationsCombo"
          >
            <template v-slot:after>
              <q-btn round dense icon="add" color="green">
                <q-menu anchor="top left" self="top left">
                  <div class="row no-wrap q-pa-md">
                    <div class="column q-gutter-sm">
                      <div class="text-h6 q-mb-md text-center">Inserir novo periodo</div>

                      <q-input
                        filled
                        v-model="vacationTime.vacationYear"
                        label="Ano"
                        dense
                        lazy-rules
                      />

                      <q-input
                        filled
                        v-model="vacationTime.daysAllowed"
                        label="Dias de direito"
                        dense
                        lazy-rules
                      />

                      <q-btn
                        color="primary"
                        class="q-mt-lg"
                        label="Salvar"
                        :loading="loadingVacationTime"
                        @click="registerVacationTime"
                        push
                        size="sm"
                        v-close-popup
                      />
                    </div>
                  </div>
                </q-menu>
              </q-btn>
            </template>
          </q-select>
        </div>

        <div class="row q-gutter-md">
          <div v-if="vacationSelected.id">
            <span>Dias de Direito:</span>
            {{vacationSelected.daysAllowed }}
            <br />
            <span>Dias Usufruídos:</span>
            {{vacationSelected.daysEnjoyed }}
            <br />
            <span>Dias Saldos:</span>
            {{vacationSelected.daysBalance}}
            <br />
            <span :style="[{'color': vacationSelected.limitDate < moment().format('YYYY-MM-DD')? 'red': ''}]">Data Limite:
            {{vacationSelected.limitDate | moment('DD-MM-YYYY') }}
            </span>
            <br />
            <span>Limite com 6 meses:</span>
            {{vacationSelected.limit6Months | moment('DD-MM-YYYY') }}
            <br />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <p style="color: #4caf50; font-size: 20pt">Solicitação</p>

        <v-date-picker class v-model="attributes" mode="range" is-inline />
      </q-card-section>
      <q-card-actions style="margin: 10px;" class="text-teal container-card absolute-bottom-right">
        <q-btn
          color="green"
          dense
          no-caps
          label="Salvar"
          @click="registerVacationRequest"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'
import moment from 'moment'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  name: 'di-vacation-request',

  components: {
    'v-date-picker': DatePicker
  },

  events: ['on-close'],

  created () {
    EventBus.$on('on-show-vacation-request', (data) => {
      this.onShow = true

      console.log('VacationRequest: ', data)
      if (data) {
        this.colaborator = Object.assign({}, data)
        this.personId = data.id
        this.getVacationsTimes(data.id)
      }
    })
  },

  beforeDestroy () {
    EventBus.$off('on-show-vacation-request')
  },

  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },

  data () {
    return {
      onShow: false,
      vacations: [],
      attributes: [],
      moment: moment,
      colaborator: {},
      loadingVacationTime: false,
      vacationRequest: {
        requestUserId: 0,
        vacationTimeId: 0,
        startDate: '',
        finalDate: ''
      },
      vacationSelected: {},
      personId: undefined,
      vacationTime: {
        vacationYear: '',
        daysAllowed: ''
      },
      showInputVacationTime: false,
      vacationsCombo: [],
      selectedOption: { label: '-', value: 0 }
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
    openNewVacationTime () {
      this.showInputVacationTime = true
    },

    setVacationCombo (vacationSelected) {
      this.vacationSelected = this.vacations.find((item) => item.id === vacationSelected.value)
    },

    async getVacationsTimes (personId) {
      try {
        const result = await this.$axios.get('person/{id}/vacationtime'.replace('{id}', personId || this.personId))

        console.log('adsf: ', result)

        this.vacationsCombo = []
        this.vacations = result.data

        result.data.forEach((item) => {
          this.vacationsCombo.push({ label: item.vacationDate.split('-')[0], value: item.id })
        })
      } catch (e) {
        console.log(e)
      }
    },

    async registerVacationRequest () {
      try {
        this.vacationRequest.startDate = this.attributes.start
        this.vacationRequest.finalDate = this.attributes.end
        this.vacationRequest.vacationTimeId = this.vacationSelected.id
        this.vacationRequest.requestUserId = this.personId

        const result = await this.$axios.post('/requests', this.vacationRequest)
        console.log(result)
      } catch (e) {
        console.log(e)
      }
    },

    async registerVacationTime () {
      try {
        this.loadingVacationTime = true

        const result = await this.$axios.post(`person/${this.personId}/vacationtime`, { daysAllowed: this.vacationTime.daysAllowed, vacationYear: this.vacationTime.vacationYear })

        this.getVacationsTimes()
        this.loadingVacationTime = false

        console.log(result)
      } catch (e) {
        console.log(e)
        this.loadingVacationTime = false
      }
    },

    getColor (item) {
      let color = ''

      switch (item) {
        case 'NORMAL':
          color = 'green'
          break
        case 'MEDIO':
          color = 'orange'
          break
        case 'CRITICO':
          color = 'red'
          break
        case 'INDEFINIDO':
          color = 'grey'
          break

        default:
          color = 'grey'
          break
      }
      return color
    },

    getNameStatus (item) {
      let statusName = ''

      switch (item) {
        case 'NORMAL':
          statusName = 'Normal'
          break
        case 'MEDIO':
          statusName = 'Esta se Aproximando do prazo Crítico'
          break
        case 'CRITICO':
          statusName = 'Este colaborador passou o mês Crítico'
          break
        case 'INDEFINIDO':
          statusName = 'Este colaborador não teve seu periodo configurado'
          break

        default:
          statusName = 'Status não identificado'
          break
      }
      return statusName
    },

    onHideDialog () {
      this.vacations = []
      this.attributes = []
      this.colaborator = {}
      this.loadingVacationTime = false
      this.vacationRequest = {
        requestUserId: 0,
        vacationTimeId: 0,
        startDate: '',
        finalDate: ''
      }

      this.vacationSelected = {}
      this.personId = undefined
      this.vacationTime = {
        vacationYear: '',
        daysAllowed: ''
      }

      this.showInputVacationTime = false
      this.vacationsCombo = []
      this.selectedOption = { label: '-', value: 0 }
    },

    async confirm () {
      try {
        let axiosFunction = this.$axios.post
        let url = 'person'

        let result = {}

        if (!this.person.id) {
          result = await axiosFunction(url, this.person)
          this.person.id = result.data.id
        }

        if (this.person.id) {
          url += `/${this.person.id}/`
          axiosFunction = this.$axios.put

          await axiosFunction(url, this.person)
          EventBus.$emit('on-refresh-evaluation')
        }

        EventBus.$emit('on-refresh-person')
        this.onHideModal()
      } catch (e) {
        console.log(e)
      }
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

.vacations-label {
  color: $green;
}
</style>
