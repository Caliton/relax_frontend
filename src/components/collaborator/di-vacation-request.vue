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
          {{ this.collaborator.name }}
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
          <q-btn
            round
            flat
            dense
            class="q-mr-md"
            @click="setPeriod('previous')"
            icon="eva-chevron-left-outline"
          />

          <span
            class="text-weight-medium flex-center flex q-pa-sm"
            style="font-size: 1.3rem"
          >
            {{ period.start | moment('DD-MM-YYYY') }}
            à
            {{ period.end | moment('DD-MM-YYYY') }}
          </span>

          <q-btn
            round
            flat
            dense
            @click="setPeriod('next')"
            class="q-ml-md"
            icon="eva-chevron-right-outline"
          />
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
                    {{ period.daysEnjoyed }}
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

          <div class="row">
            <q-btn
              label="Agendar Férias"
              rounded
              no-caps
              color="green"
              outline
              size="md"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-ml-xl q-mt-lg q-mr-xl">
        <div class="row">
          <div v-if="period.requests.length" class="col-md-5">
            <ul
              class="caixa-ul"
              style="overflow: auto; max-height: 400px; transform"
            >
              <li
                v-for="item in period.requests"
                :key="item.id"
                class="rows box-li q-ma-sm"
              >
                <div class="inline-block q-ma-md">
                  <div
                    style="width: 50px; height: 50px; border-radius: 20px; background-color: #f2f4f5; text-align: center; overflow: hidden; transition: background .2s ease-in-out;"
                  >
                    <div
                      style="font-size: 8px; height: 15px; line-height: 15px; background-color: #d83556; font-weight: 600; color: white; text-transform: uppercase"
                    >
                      {{ getMonth(parseInt(item.startDate.split('-')[1])) }}
                    </div>
                    <div
                      style="font-size: 16px; height: 35px; line-height: 30px; color #1c242b; font-weight: 500"
                    >
                      {{ item.startDate | moment('DD') }}
                    </div>
                  </div>
                </div>

                <div class="inline-block flex">
                  <q-icon
                    class="flex flex-center"
                    color="grey"
                    size="md"
                    name="eva-arrow-forward-outline"
                  />
                </div>

                <div class="q-ma-md inline-block">
                  <div
                    style="width: 50px; height: 50px; border-radius: 20px; background-color: #f2f4f5; text-align: center; overflow: hidden; transition: background .2s ease-in-out;"
                  >
                    <div
                      style="font-size: 8px; height: 15px; line-height: 15px; background-color: #d83556; font-weight: 600; color: white; text-transform: uppercase"
                    >
                      {{ getMonth(parseInt(item.finalDate.split('-')[1])) }}
                    </div>
                    <div
                      style="font-size: 16px; height: 35px; line-height: 30px; color #1c242b; font-weight: 500"
                    >
                      {{ item.finalDate | moment('DD') }}
                    </div>
                  </div>
                </div>

                <div class="q-ma-md inline-block">
                  <span class="texto">Férias</span>
                  <br />
                  <span
                    >{{
                      moment(item.finalDate).diff(
                        moment(item.startDate),
                        'days'
                      )
                    }}
                    dias</span
                  >
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
    <!-- <q-dialog v-model="showDeletePeriodo" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="eva-trash-2-outline" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir o Período?</span>
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
            label="Sim!"
            color="red"
            @click="deletePeriodo"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-dialog>
</template>

<script>
import moment from 'moment'

export default {
  name: 'di-vacation-request',

  events: ['on-close'],

  data () {
    return {
      show: false,
      moment,
      collaborator: {},
      situation: {},
      requests: [
        {
          id: '48e8a09f-bb2d-4637-9240-a5729c3b1c3a',
          startDate: '2021-03-01',
          finalDate: '2021-03-31',
          status: 'requested'
        },
        {
          id: '48e8a09f-b32d-4637-9240-a5729c3b1c3a',
          startDate: '2021-03-01',
          finalDate: '2021-03-31',
          status: 'requested'
        },
        {
          id: '48e8a09f-bb2d-4a37-9240-a5729c3b1c3a',
          startDate: '2021-03-01',
          finalDate: '2021-03-31',
          status: 'requested'
        },
        {
          id: '48e8a09f-bb2d-4637-9240-a5729c3b1c3a',
          startDate: '2021-03-01',
          finalDate: '2021-03-31',
          status: 'requested'
        },
        {
          id: '48e8a09f-b32d-4637-9240-a5729c3b1c3a',
          startDate: '2021-03-01',
          finalDate: '2021-03-31',
          status: 'requested'
        },
        {
          id: '48e8a09f-bb2d-4a37-9240-a5729c3b1c3a',
          startDate: '2021-03-01',
          finalDate: '2021-03-31',
          status: 'requested'
        }
      ],
      period: { situation: {}, requests: [] }
    }
  },

  mounted () {},

  methods: {
    onShow (collab) {
      console.log(collab)
      if (!collab) return

      this.collaborator = { ...collab }
      this.situation = {
        ...collab.situation,
        start: '2021-01-01',
        end: '2022-01-01'
      }

      this.getPeriod()

      this.show = true
    },

    async getPeriod () {
      try {
        const { data } = await this.$axios.get(
          this.$api.period.replace('{id}', this.collaborator.id)
        )
        console.log(data)
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

        default:
          return 'erro'
      }

      const { data } = await this.$axios(
        this.$api.getPeriodbyYear.replace('{id}', this.collaborator.id),
        { params: { year } }
      )

      this.period = { ...data }
    },

    onHide () {
      this.show = false
    },

    getMonth (item) {
      item--
      return 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_')[item]
    }
  }
}
</script>

<style lang="stylus">
.card-vacation
  max-width: 72vw
  min-width: 72vw
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
  cursor: pointer;
  border-radius: 30px;
  background-color: white;
  list-style-type: none;
  align-items: center;
  border: 1px solid #dfe3e6;
}

.box-li:hover {
  background-color: #f2f4f5;
}

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
  // border: 1px solid #dfe3e6;
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
