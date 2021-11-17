<template>
  <q-dialog v-model="show" persistent>
    <q-card
      style="width: 700px; max-width: 80vw; max-height: 90vh; height: auto"
    >
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center"
          >Importar Períodos</q-toolbar-title
        >
        <q-btn
          class="float-right"
          flat
          round
          dense
          icon="close"
          @click="canceled"
        />
      </q-toolbar>

      <q-card-section>
        <div class="row items-center justify-center">
          <q-icon
            size="2em"
            name="eva-cloud-download-outline"
            color="primary"
          />
          <span class="q-ml-sm"
            >Passo 1) Baixe o Modelo a baixo e preencha-o conforme seu
            Layout!</span
          >
          <!-- <span class="q-ml-sm">Importe a lista dos colaboradores de sua Empresa por aqui!</span> -->
        </div>

        <div class="row items-center justify-center">
          <vue-json-to-csv
            v-if="true"
            :json-data="[{ personId: '', year: '' }]"
            separator=";"
            csv-title="Modelo de períodos"
            :labels="{
              personId: { title: 'matricula' },
              year: { title: 'ano' }
            }"
          >
            <q-btn
              class="q-ma-sm"
              no-caps
              dense
              label="Baixar Modelo!"
              color="secondary"
              icon="eva-cloud-download-outline"
            />
          </vue-json-to-csv>
        </div>
      </q-card-section>

      <q-card-section class="flex flex-center">
        <div class="row justify-center">
          <q-img
            src="~src/statics/new_persons.png"
            style="max-width: 500px; opacity: .8"
          />
        </div>

        <div class="q-mb-lg">
          <q-icon size="2em" name="eva-settings-outline" color="primary" />
          <span class="q-ml-sm"
            >Passo 2) Salve seu Modelo preenchido e arraste-o para esta area
            abaixo!</span
          >
        </div>

        <div class="row justify-center">
          <vue-csv-import
            v-model="csv"
            inputClass="col-md-12 custom-file-input"
            :headers="true"
            :map-fields="['matricula', 'ano']"
            autoMatchFields
            autoMatchIgnoreCase
            @reset-csv="csv = []"
          />
        </div>
      </q-card-section>

      <q-slide-transition>
        <q-card-section v-if="this.failImportation">
          <div v-if="this.csv.length" class="flex flex-center">
            <div class="row">
              <p
                v-if="this.csv.length - this.listFails.length > 0"
                class="text-weight-light"
                style="color: green"
              >
                {{ csv.length - listFails.length }}
                {{
                  csv.length - listFails.length > 1
                    ? 'colaboradores foram inseridos'
                    : 'colaborador foi inserido'
                }}!
              </p>

              <p
                v-if="this.csv.length - this.listFails.length === 0"
                class="text-weight-light"
                style="color: red"
              >
                {{ listFails.length }}
                {{
                  listFails.length > 1
                    ? 'colaboradores tiveram problemas'
                    : 'colaborador teve problema'
                }}!
              </p>

              <p v-else class="text-weight-light" style="color: red">
                ...porém {{ listFails.length }}
                {{
                  listFails.length > 1 ? 'tiveram problemas' : 'teve problema'
                }}!
              </p>
            </div>
          </div>
        </q-card-section>
      </q-slide-transition>

      <q-slide-transition>
        <q-card-section v-if="this.failImportation">
          <div v-if="this.csv.length" class="flex flex-center">
            <div class="row">
              <q-markup-table
                separator="vertical"
                style="max-height: 30vh"
                class="col-12"
              >
                <thead>
                  <tr>
                    <th class="text-left">Linha na Tabela</th>
                    <th class="text-right">Problema Encontrado</th>
                  </tr>
                </thead>
                <tbody v-for="item in listFails" :key="item.name">
                  <tr>
                    <td class="text-left">{{ item.errorLine }}</td>
                    <td class="text-right">{{ item.error }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </q-card-section>
      </q-slide-transition>

      <q-card-actions align="right">
        <q-btn
          flat
          no-caps
          label="Fechar"
          color="grey"
          v-close-popup
          @click="refresh"
        />
        <q-btn
          color="green"
          :disable="this.csv.length === 0 || this.failImportation"
          :loading="loading"
          no-caps
          icon="send"
          label="Enviar"
          @click="confirm"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import VueJsonToCsv from 'vue-json-to-csv'
import VueCsvImport from 'src/components/common/VueCsvImport'
import api from 'src/statics/endpoints/Api.json'
import { EventBus } from 'src/functions/event_bus'

export default {
  name: 'di-import-periods',

  components: {
    'vue-json-to-csv': VueJsonToCsv,
    'vue-csv-import': VueCsvImport
  },

  props: {
    columns: {
      type: Array
    },

    data: {
      type: Array
    }
  },

  watch: {
    csv: function (itens) {
      this.sendCsv = []
      this.failImportation = false

      itens.forEach(periods => {
        this.sendCsv.push(this.brigdePeriods(periods))
      })
    }
  },

  data () {
    return {
      csv: [],
      failImportation: false,
      listFails: [],
      sendCsv: [],
      listCategories: [],
      loading: false,
      percentage: 0,
      show: false
    }
  },

  methods: {
    brigdePeriods (item) {
      const period = {}
      period.personId = item.matricula
      period.year = item.ano
      return period
    },

    showDialog () {
      this.cleanItens()
      this.getCategoria()
      this.show = true
    },

    onHideDialog () {
      this.show = false
    },

    async getCategoria () {
      try {
        const result = await this.$axios.get(api.categories, {
          params: {
            page: 1,
            limit: 100
          }
        })
        this.listCategories = result.data.categories
      } catch (e) {
        console.log(e)
      }
    },

    async registerPeriods () {
      const requestBody = {
        data: this.sendCsv
      }

      try {
        const result = await this.$axios.post('vacationtime/bulk', requestBody)
        let color = 'green'
        const textColor = 'white'
        let icon = 'eva-info-outline'
        let message = result.data.message

        if (result.data.hasError) {
          color = 'red'
          icon = 'eva-alert-triangle-outline'
          message += result.data.error
            .map(elem => `(${elem.personId}, ${elem.year})`)
            .join(';')
        }

        EventBus.$emit('showNotify', {
          color: color,
          textColor: textColor,
          icon: icon,
          message: message
        })

        EventBus.$emit('on-refresh-person')
        this.onHideDialog()
      } catch (e) {
        console.log(e)
      }
    },

    refresh () {
      EventBus.$emit('on-refresh-person')
    },

    confirm () {
      this.registerPeriods()
    },

    cleanItens () {
      this.csv = []
      this.failImportation = false
      this.listFails = []
      this.sendCsv = []
    },

    canceled () {
      this.onHideDialog()
    }
  }
}
</script>

<style lang="stylus">
.hideOption {
  visibility: hidden;
}

.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}

.custom-file-input::before {
  content: 'Importar .csv';
  display: inline-block;
  background-color: $primary;
  color: white;
  border-radius: 3px;
  padding: 5px 8px;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  font-size: 10pt;
}

.custom-file-input:hover::before {
  border-color: red;
}

.custom-file-input:active::before {
}
</style>
