<template>
  <div class="q-pa-md">
    <q-table
      row-key="id"
      :loading="loading"
      class="my-sticky-header-table"
      :data="data"
      :columns="columns"
      :visible-columns="visibleColumns"
      :filter="filter"
      :pagination.sync="pagination"
      @request="onRequest"
      rows-per-page-label="Registros por páginas"
      no-data-label="Ainda não temos colaboradores cadastrados"
      binary-state-sort
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary">
          <q-spinner-facebook size="50px" color="primary" />
        </q-inner-loading>
      </template>

      <template v-slot:top>
        <div style="width: 100%">
          <div class="row">
            <div class="col" style="display: block">
              <q-icon name="eva-people-outline" color="primary" size="md" style="display: block;"/>
              <span style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif">Colaboradores</span>
              <p class="subtitle">Lista de todos os funcionários de sua empresa.</p>
            </div>

            <div class="col-md-3 bg-grey-3 offset-md-3 row justify-around" style="border-radius: 1rem; transform: scale(.7);">
              <div class="column justify-center text-center">
                <span style="display: inline-block; font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif">{{data.length}} </span>
                <span class="text-weight-regular text-h6">Colaboradores</span>
              </div>

              <q-separator vertical inset />

              <!-- <div class="column justify-center text-center">
                <span style="display: inline-block; font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif">{{data.filter((item) => item.status === 'CRITICO').length}} </span>
                <span class="text-weight-regular text-h6">Aviso</span>
              </div> -->
            </div>
          </div>

          <div
            class="row justify-end"
            :class="{'justify-center': $q.screen.lt.sm}"
            style="width: 100%; margin-top: 1rem"
          >
            <div class="col-md-2 col-sm-4">
              <q-btn
                label="Adicionar Colaborador"
                dense
                flat
                no-caps
                color="primary"
                icon="add"
                @click="openDialogColaborador"
              />
            </div>

            <div class="col-md-2 col-sm-4">
              <q-btn
                label="Importar lista de Colaboradores"
                dense
                flat
                no-caps
                color="primary"
                icon="eva-cloud-upload-outline"
                @click="openDialogImportColaborador"
              />
            </div>

            <div class="col-md-8 col-sm-5">
              <q-input
                class="q-ml-lg float-right"
                dense
                filled
                debounce="300"
                v-model="filter"
                placeholder="Busca"
                style="max-width: 40%"
              >
                <q-icon slot="append" name="search" />
              </q-input>
            </div>
          </div>
        </div>
      </template>
      

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols.filter((item) => item.name !== 'id')"
            :key="col.name"
            :props="props"
          >{{ col.label }}</q-th>

          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <!-- {{ props.row}} -->
        <q-tr :props="props">
          <q-td :props="props" key="status">
            <q-icon size="md" v-if="props.row.status === 'INDEFINIDO'" color="grey-5" name="eva-alert-circle-outline" />
            <q-icon size="md" v-if="props.row.status === 'NORMAL'" color="green" name="eva-checkmark-circle-outline" />
            <q-icon size="md" v-if="props.row.status === 'MEDIO'" color="yellow" name="eva-alert-triangle-outline" />
            <q-icon size="md" v-if="props.row.status === 'CRITICO'" color="red" name="eva-alert-triangle-outline" />

            <q-tooltip
              content-class="bg-grey-1 "
              content-style="font-size: 16px; color: #575858; border: 2px solid #BDBDBF; width: 300px"
              :offset="[10, 10]"
              :delay="300"
            >
              <div>
                &nbsp;<q-icon size="22px" :name="getIconStatus(props.row.status)" :color="getColorStatus(props.row.status)" />&nbsp;
                <span :style="{color: getColorStatus(props.row.status)}">{{props.row.status}}</span> <br>
                <span class="subtitle" style="font-size: .9rem">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{getNameStatus(props.row.status)}}</span>
              </div>
            </q-tooltip>

          </q-td>

          <q-td auto-width :props="props" key="name">{{props.row.name}}</q-td>
          <q-td
            auto-width
            :props="props"
            key="hiringDate"
          >{{ props.row.hiringDate | moment('DD-MM-YYYY')}}</q-td>
          <q-td
            auto-width
            :props="props"
            key="birthDay"
          >{{props.row.birthDay | moment('DD-MM-YYYY')}}</q-td>

          <q-td auto-width>
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="green"
              round
              dense
              icon="eva-sun-outline"
              @click="openVacation(props.row)"
            />
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="light-blue"
              round
              dense
              icon="eva-edit-outline"
              @click="openEdit(props.row)"
            />
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="red"
              round
              dense
              icon="eva-trash-2-outline"
              @click="openDelete(props.row)"
            />
          </q-td>
        </q-tr>
      </template>

      <div slot="bottom" slot-scope="props" style="margin: 0 auto">
        <div>
          <q-pagination
            v-model="props.pagination.page"
            :max="1"
            :direction-links="true"
            @input="setPagination"
          ></q-pagination>
        </div>
      </div>
    </q-table>

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
            @click="deletePerson"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <di-import-colaborador
      ref="di-import-colaborador"
      :columns="columns"
      :data="data"
    />

  </div>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import DiImportColaborador from './di-import-collaborator'


