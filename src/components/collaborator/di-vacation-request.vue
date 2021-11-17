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

      <q-card-section :class="`bg-${situation.color} q-pt-sm q-pb-sm`">
        <div class="text-white justify-center flex">
          <q-btn
            round
            flat
            dense
            class="q-mr-md"
            icon="eva-chevron-left-outline"
          />

          <span
            class="text-weight-medium flex-center flex"
            style="font-size: 1.3rem"
          >
            {{ situation.start | moment('DD-MM-YYYY') }}
            à
            {{ situation.end | moment('DD-MM-YYYY') }}
          </span>

          <q-btn
            round
            flat
            dense
            class="q-ml-md"
            icon="eva-chevron-right-outline"
          />
        </div>
      </q-card-section>

      <q-card-section class="flex flex-center text-subtitle1 q-pt-sm q-pb-sm">
        <span :style="{ color: situation.color }">
          <q-icon size="md" :color="situation.color" :name="situation.icon" />
          {{ situation.tooltip }}
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
              class="col-md-7 bg-grey-3 offset-md-1 row justify-around"
              style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif; border-radius: .5rem; border: 1px solid #BDBDBF; transform: scale(.8);"
            >
              <div class="q-pa-sm text-subtitle1">
                <span
                  v-if="situation.limitEnterprise"
                  :style="{ color: situation.color }"
                >
                  Período
                  {{ situation.start | moment('DD-MM-YYYY') }} ao
                  {{ situation.end | moment('DD-MM-YYYY') }}
                </span>
              </div>

              <q-separator inset />

              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">{{
                  situation.daysAllowed
                }}</span>
                <span class="text-weight-regular text-h6">Dias Totais</span>
              </div>

              <q-separator vertical inset />

              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">
                  {{ situation.daysBalance }}
                </span>
                <span class="text-weight-regular text-h6">
                  Dias Disponíveis
                </span>
              </div>

              <q-separator vertical inset />

              <div
                class="column justify-center text-center"
                style="transform: scale(.9);"
              >
                <span style="display: inline-block;">
                  {{ situation.daysEnjoyed }}
                </span>
                <span class="text-weight-regular text-h6">Dias Usufruidos</span>
              </div>

              <q-separator inset />

              <div class="q-pa-sm text-subtitle1">
                <span
                  v-if="situation.limitEnterprise"
                  :style="{ color: situation.color }"
                >
                  Prazo limite com 6 meses
                  {{ situation.limitEnterprise | moment('DD-MM-YYYY') }}
                  <br />
                  Prazo limite final
                  {{ situation.ultimate | moment('DD-MM-YYYY') }}
                </span>
              </div>
            </div>
          </div>

          <div class="row">
            <q-btn
              label="Solicitar Férias"
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
          <div v-if="requests.length === 0" class="col-md-6">
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
      requests: []
    }
  },

  mounted () {
    const collab = {
      id: '696b530a-8f3e-4ab4-a01f-c0d392f967b7',
      name: 'Aloisio Augusto Lopes Macedo',
      email: '',
      register: '4690',
      birthday: '2000-01-01',
      hiringdate: '2021-05-10',
      requests: [],
      situation: {
        id: 'f10f0aa0-b6ad-467b-8f09-d17ea2e5f394',
        description: 'NORMAL',
        limitMonths: 12,
        color: 'green',
        icon: 'eva-checkmark-circle-outline',
        tooltip: '1 ano  (tem direito a férias)'
      }
    }
    this.onShow(collab)
  },

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

      this.show = true
    },

    onHide () {
      this.show = false
    }
  }
}
</script>

<style lang="stylus">
.card-vacation
  max-width: 72vw
  min-width: 60vw
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
  align-items: center;
  padding: 25px 30px;
  width: 100%;
  height: 100%;
}

.caixa-li {
  box-sizing: border-box;
  cursor: pointer;
  background-color: white;
  list-style-type: none;
  align-items: center;
  border-bottom: 1px solid #dfe3e6;
}

.caixa-li:hover {
  background-color: #f2f4f5;
}

.teste {
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
  border: 1px solid #dfe3e6;
  border-radius: 5px;
  overflow: hidden;
}
</style>
