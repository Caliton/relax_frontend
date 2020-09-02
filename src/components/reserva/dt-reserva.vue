<template>
  <div class="q-pa-md">
    <q-table
      title="Reservas"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      no-data-label="Ainda não temos solicitações de reservas"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      :visible-columns="visibleColumns"
      rows-per-page-label="Registros por páginas"
      binary-state-sort
    >
      <template v-slot:top>
        <span style="font-size: 24px">Reservas</span>
        <q-space />
        <!-- <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>-->
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols.filter((item) => item.name !== 'id')"
            :key="col.name"
            :props="props"
          >{{ col.label }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width :props="props" key="person">{{props.row.person}}</q-td>
          <q-td
            auto-width
            :props="props"
            key="startDate"
          >{{props.row.startDate | moment('DD-MM-YYYY')}}</q-td>
          <q-td
            auto-width
            :props="props"
            key="finalDate"
          >{{props.row.finalDate | moment('DD-MM-YYYY')}}</q-td>
          <q-td auto-width :props="props" key="days">{{props.row.days}}</q-td>
          <q-td auto-width :props="props" key="vacationStatus">{{props.row.vacationStatus}}</q-td>
        </q-tr>
      </template>

      <div
        v-if="false"
        slot="bottom"
        slot-scope="props"
        class="flex flex-center"
        style="width: 100%;"
      >
        <div class="q-pa-lg flex flex-center absolute-bottom" style="margin-top: 10rem !important">
          <q-pagination
            v-model="props.pagination.page"
            :max="props.pagesNumber"
            :direction-links="true"
            @input="setPagination"
          />
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
  </div>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'

export default {
  name: 'dt-colaborator',

  props: ['btn-primary'],

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
      visibleColumns: [
        'person',
        'startDate',
        'finalDate',
        'days',
        'vacationStatus'
      ],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'person',
          label: 'Colaborador',
          field: 'person',
          sortable: true,
          style: 'width: 10px',
          headerStyle: 'width: 50px'
        },
        {
          align: 'left',
          name: 'startDate',
          label: 'Inicio de Férias',
          field: 'startDate',
          sortable: true
        },
        {
          align: 'left',
          name: 'finalDate',
          label: 'Final de Férias',
          field: 'finalDate',
          sortable: true
        },
        {
          align: 'left',
          name: 'days',
          label: 'Quantidades de dias',
          field: 'days',
          sortable: true
        },
        {
          align: 'left',
          name: 'vacationStatus',
          label: 'Status da Solicitação',
          field: 'vacationStatus',
          sortable: true
        }
      ],
      data: []
    }
  },

  created () {
    EventBus.$on('on-refresh-person', (event) => {
      this.refresh()
    })
  },

  beforeDestroy () {
    EventBus.$off('on-refresh-person')
  },

  mounted () {
    this.refresh()
  },
  methods: {
    openDialog () {
      EventBus.$emit('on-new-person')
    },

    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.loading = true

      const result = await this.$axios.get('requests')
      const cleanDataResult = {}
      const listVacations = []
      result.data.forEach((item) => {
        cleanDataResult.id = item.id
        cleanDataResult.person = item.person.name
        cleanDataResult.startDate = item.startDate
        cleanDataResult.finalDate = item.finalDate
        cleanDataResult.days = item.days
        cleanDataResult.vacationStatus = item.vacationStatus.description

        listVacations.push(cleanDataResult)
      })

      this.data.splice(0, this.data.length, ...listVacations)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
    },

    openEdit (person) {
      EventBus.$emit('on-edit-person', person)
    },

    openDelete (evaluation) {
      this.showDelete = true
      this.evaluationFocus = Object.assign({}, evaluation)
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
