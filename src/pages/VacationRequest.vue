<template>
  <q-page class=" min-height">
    <q-card class="card-vacation" flat>
      <q-card-section class="q-ml-md q-mt-sm q-mr-xl">
        <div style="width: 100%">
          <div class="row">
            <div class="col-md-4" style="display: block">
              <q-icon
                name="eva-calendar-outline"
                color="primary"
                size="md"
                style="display: block;"
              />
              <span
                style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif"
              >
                Olá
                {{ collaborator.name.split(' ')[0] }}
              </span>
              <p class="subtitle">
                Aqui você pode agendar suas férias com seu gestor.
              </p>

              <q-btn
                label="Solicitar suas férias"
                rounded
                no-caps
                color="green"
                outline
                :disable="checkSolicitation()"
                @click="solicitationVacation"
                size="md"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-mt-md q-pt-sm q-pb-sm">
        <div class="col-md-12">
          <div
            class="justify-center flex text-white q-mb-sm"
            style="border-radius: 1rem"
            :style="{
              color: `${
                isHexColor(period.situation.color) ? period.situation.color : ''
              } !important`
            }"
            :class="
              `bg-${
                !isHexColor(period.situation.color)
                  ? period.situation.color
                  : ''
              }`
            "
          >
            <div class="q-pa-sm">
              <q-btn
                round
                flat
                dense
                :disable="
                  moment(period.start).year() - 1 <
                    moment(collaborator.hiringdate).year()
                "
                @click="setPeriod('previous')"
                icon="eva-chevron-left-outline"
              />
            </div>

            <div>
              <span
                class="text-weight-medium flex-center flex q-pa-sm"
                style="font-size: 1.3rem"
              >
                {{ period.start | moment('DD-MM-YYYY') }}
                à
                {{ period.end | moment('DD-MM-YYYY') }}
              </span>
            </div>

            <div class="q-pa-sm">
              <q-btn
                round
                flat
                dense
                @click="setPeriod('next')"
                icon="eva-chevron-right-outline"
              />
            </div>
          </div>

          <div class="row ">
            <div
              class="justify-center flex col-md-12 flex-center q-ml-md q-mr-sm"
            >
              <q-icon
                size="sm"
                class="q-mr-sm"
                :style="{
                  color: `${
                    isHexColor(period.situation.color)
                      ? period.situation.color
                      : ''
                  } !important`
                }"
                :color="
                  `${
                    !isHexColor(period.situation.color)
                      ? period.situation.color
                      : ''
                  }`
                "
                :name="period.situation.icon"
              />

              <span
                class="text-subtitle2"
                :style="{
                  color: `${
                    isHexColor(period.situation.color)
                      ? period.situation.color
                      : ''
                  } !important`
                }"
                :class="
                  `text-${
                    !isHexColor(period.situation.color)
                      ? period.situation.color
                      : ''
                  }`
                "
              >
                {{ period.situation.tooltip }}
                <q-tooltip
                  :offset="[10, 10]"
                  :delay="300"
                  :content-style="{
                    fontSize: '16px',
                    border: '2px solid #BDBDBF',
                    color: `${
                      isHexColor(period.situation.color)
                        ? period.situation.color
                        : ''
                    } !important`
                  }"
                  :content-class="
                    `bg-grey-1 text-${
                      !isHexColor(period.situation.color)
                        ? period.situation.color
                        : ''
                    }`
                  "
                >
                  {{ period.situation.description }}
                </q-tooltip>
              </span>
            </div>

            <div class="flex flex-center "></div>
          </div>
        </div>

        <q-space class="q-pa-lg" />
        <div class="row">
          <div class="col-md-6">
            <div v-if="period.requests.length" class="col-md-5">
              <ul class="caixa-ul" style="overflow: auto; max-height: 30vh;">
                <li
                  v-for="request in period.requests"
                  :key="request.id"
                  class="row justify-between box-li q-ma-sm"
                >
                  <div class="row justify-between flex-center">
                    <div class="q-ma-md">
                      <circle-calendar :date="request.startDate" />
                    </div>

                    <div class="column">
                      <q-icon
                        color="grey"
                        size="md"
                        name="eva-arrow-forward-outline"
                      />
                      <span class="text-grey">
                        {{ request.startDate | moment('YYYY') }}
                      </span>
                    </div>

                    <div class="q-ma-md">
                      <circle-calendar :date="request.finalDate" />
                    </div>

                    <div class="q-ma-md ">
                      <span class="texto">Férias</span>
                      <br />
                      <span>
                        {{
                          moment(request.finalDate).diff(
                            moment(request.startDate),
                            'days'
                          ) + 1
                        }}
                        dias
                      </span>
                    </div>
                  </div>

                  <div class="text-grey">
                    {{
                      request.approvalVacation.filter(el =>
                        [status.APPROVED, status.REFUSED].includes(el.status)
                      ).length
                    }}/2

                    <q-tooltip>Solicitações respondidas</q-tooltip>
                  </div>

                  <div class="float-right">
                    <q-chip
                      clickable
                      :color="setColor(request.status)"
                      text-color="white"
                    >
                      {{ setLabel(request.status) }}
                    </q-chip>
                  </div>

                  <div>
                    <q-btn
                      v-show="
                        request.status !== status.APPROVED &&
                          request.status !== status.REFUSED
                      "
                      class="q-ml-sm"
                      color="grey"
                      round
                      flat
                      icon="eva-more-vertical-outline"
                    >
                      <q-menu
                        transition-show="jump-down"
                        transition-hide="jump-up"
                      >
                        <q-list style="min-width: 100px">
                          <q-item
                            clickable
                            @click="excluirVacationRequest(request)"
                          >
                            <q-item-section>Excluir</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </li>
              </ul>
            </div>

            <div v-else class="column flex-center">
              <q-img
                src="~src/statics/calendar.png"
                style="max-width: 285px;"
              />
              <br />
              <span style="color: #999999" class="text-subtitle1">
                Não há nenhuma solicitação de férias agendadas
              </span>
            </div>
          </div>

          <div
            class="col-md-6 bg-grey-3 "
            style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif; border-radius: .5rem; border: 1px solid #BDBDBF; transform: scale(.8);"
          >
            <div class="q-pa-sm text-center text-subtitle1">
              <span
                v-if="period.limitEnterprise"
                :style="{ color: period.situation.color }"
              >
                Período
                {{ period.start | moment('DD-MM-YYYY') }} ao
                {{ period.end | moment('DD-MM-YYYY') }}
              </span>
            </div>

            <q-separator inset />

            <div
              class="text-center text-weight-regular"
              style="font-size: 1.2rem"
            >
              Dias de direito
            </div>

            <div class="row justify-evenly">
              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">{{
                  period.daysAllowed
                }}</span>
                <span class="text-weight-regular text-h6">Totais</span>
              </div>

              <q-separator vertical inset />

              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">
                  {{ period.daysBalance }}
                </span>
                <span class="text-weight-regular text-h6">
                  Disponíveis
                </span>
              </div>

              <q-separator vertical inset />

              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">
                  {{ period.daysScheduled }}
                </span>
                <span class="text-weight-regular text-h6">
                  Agendados
                </span>
              </div>

              <q-separator vertical inset />

              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">
                  {{ period.daysEnjoyed }}
                </span>
                <span class="text-weight-regular text-h6">
                  Usufruidos
                </span>
              </div>
            </div>

            <q-separator inset />

            <div class="q-pa-sm text-center text-subtitle1">
              <span
                v-if="period.limitEnterprise"
                :style="{ color: period.situation.color }"
              >
                Prazo limite com 6 meses
                {{ period.limitEnterprise | moment('DD-MM-YYYY') }}
                <br />
                Prazo limite final
                {{ period.ultimate | moment('DD-MM-YYYY') }}
              </span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <di-vacation-solicitation
      ref="solicitationVacation"
      @on-close="setPeriod('current')"
    />
  </q-page>