export default {
  name: 'dt-colaborator',

  props: ['btn-primary'],

  components: {
    'di-import-colaborador': DiImportColaborador,
  },

  data () {
    return {
      filter: '',
      showDelete: false,
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      visibleColumns: ['status', 'name', 'hiringDate', 'birthDay'],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'status',
          label: 'Situação',
          field: 'status',
          sortable: true,
          style: 'width: 10px',
          headerStyle: 'width: 50px'
        },
        {
          align: 'left',
          name: 'name',
          label: 'Nome',
          field: 'name',
          sortable: true
        },
        {
          align: 'left',
          name: 'hiringDate',
          label: 'Data de admissão',
          field: 'hiringDate',
          sortable: true
        },
        {
          align: 'left',
          name: 'birthDay',
          label: 'Aniversário',
          field: 'birthDay',
          sortable: true
        }
      ],
      data: []
    }
  },

  created () {
    EventBus.$on('on-refresh-person', () => {
      this.onRequest({ pagination: this.pagination, filter: this.filter })
    })
  },

  beforeDestroy () {
    EventBus.$off('on-refresh-person')
  },

  mounted () {
    this.refresh()
  },
  methods: {

    setPagination (value) {
      this.pagination.page = value
      this.onRequest({ pagination: this.pagination, filter: this.filter })
    },

    openDialogColaborador () {
      EventBus.$emit('on-new-person')
    },

    openDialogImportColaborador () {
      this.$refs['di-import-colaborador'].showDialog()
    },

    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.loading = true

      const returnedData = await this.$axios.get(`person?page=${page}`, {params: {
            filter: this.filter
          }})

      returnedData.data.forEach((item, i) => {
        if (!item.vacationNew || item.vacationNew.length === 0) {
          returnedData.data[i].status = 'INDEFINIDO'
        } else if (moment(item.vacationNew[0].limit6Months).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
          returnedData.data[i].status = 'CRITICO'
        } else if (moment(item.vacationNew[0].limit6Months).subtract(1, 'm').format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
          returnedData.data[i].status = 'MEDIO'
        } else {
          console.log(moment(item.vacationNew[0].limit6Months).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD'))
          returnedData.data[i].status = 'NORMAL'
        }
      })

      this.data.splice(0, this.data.length, ...returnedData.data)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
    },

    getNameStatus (item) {
      let statusName = ''

      switch (item) {
        case 'NORMAL':
          statusName = 'Aparentemente não há pendência ou atrasos em requisitar férias, Colaborador ok :)'
          break
        case 'MEDIO':
          statusName = 'Este Colaborador esta se aproximando de um prazo Crítico'
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

    getIconStatus (item) {
      let statusIcon = ''
      switch (item) {
        case 'MEDIO':
          statusIcon = 'eva-alert-triangle-outline'
          break
        case 'NORMAL':
          statusIcon = 'eva-checkmark-circle-outline'
          break
        case 'CRITICO':
          statusIcon = 'eva-alert-triangle-outline'
          break
        case 'INDEFINIDO':
          statusIcon = 'eva-alert-circle-outline'
          break

        default:
          statusIcon = 'Status não identificado'
          break
      }
      return statusIcon
    },

    getColorStatus (item) {
      let statusIcon = ''
      switch (item) {
        case 'MEDIO':
          statusIcon = 'yellow'
          break
        case 'NORMAL':
          statusIcon = 'green'
          break
        case 'CRITICO':
          statusIcon = 'red'
          break
        case 'INDEFINIDO':
          statusIcon = 'grey-5'
          break

        default:
          statusIcon = 'Status não identificado'
          break
      }
      return statusIcon
    },

    openEdit (person) {
      EventBus.$emit('on-edit-person', person)
    },

    openDelete (evaluation) {
      this.showDelete = true
      this.evaluationFocus = Object.assign({}, evaluation)
    },

    openVacation (data) {
      EventBus.$emit('on-show-vacation-request', data)
    },

    refresh () {
      this.onRequest({
        pagination: this.pagination,
        filter: undefined
      })
    },

    async deletePerson () {
      try {
        this.loading = true

        await this.$axios.delete(
          `${'/person/{id}'.replace('{id}', this.evaluationFocus.id)}/`
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Colaborador Excluido com Sucesso!'
        })

        this.evaluationFocus = undefined
        this.refresh()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.subtitle
  color: #555d61;
  font: 16px/24px Avenir Next W01,Helvetica,Arial,sans-serif;

.my-sticky-header-table
  /* height or max-height is important */
  height: 80vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
