<template>
  <q-dialog
    v-model="show"
    transition-show="scale"
    transition-hide="scale"
    style="height: auto !important"
    :full-width="maximize"
    :full-height="maximize"
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
          v-if="maximize"
          flat
          round
          dense
          icon="eva-minus-outline"
          @click="maximize = false"
        />

        <q-btn
          v-else
          class="float-right"
          flat
          round
          dense
          icon="eva-square-outline"
          @click="maximize = true"
        />

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
          <div
            class="q-pa-md flex flex-center"
            :class="{ 'col-md-6': maximize, 'col-md-4': !maximize }"
          >
            <v-date-picker
              :min-date="period.start"
              v-model="rangeDate"
              :columns="maximize ? 2 : 1"
              :rows="maximize ? 2 : 1"
              :is-expanded="$screens({ default: true, lg: false })"
              is-range
              is-inline
              mode="range"
              :attributes="attrs"
              :color="rangeIsOk ? 'green' : 'red'"
              :disabled-dates="disableDates"
            />
          </div>
          <div
            class="q-pa-md"
            :class="{
              'flex flex-center': !rangeIsNotNull || maximize,
              'col-md-6': maximize,
              'col-md-7': !maximize
            }"
          >
            <div
              class="q-pa-md"
              style="border-radius: .5rem; border: 1px solid #BDBDBF; width: 100%"
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
        </div>
      </q-card-section>

      <q-card-actions class="text-teal container-card absolute-bottom-right">
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
      maximize: false,
      period: {},
      vacation: {},
      collaborator: {},
      disableDates: [],
      rangeIsOk: false,
      moment,
      messageRange: '',
      rangeDate: { start: null, end: null },
      holidayNational: [],
      attrs: []
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
        return this.diffRange(this.rangeDate.start, this.rangeDate.end)
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
      this.period = {}
      this.rangeDate = { start: null, end: null }
      this.collaborator = {}

      this.show = true

      this.period = { ...data.period }
      this.collaborator = { ...data.collaborator }

      this.attrs = []

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

    async checkDateAcessibles () {
      this.disableDates = this.period.requests
        .filter(a => a.status !== status.REFUSED)
        .map(item => ({
          start: new Date(moment(item.startDate).format('YYYY/MM/DD')),
          end: new Date(moment(item.finalDate).format('YYYY/MM/DD'))
        }))

      function setColor (sta) {
        let color = ''
        switch (sta) {
          case status.APPROVED:
            color = 'green'
            break

          case status.REQUESTED:
            color = 'orange'
            break

          case status.REFUSED:
            color = 'red'
            break

          default:
            color = 'grey'
            break
        }
        return color
      }

      function setLabel (sta) {
        let color = ''
        switch (sta) {
          case status.APPROVED:
            color = 'intervalo Aprovada'
            break

          case status.REQUESTED:
            color = 'intervalo Solicitada'
            break

          case status.REFUSED:
            color = 'intervalo Recusado'
            break

          default:
            color = 'data solicitado'
            break
        }
        return color
      }

      const disableDates = this.period.requests
        .filter(a => a.status !== status.REFUSED)
        .map(item => ({
          popover: {
            label: setLabel(item.status),
            visibility: 'hover',
            hideIndicator: true
          },

          highlight: {
            color: setColor(item.status),
            fillMode: 'light'
          },

          dates: {
            start: new Date(moment(item.startDate).format('YYYY/MM/DD')),
            end: new Date(moment(item.finalDate).format('YYYY/MM/DD'))
          }
        }))

      disableDates.forEach(item => {
        this.attrs.push(item)
      })

      const { data: holidayNational } = await this.$axios.get(
        this.$api.holidayAll.replace('{year}', moment(this.period.start).year())
      )

      this.holidayNational = holidayNational

      const listDateDot = holidayNational.map(
        a => new Date(moment(a.date).format('YYYY/MM/DD'))
      )

      const dots = {
        dot: true,
        dates: listDateDot
      }

      this.attrs.push(dots)

      holidayNational.forEach(a => {
        this.attrs.push({
          dates: new Date(moment(a.date).format('YYYY/MM/DD')),
          popover: {
            label: a.name
          }
        })
      })
    },

    countDaysSolicited () {
      if (!this.period.requests.length) return 0
      return this.period.requests
        .filter(item => item.status !== status.REFUSED)
        .map(item => this.diffRange(item.startDate, item.finalDate))
        .reduce((a, b) => a + b)
    },

    diffRange (init, final) {
      return moment(final).diff(moment(init), 'd') + 1
    },

    checkRangeDate () {
      if (!this.rangeDate || !this.rangeDate.start || !this.rangeDate.end) {
        return false
      }

      const { start, end } = this.rangeDate

      const isSelectFimdeSemana =
        moment(start).weekday() === 5 || moment(start).weekday() === 6

      const isSelectHoliday = this.holidayNational.some(
        a =>
          moment(a.date)
            .subtract(2, 'd')
            .format('YYYY-MM-DD') === moment(start).format('YYYY-MM-DD') ||
          moment(a.date)
            .subtract(1, 'd')
            .format('YYYY-MM-DD') === moment(start).format('YYYY-MM-DD')
      )

      if (isSelectFimdeSemana) {
        this.messageRange =
          'Não é possível iniciar as férias dois dias antes de domingo'

        this.rangeIsOk = false

        return this.rangeIsOk
      }

      if (isSelectHoliday) {
        this.messageRange =
          'Não é possível iniciar as férias dois dias antes de um feriado'

        this.rangeIsOk = false

        return this.rangeIsOk
      }

      const diffDate = this.diffRange(start, end)
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

    isHexColor (a) {
      let b = false

      if (a) b = a.includes('#')

      return b
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
