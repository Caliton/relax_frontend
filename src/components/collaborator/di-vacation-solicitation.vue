<template>
  <q-dialog
    v-model="show"
    transition-show="scale"
    transition-hide="scale"
    style="height: auto !important"
  >
    <q-card
      style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto !important"
    >
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">
          Solicitar Férias
        </q-toolbar-title>
        <q-btn
          class="float-right"
          flat
          round
          dense
          icon="close"
          @click="onHide"
        />
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-md-4">
            <v-date-picker
              :min-date="period.start"
              :max-date="period.ultimate"
              v-model="rangeDate"
              is-range
              is-inline
              mode="range"
              :color="rangeIsOk ? 'green' : 'red'"
              :disabled-dates="disableDates"
            />
          </div>
          <div
            class="col-md-7"
            :class="{ 'flex flex-center': !rangeIsNotNull }"
            style="border-radius: .5rem; border: 1px solid #BDBDBF;"
          >
            <div v-if="rangeIsNotNull">
              <div class="column q-pa-md text-center">
                <span class="text-h5 text-grey-8">
                  Agendar férias a partir do dia
                </span>
                <span class="text-h5 text-grey-8">
                  {{ rangeDate.start | moment('DD-MM-YYYY') }} ao dia
                  {{ rangeDate.end | moment('DD-MM-YYYY') }}?
                </span>
              </div>

              <q-separator inset />

              <div class="q-pa-md text-subtitle1">
                <span>
                  Você pode escolher
                  <b>{{ 30 - countDaysSolicited() }}</b> dias.
                </span>
                <br />
                <span>
                  Prazo limite final:
                  <b>{{ period.ultimate | moment('DD-MM-YYYY') }}</b>
                </span>
                <br />
                <span class="text-subtitle1">
                  Dias Selecionados: <b>{{ qtdaDias }}</b>
                </span>
                <br />
                <span class="text-subtitle1">
                  Periodo Referente:
                  <b>{{ period.start | moment('DD-MM-YYYY') }}</b> à
                  <b>{{ period.end | moment('DD-MM-YYYY') }}</b>
                </span>
              </div>

              <div class="text-center">
                <span class="text-red" v-show="!rangeIsOk">
                  {{ messageRange }}
                </span>
              </div>
            </div>

            <div class="flex-center flex" v-else>
              <span class="text-h6 text-center text-grey-8">
                Escolha os dias que anseia em agendar as férias deste
                colaborador
              </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="text-teal container-card absolute-bottom-right">
        <q-btn
          v-if="this.vacation.id"
          color="red"
          dense
          no-caps
          outline
          rounded
          label="Desfazer Solicitação"
          @click="onShowDelete"
        />
        <q-btn
          :color="rangeIsOk ? 'primary' : 'red'"
          dense
          no-caps
          outline
          rounded
          :disable="!rangeIsOk"
          label="Agendar"
          @click="onRegister"
        />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-facebook color="light-blue" />
      </q-inner-loading>
    </q-card>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir a Solicitação?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            no-caps
            label="Vou pensar melhor..."
            color="grey"
            v-close-popup
          />
          <q-btn
            flat
            no-caps
            label="Sim, não quero mais!"
            color="red"
            @click="onDeleteRequest"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import moment from 'moment'
import { status } from 'src/enumerator/status.js'

import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  name: 'di-vacation-solicitation',

  components: {
    'v-date-picker': DatePicker
  },

  events: ['on-close'],

  data () {
    return {
      show: false,
      loading: false,
      showDelete: false,
      period: {},
      vacation: {},
      collaborator: {},
      disableDates: [],
      rangeIsOk: false,
      moment,
      messageRange: '',
      rangeDate: { start: null, end: null }
    }
  },

  computed: {
    rangeIsNotNull: function () {
      if (this.rangeDate) {
        return this.rangeDate.start !== null && this.rangeDate.end !== null
      } else {
        return false
      }
    },

    qtdaDias: function () {
      if (this.rangeDate) {
        return moment(this.rangeDate.end).diff(
          moment(this.rangeDate.start),
          'days'
        )
      } else {
        return 0
      }
    }
  },

  watch: {
    rangeDate: function (item) {
      this.checkRangeDate()
    }
  },

  mounted () {},

  methods: {
    onShow (data) {
      console.log(data)
      this.period = {}
      this.rangeDate = { start: null, end: null }
      this.collaborator = {}

      this.show = true

      this.period = { ...data.period }
      this.collaborator = { ...data.collaborator }

      this.checkDateAcessibles()
    },

    onHide () {
      this.$emit('on-close')
      this.show = false
    },

    onShowDelete () {
      this.showDelete = true
    },

    async onRegister () {
      try {
        this.loading = true

        const sendVacation = {
          startDate: moment(this.rangeDate.start).format('YYYY-MM-DD'),
          finalDate: moment(this.rangeDate.end).format('YYYY-MM-DD'),
          startPeriod: moment(this.period.start).format('YYYY-MM-DD'),
          requestUser: this.collaborator.id,
          status: 'requested',
          approvalUser: localStorage.getItem('user_id')
        }

        console.log(sendVacation)
        await this.$axios.post(this.$api.vacation, sendVacation)
        this.onHide()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onDeleteRequest () {
      try {
        await this.$axios.delete(
          this.$api.vacationrequest.replace('{id}', this.vacation.id)
        )
      } catch (e) {
        console.log(e)
      }
    },

    countDaysSolicited () {
      if (!this.period.requests.length) return 0
      return this.period.requests
        .filter(item => item.status !== status.REFUSED)
        .map(item => moment(item.finalDate).diff(item.startDate, 'day'))
        .reduce((a, b) => a + b)
    },

    checkRangeDate () {
      if (!this.rangeDate || !this.rangeDate.start || !this.rangeDate.end) {
        return false
      }

      const { start, end } = this.rangeDate
      const diffDate = moment(end).diff(moment(start), 'd')
      const listValidy = [10, 15, 20, 30]

      let qtdDaysEnjoed = 0
      let pieceMessageRange = '10, 15, 20, 30'

      qtdDaysEnjoed = this.countDaysSolicited()

      switch (qtdDaysEnjoed) {
        case 10:
          listValidy.splice(listValidy.indexOf(15), 1)
          listValidy.splice(listValidy.indexOf(30), 1)
          pieceMessageRange = '10 ou 20'
          break

        case 15:
          listValidy.splice(listValidy.indexOf(10), 1)
          listValidy.splice(listValidy.indexOf(20), 1)
          listValidy.splice(listValidy.indexOf(30), 1)
          pieceMessageRange = '15'
          break

        case 20:
          listValidy.splice(listValidy.indexOf(15), 1)
          listValidy.splice(listValidy.indexOf(20), 1)
          listValidy.splice(listValidy.indexOf(30), 1)
          pieceMessageRange = '10'
          break

        case 30:
          listValidy.splice(listValidy.indexOf(10), 1)
          listValidy.splice(listValidy.indexOf(15), 1)
          listValidy.splice(listValidy.indexOf(20), 1)
          listValidy.splice(listValidy.indexOf(30), 1)
          break

        default:
          break
      }

      this.messageRange =
        qtdDaysEnjoed === 30
          ? 'Este periodo atingiu a quantidade máxima de dias de direito solicitado'
          : `Intervalo de dias permitidos: ${pieceMessageRange}`

      this.rangeIsOk = listValidy.includes(diffDate)
    },

    checkDateAcessibles () {
      this.disableDates = this.period.requests.map(item => ({
        start: new Date(item.startDate),
        end: new Date(item.finalDate)
      }))
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
