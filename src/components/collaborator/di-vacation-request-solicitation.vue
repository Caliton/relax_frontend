<template >
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale" style="height: auto !important">
    <q-card style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto !important">
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">Solicitar Férias</q-toolbar-title>
        <q-btn class="float-right" flat round dense icon="close" @click="canceled" />
      </q-toolbar>


      <q-card-section>
        <div class="row">
            <div class="col-md-4">
              <q-date
                v-model="attributes"
                landscape
                range
              />  
            </div>
            <div
              class="col-md-7 offset-md-1 row justify-around"
              style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif; border-radius: .5rem; border: 1px solid #BDBDBF; transform: scale(.8);"
            >
              <div class="column justify-center text-center" style="transform: scale(.9);">
                <span v-if="attributes.from !== '' && attributes.to !== ''" style="display: inline-block;"> Marcar férias a partir do dia {{attributes.from | moment('DD/MM/YYYY')}} ao dia {{attributes.to | moment('DD/MM/YYYY')}}? </span>
              </div>

              <q-separator inset />

              <div class="q-pa-sm text-subtitle1">
                <span :style="[{'color': info.limitDate < moment().format('YYYY-MM-DD')? 'red': ''}]">
                Prazo limite {{info.limitDate | moment('DD-MM-YYYY') }}
                </span>
              </div>
            </div>
        </div>
      </q-card-section>

      <q-card-actions class="text-teal container-card absolute-bottom-right">
        <q-btn v-if="!this.hideDesfazer" color="red" dense no-caps outline rounded label="Desfazer Solicitação" @click="showDeleteRequest" />
        <q-btn color="primary" dense no-caps outline rounded label="Solicitar" @click="confirm" />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-facebook color="light-blue" />
      </q-inner-loading>
    </q-card>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir a Avaliação?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Vou pensar melhor..." color="grey" v-close-popup />
          <q-btn
            flat
            no-caps
            label="Sim, não quero mais!"
            color="red"
            @click="deleteRequest"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import LoginVue from 'src/pages/Login.vue'

export default {
  name: 'di-vacation-request-solicitation',

  components: {
    'v-date-picker': DatePicker
  },

  created () {
    EventBus.$on('on-edit-days-off', (request) => {
      this.vacationRequest = {}
      this.hideDesfazer = false
      this.vacationRequest.id = request.id
      this.vacationRequest.requestUserId = request.person.id
      this.vacationRequest.vacationTimeId = request.vacationTimeId 

      this.attributes.from = moment(request.startDate, 'YYYY-MM-DD').format('YYYY/MM/DD')
      this.attributes.to = moment(request.finalDate, 'YYYY-MM-DD').format('YYYY/MM/DD')

      this.onShow = true
    })

    EventBus.$on('on-new-days-off', (info) => {

      this.vacationRequest.id = ''
      this.vacationRequest.requestUserId = info.personId
      this.vacationRequest.vacationTimeId = info.id 
      this.attributes = { from: '', to: '' }
      this.onShow = true
    })
  },

  beforeDestroy () {
    EventBus.$off('on-edit-days-off')

    EventBus.$off('on-new-days-off')
  },

  data () {
    return {
      onShow: false,
      loading: false,
      showDelete: false,
      hideDesfazer: true,
      attributes: { from: '', to: '' },
      moment: moment,
      vacationRequest: {},
      info: {},
      myLocale: {
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        firstDayOfWeek: 1
      }
    }
  },

  methods: {
    onShowModal () {
      this.onShow = true
    },

    onHideModal () {
      this.$emit('on-close')
      this.hideDesfazer = true
      this.onShow = false
    },

    showDeleteRequest () {
      this.showDelete = true
    },

    async deleteRequest () {
      try {
        this.loading = true

        await this.$axios.delete(
          `${'/requests/{id}'.replace('{id}', this.vacationRequest.id)}/`
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Solicitação desmarcada com sucesso!'
        })

        EventBus.$emit('on-refresh-vacation-request', this.vacationRequest.requestUserId)
        this.onHideModal()
        
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    async confirm () {
      try {
        this.vacationRequest.startDate = this.attributes.from
        this.vacationRequest.finalDate = this.attributes.to
        

        let axiosFunction = this.$axios.post
        let url = 'requests'

        if (this.vacationRequest.id) {
          url += `/${this.vacationRequest.id}`
          axiosFunction = this.$axios.put
        }

        this.loading = true
        const result = await axiosFunction(url, this.vacationRequest)
        this.loading = false

        EventBus.$emit('on-refresh-vacation-request')
        this.onHideModal()
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },

    validationsFields ()
    {
      if (this.attributes.from === '' || this.attributes.to === '') {
        return false
      }

      return true
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