</template>

<script>
import moment from 'moment'
import { status } from 'src/enumerator/status.js'
import circleCalendar from 'src/components/common/circleCalendar.vue'
import diVacationSolicitation from 'src/components/collaborator/di-vacation-solicitation.vue'

export default {
  name: 'vacationRequest',

  events: ['on-close'],

  components: {
    circleCalendar,
    diVacationSolicitation
  },

  data () {
    return {
      moment,
      status,
      collaborator: {
        id: localStorage.getItem('user_collaborator_id'),
        name: localStorage.getItem('user_name'),
        hiringdate: localStorage.getItem('user_hiringdate')
      },
      situation: {},
      period: { situation: {}, requests: [] }
    }
  },

  mounted () {
    this.getPeriod()
  },

  methods: {
    async getPeriod () {
      try {
        const { data } = await this.$axios.get(
          this.$api.period.replace('{id}', this.collaborator.id)
        )
        this.period = { ...data }

        this.period.requests = this.period.requests.map(el => ({
          ...el,
          status: this.handleStatus(el.approvalVacation)
        }))
      } catch (e) {
        console.log(e)
      }
    },

    handleStatus (approvalVacations) {
      if (!approvalVacations.length) return status.REQUESTED

      const getApproved = approvalVacations.filter(
        el => el.status === status.APPROVED
      ).length

      const getRefused = approvalVacations.filter(
        el => el.status === status.REFUSED
      ).length

      if (getRefused > 0) return status.REFUSED

      if (getApproved === 2) return status.APPROVED

      return status.REQUESTED
    },

    async setPeriod (op) {
      let year = moment(this.period.start)
        .clone()
        .year()

      switch (op) {
        case 'next':
          year++
          break

        case 'previous':
          year--
          break

        case 'current':
          break

        default:
          return false
      }

      const { data } = await this.$axios.get(
        this.$api.getPeriodbyYear.replace('{id}', this.collaborator.id),
        { params: { year } }
      )

      this.period = { ...data }

      this.period.requests = this.period.requests.map(el => ({
        ...el,
        status: this.handleStatus(el.approvalVacation)
      }))
    },

    async excluirVacationRequest (request) {
      try {
        this.loading = true
        await this.$axios.delete(
          this.$api.vacationrequest.replace('{id}', request.id)
        )
        this.setPeriod('current')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    async alterStatusVacation (request, status) {
      try {
        this.loading = true
        const sendStatus = {
          id: request.id,
          status
        }

        await this.$axios.post(this.$api.vacationstatus, sendStatus)

        this.setPeriod('current')
        request.status = status
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    solicitationVacation () {
      this.$refs.solicitationVacation.onShow({
        period: this.period,
        collaborator: this.collaborator
      })
    },

    checkSolicitation () {
      let noCan = true

      noCan = this.period.daysBalance === 0

      return noCan
    },

    isHexColor (a) {
      let b = false

      if (a) b = a.includes('#')

      return b
    },

    setColor (sta) {
      let color = ''
      switch (sta) {
        case status.APPROVED:
          color = 'green-13'
          break

        case status.REQUESTED:
          color = 'amber-13'
          break

        case status.REFUSED:
          color = 'red'
          break

        default:
          color = 'grey'
          break
      }

      return color
    },

    setLabel (sta) {
      let label = ''
      switch (sta) {
        case status.APPROVED:
          label = 'Aprovado'
          break

        case status.REQUESTED:
          label = 'Aguardando'
          break

        case status.REFUSED:
          label = 'Recusado'
          break

        default:
          label = 'indefinido'
          break
      }

      return label
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-vacation
  width: 95%
  background-color: #FAFAFA !important

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

.caixa {
  box-sizing: border-box;
  font-family: Avenir Next W01, Helvetica, Arial, sans-serif;
  background-color: #fff;
  display: flex;
  border-radius: 15px;
  align-items: center;
  padding: 25px 30px;
  width: 100%;
  height: 100%;
}

.box-li {
  box-sizing: border-box;
  // cursor: pointer;
  border-radius: 30px;
  background-color: white;
  list-style-type: none;
  align-items: center;
  border: 1px solid #dfe3e6;
}

// .box-li:hover {
//   background-color: #f2f4f5;
// }

.inline-block {
  display: inline-block;
}

.texto {
  color: #1c242b;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
  line-height: 25px;
}

.caixa-ul {
  padding: 0;
  // border: 1px sol100#dfe3e6;
  border-radius: 15px;
  overflow: hidden;
}

    /* width */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: none;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #c4c4c4;
    width: 5px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #a9a9a9;
  }
</style>
