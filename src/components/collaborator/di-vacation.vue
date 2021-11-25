<template>
  <q-dialog
    v-model="show"
    transition-show="scale"
    transition-hide="scale"
    persistent
    @before-hide="onHide"
  >
    <q-card class="card-vacation">
      <q-toolbar class="text-white shadow-1 bg-green">
        <q-toolbar-title class="flex flex-center">
          <q-icon
            name="far fa-user"
            class="q-mr-md"
            color="white"
            size="sm"
            style="display: block;"
          />
          {{ collaborator.name }}
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

      <q-card-section :class="`bg-${period.situation.color} q-pt-sm q-pb-sm`">
        <div class="text-white justify-center flex">
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
      </q-card-section>

      <q-card-section class="flex flex-center text-subtitle1 q-pt-sm q-pb-sm">
        <span :style="{ color: period.situation.color }">
          <q-icon
            size="md"
            :color="period.situation.color"
            :name="period.situation.icon"
          />
          {{ period.situation.tooltip }}
          <q-tooltip
            content-class="bg-grey-1 "
            :offset="[10, 10]"
            :delay="300"
            :content-style="{
              fontSize: '16px',
              border: '2px solid #BDBDBF',
              color: period.situation.color
            }"
          >
            {{ period.situation.description }}
          </q-tooltip>
        </span>
      </q-card-section>

      <q-card-section class="q-ml-xl q-mt-sm q-mr-xl">
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
                Controle de Férias
              </span>
              <p class="subtitle">
                Aqui você pode gerir solicitações de férias de seus
                Colaboradores.
              </p>

              <q-btn
                label="Agendar Férias"
                rounded
                no-caps
                color="green"
                outline
                :disable="checkSolicitation()"
                @click="solicitationVacation"
                size="md"
              />
            </div>

            <div
              class="col-md-7 bg-grey-3 offset-md-1 justify-around"
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
        </div>
      </q-card-section>

      <q-card-section class="q-ml-xl q-mt-lg q-mr-xl">
        <div class="row">
          <div v-if="period.requests.length" class="col-md-5">
            <ul class="caixa-ul" style="overflow: auto; max-height: 30vh;">
              <li
                v-for="item in period.requests"
                :key="item.id"
                class="row justify-between box-li q-ma-sm"
              >
                <div class="row justify-between flex-center">
                  <div class="q-ma-md">
                    <circle-calendar :date="item.startDate" />
                  </div>

                  <div class="column">
                    <q-icon
                      color="grey"
                      size="md"
                      name="eva-arrow-forward-outline"
                    />
                    <span class="text-grey">
                      {{ item.startDate | moment('YYYY') }}
                    </span>
                  </div>

                  <div class="q-ma-md">
                    <circle-calendar :date="item.finalDate" />
                  </div>

                  <div class="q-ma-md ">
                    <span class="texto">Férias</span>
                    <br />
                    <span>
                      {{
                        moment(item.finalDate).diff(
                          moment(item.startDate),
                          'days'
                        )
                      }}
                      dias
                    </span>
                  </div>
                </div>

                <div
                  v-if="item.status !== status.REQUESTED"
                  class="float-right"
                >
                  <q-chip
                    clickable
                    :color="
                      item.status === status.APPROVED ? 'green-13' : 'red'
                    "
                    text-color="white"
                  >
                    {{
                      item.status === status.APPROVED ? 'Aprovado' : 'Recusado'
                    }}
                  </q-chip>
                </div>

                <div class="q-ma-md" v-if="item.status === status.REQUESTED">
                  <q-btn
                    color="red"
                    round
                    flat
                    push
                    @click="alterStatusVacation(item, status.REFUSED)"
                    icon="eva-close-circle-outline"
                  >
                    <q-tooltip>Rejeitar</q-tooltip>
                  </q-btn>
                  <q-btn
                    class="q-ml-sm"
                    color="green-13"
                    round
                    push
                    @click="alterStatusVacation(item, status.APPROVED)"
                    icon="eva-checkmark-circle-outline"
                  >
                    <q-tooltip>Aprovar</q-tooltip>
                  </q-btn>
                </div>

                <div v-if="item.status !== status.REQUESTED">
                  <q-btn
                    class="q-ml-sm"
                    color="grey"
                    round
                    flat
                    icon="eva-more-vertical-outline"
                  >
                    <q-tooltip>Aprovar</q-tooltip>

                    <q-menu
                      transition-show="jump-down"
                      transition-hide="jump-up"
                    >
                      <q-list style="min-width: 100px">
                        <q-item clickable>
                          <q-item-section>Alterar Status</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>

                          <q-menu anchor="top end" self="top start">
                            <q-list>
                              <q-item
                                dense
                                clickable
                                @click="
                                  alterStatusVacation(
                                    item,
                                    item.status === status.REFUSED
                                      ? status.APPROVED
                                      : status.REFUSED
                                  )
                                "
                              >
                                <q-item-section
                                  v-if="item.status === status.REFUSED"
                                >
                                  Aprovar
                                </q-item-section>
                                <q-item-section v-else>Recusar</q-item-section>
                              </q-item>
                              <q-item
                                dense
                                clickable
                                @click="
                                  alterStatusVacation(item, status.REQUESTED)
                                "
                              >
                                <q-item-section>Aguardar</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item clickable @click="excluirVacationRequest(item)">
                          <q-item-section>Excluir</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </li>
            </ul>
          </div>

          <div v-else class="col-md-6">
            <q-img src="~src/statics/calendar.png" style="max-width: 285px;" />
            <br />
            <span style="color: #999999" class="text-subtitle1">
              Não há nenhuma solicitação de férias agendadas
            </span>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <di-vacation-solicitation
      ref="solicitationVacation"
      @on-close="setPeriod('current')"
    />
  </q-dialog>
</template>

<script>
import moment from 'moment'
import { status } from 'src/enumerator/status.js'
import circleCalendar from 'src/components/common/circleCalendar.vue'
import diVacationSolicitation from './di-vacation-solicitation.vue'

export default {
  name: 'di-vacation-request',

  events: ['on-close'],

  components: {
    circleCalendar,
    diVacationSolicitation
  },

  data () {
    return {
      show: false,
      moment,
      status,
      collaborator: {},
      situation: {},
      period: { situation: {}, requests: [] }
    }
  },

  mounted () {},

  methods: {
    onShow (collab) {
      if (!collab) return

      this.collaborator = { ...collab }
      this.situation = {
        ...collab.situation
      }

      this.getPeriod()

      this.show = true
    },

    onHide () {
      this.$emit('on-close')
      this.show = false
    },

    async getPeriod () {
      try {
        const { data } = await this.$axios.get(
          this.$api.period.replace('{id}', this.collaborator.id)
        )
        this.period = { ...data }
      } catch (e) {
        console.log(e)
      }
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
    }
  }
}
</script>

<style lang="stylus">
.card-vacation
  max-width: 90vw
  min-width: 80vw
  min-height: 80vh
  max-height: 120vh

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
