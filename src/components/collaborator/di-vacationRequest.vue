<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale" persistent @before-hide="onHideDialog">
    <q-card style="max-width: 70vw; min-width: 60vw; min-height: 80vh">
      <q-toolbar class="text-white shadow-1 bg-green">
        <q-toolbar-title class="flex flex-center">
          <q-icon name="far fa-user" class="q-mr-md" color="white" size="sm" style="display: block;"/>
          {{ this.colaborator.name }}
        </q-toolbar-title>
        <q-btn class="float-right" flat round dense icon="close" @click="canceled" />
      </q-toolbar>
      
      <q-card-section
        class="bg-green flex flex-center q-pt-sm q-pb-sm"
        :style="[{'background-color': vacationSelected.limitDate < moment().format('YYYY-MM-DD')? '#F44336 !important': ''}]"
      >
        <div class="text-white">
          <div class="row" v-if="this.vacationsCombo.length > 0">
            <q-btn :disable="!(this.number > 0)" @click="setLeftPeriodo" color="white" round flat size="md" class="q-mr-md" icon="eva-chevron-left-outline"/>
            <span class="text-weight-medium flex-center flex" style="font-size:1.3rem;">{{this.vacationsCombo[this.number].label}}</span>
            <q-btn :disable="!(this.number < this.vacationsCombo.length -1)" @click="setRightPeriodo" color="white" round flat size="md" class="q-ml-md" icon="eva-chevron-right-outline"/>
          </div>

          <div v-else class="row">
            <q-btn label="Cadastrar Período" no-caps color="white" rounded outline size="md" class="q-ml-md">
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
          </div>

        </div>
      </q-card-section>
      
      <q-card-section class="flex flex-center q-pt-sm q-pb-sm text-subtitle1">
        <span v-if="this.colaborator.status === 'CRITICO'" style="color: red">
        {{getNameStatus(this.colaborator.status)}}.
        </span>
      </q-card-section>

      <q-card-section class="q-ml-xl q-mt-lg q-mr-xl">
        <div style="width: 100%">
          <div class="row">
            <div class="col-md-4" style="display: block">
              <q-icon name="eva-calendar-outline" color="primary" size="md" style="display: block;"/>
              <span style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif">Controle de Férias</span>
              <p class="subtitle">Aqui você pode gerir solicitações de férias de seus Colaboradores.</p>
            </div>


            <div
              class="col-md-7 bg-grey-3 offset-md-1 row justify-around"
              style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif; border-radius: .5rem; border: 1px solid #BDBDBF; transform: scale(.8);"
            >
              
              <div class="column justify-center text-center" style="transform: scale(.9);">
                <span style="display: inline-block;"> {{vacationSelected.daysAllowed}} </span>
                <span class="text-weight-regular text-h6">Dias Totais</span>
              </div>

              <q-separator vertical inset />

              <div class="column justify-center text-center" style="transform: scale(.9);">
                <span style="display: inline-block;"> {{vacationSelected.daysBalance}} </span>
                <span class="text-weight-regular text-h6">Dias Disponíveis</span>
              </div>

              <q-separator vertical inset />

              <div class="column justify-center text-center" style="transform: scale(.9);">
                <span style="display: inline-block;"> {{vacationSelected.daysEnjoyed}}</span>
                <span class="text-weight-regular text-h6">Dias Tirados</span>
              </div>

              <q-separator inset />

              <div class="q-pa-sm text-subtitle1">
                <span :style="[{'color': vacationSelected.limitDate < moment().format('YYYY-MM-DD')? 'red': ''}]">
                Prazo limite {{vacationSelected.limitDate | moment('DD-MM-YYYY') }}
                </span>
              </div>

            </div>
          </div>

          <div class="row">
            <q-btn :disable="!(this.vacationsCombo.length > 0)" label="Solicitar Férias" @click="solicitationVacation" rounded no-caps color="green" outline size="md" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-ml-xl q-mt-lg q-mr-xl">
        <div class="row">
          <div v-if="listRequests.length > 0" class="col-md-5">
            <ul class="caixa-ul " style="overflow: auto; max-height: 400px; transform">
              <li v-for="item in listRequests" :key="item.i" class="rows caixa-li">
                <div class="teste q-ma-md">
                  <div style="width: 50px; height: 50px; border-radius: 20px; background-color: #f2f4f5; text-align: center; overflow: hidden; transition: background .2s ease-in-out;">
                    <div style="font-size: 8px; height: 15px; line-height: 15px; background-color: #d83556; font-weight: 600; color: white; text-transform: uppercase">
                      {{getMonth(new Date(item.startDate).getMonth())}}
                    </div>
                    <div style="font-size: 16px; height: 35px; line-height: 30px; color #1c242b; font-weight: 500">
                      {{item.startDate | moment('DD')}}
                    </div>
                  </div>
                </div>

                <div class="teste flex">
                  <q-icon class="flex flex-center" color="grey" size="md" name="eva-arrow-forward-outline" />
                </div>

                <div class="q-ma-md teste">
                  <div style="width: 50px; height: 50px; border-radius: 20px; background-color: #f2f4f5; text-align: center; overflow: hidden; transition: background .2s ease-in-out;">
                    <div style="font-size: 8px; height: 15px; line-height: 15px; background-color: #d83556; font-weight: 600; color: white; text-transform: uppercase">
                      {{getMonth(new Date(item.finalDate).getMonth())}}
                    </div>
                    <div style="font-size: 16px; height: 35px; line-height: 30px; color #1c242b; font-weight: 500">
                      {{item.finalDate | moment('DD')}}
                    </div>
                  </div>
                </div>

                <div class="q-ma-md teste">
                  <span class="texto">Férias</span>
                  <br>
                  <span>{{item.days}} dias</span>
                </div>
              </li>
            </ul>

          </div>

          <div v-else class="col-md-6">
            <q-img src="~src/statics/calendar.png" style="max-width: 300px;" />
            <br>
            <span v-if="this.vacationsCombo.length > 0" class="text-subtitle1"> Não foram solicitados nenhuma férias em {{this.vacationsCombo[this.number].label}} </span>
          </div>
        </div>
      </q-card-section>
      <!-- <q-card-section>
        Status:<p :style="[{'color': this.getColor(this.colaborator.status)}, 'font-size: 13pt']">{{getNameStatus(this.colaborator.status)}}</p>
      </q-card-section> -->

      <!-- <q-card-section class="q-ml-xl">
        <div class="row q-gutter-md">
          <div v-if="vacationSelected.id">
            <span :style="[{'color': vacationSelected.limitDate < moment().format('YYYY-MM-DD')? 'red': ''}]">Data Limite:
            {{vacationSelected.limitDate | moment('DD-MM-YYYY') }}
            </span>
            <br />
            <span>Limite com 6 meses:</span>
            {{vacationSelected.limit6Months | moment('DD-MM-YYYY') }}
            <br />
          </div>
        </div>
      </q-card-section> -->

      <!-- <q-card-section>
        <p style="color: #4caf50; font-size: 20pt">Solicitação</p>

        <v-date-picker class v-model="attributes" mode="range" is-inline />
      </q-card-section> -->
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
      
      console.log('asdf');
    })

    EventBus.$on('on-refresh-vacation-request', (data) => {
      this.getRequestSolicitation(this.vacationsCombo[0].value)
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
      slide: 'style',
      vacations: [],
      attributes: [],
      moment: moment,
      number: 0,
      colaborator: {},
      listRequests: [],
      // listRequests: [],
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

    async getRequestSolicitation (idVacation) {
      try {
        console.log('Olha os cara: ', this.vacationsCombo)
        const result = await this.$axios.get(`requests/person/${this.colaborator.id}/vacationtime/${idVacation}/`)
        this.listRequests.splice(0, this.listRequests.length, ...result.data)

        console.log('Resultado: ', result)

      } catch (e) {
        console.log(e);
      }
    },

    setLeftPeriodo () {
      if (this.number > 0) {
        this.number--    
        this.setVacationCombo(this.vacationsCombo[this.number])
      }
    },

    setRightPeriodo () {
      if (this.number < this.vacationsCombo.length -1) {
        this.number++
        this.setVacationCombo(this.vacationsCombo[this.number])
      }
    },

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

    solicitationVacation () {
      this.vacationSelected.personId = this.personId
      EventBus.$emit('on-new-days-off', this.vacationSelected)
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

        this.vacationsCombo = []
        this.vacations = result.data

        result.data.forEach((item) => {
          this.vacationsCombo.push({ label: item.vacationDate.split('-')[0], value: item.id })
        })

        

        if(this.vacationsCombo.length > 0) {
          this.setVacationCombo(this.vacationsCombo[this.number])
          this.getRequestSolicitation(this.vacationsCombo[this.number].value)
        }

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
          color = '#4CAF50'
          break
        case 'MEDIO':
          color = 'orange'
          break
        case 'CRITICO':
          color = '#F44336'
          break
        case 'INDEFINIDO':
          color = '#BDBDBD'
          break

        default:
          color = 'grey'
          break
      }
      return color
    },

    getMonth (item) {
      return 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_')[item]
    },

    getNameStatus (item) {
      let statusName = ''

      switch (item) {
        case 'NORMAL':
          statusName = 'Este colaborador se encontra em uma situação normal'
          break
        case 'MEDIO':
          statusName = 'Esta colaborador esta se aproximando do prazo limite para usufruir suas férias ( 1 mês )'
          break
        case 'CRITICO':
          statusName = 'Este colaborador precisa urgênte usufruir de suas férias, pois ultrapassou o tempo limite de 1 ano e 6 meses'
          break
        case 'INDEFINIDO':
          statusName = 'Este colaborador não teve seu periodo anual criado, clique em cadastrar período'
          break

        default:
          statusName = 'Situação não identificado'
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

.caixa {
  box-sizing: border-box;
  font-family: Avenir Next W01,Helvetica,Arial,sans-serif;
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
  background-color: #f2f4f5
}

.teste {
  display: inline-block
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
