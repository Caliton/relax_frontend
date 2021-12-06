<template>
  <div class="q-pa-md">
    <q-table
      title="Reservas"
      :data="data"
      :columns="columns"
      class="my-sticky-header-table"
      style="background-color: #FAFAFA"
      flat
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
        <div style="width: 100%">
          <div class="row">
            <div class="col" style="display: block">
              <q-icon
                name="eva-sun-outline"
                color="primary"
                size="md"
                style="display: block;"
              />
              <span
                style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif"
                >Agendamentos</span
              >
              <p class="subtitle">
                Lista de todas solicitações de agendamentos de seus
                colaboradores.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-sm-5">
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
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols.filter(item => item.name !== 'id')"
            :key="col.name"
            :props="props"
            >{{ col.label }}</q-th
          >
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width :props="props" key="requestUserRegister">{{
            props.row.requestUserRegister
          }}</q-td>
          <q-td auto-width :props="props" key="requestUser">{{
            props.row.requestUser
          }}</q-td>
          <q-td auto-width :props="props" key="startDate">{{
            props.row.startDate | moment('DD-MM-YYYY')
          }}</q-td>
          <q-td auto-width :props="props" key="finalDate">{{
            props.row.finalDate | moment('DD-MM-YYYY')
          }}</q-td>
          <q-td auto-width :props="props" key="days">{{ props.row.days }}</q-td>
          <q-td auto-width :props="props" key="status">{{
            props.row.status
          }}</q-td>
        </q-tr>
      </template>

      <div
        v-if="false"
        slot="bottom"
        slot-scope="props"
        class="flex flex-center"
        style="width: 100%;"
      >
        <div
          class="q-pa-lg flex flex-center absolute-bottom"
          style="margin-top: 10rem !important"
        >
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
          <span class="q-ml-sm">Deseja mesmo excluir a Reserva?</span>
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
import { api } from 'src/enumerator/api'

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
        rowsPerPage: 10
      },
      visibleColumns: [
        'requestUserRegister',
        'requestUser',
        'startDate',
        'finalDate',
        'days',
        'status'
      ],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'requestUserRegister',
          label: 'Matricula',
          field: 'requestUserRegister',
          sortable: true,
          style: 'width: 10px',
          headerStyle: 'width: 50px'
        },
        {
          align: 'left',
          name: 'requestUser',
          label: 'Colaborador',
          field: 'requestUser',
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
          label: 'Qtda dias com Direito a Férias',
          field: 'days',
          sortable: true
        },
        {
          align: 'left',
          name: 'status',
          label: 'Status da Solicitação',
          field: 'status',
          sortable: true
        }
      ],
      data: []
    }
  },

  created () {
    EventBus.$on('on-refresh-person', event => {
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

      let { data } = await this.$axios.get(api.vacation)

      data = data.map(item => ({
        ...item,
        requestUserRegister: item.requestUser.register,
        requestUserId: item.requestUser.id,
        requestUser: item.requestUser.name
      }))

      this.data.splice(0, this.data.length, ...data)

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

<style lang="stylus" scoped>
.subtitle {
  color: #555d61;
  font: 16px / 24px Avenir Next W01, Helvetica, Arial, sans-serif;
}

.my-sticky-header-table {
  /* height or max-height is important */
  @media (max-width: 1368px) {
    height: 110vh;
  }

  .q-table__top, .q-table__bottom, thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}

.custom-table td {
  font-size: 1rem;
}
</style>
