<template>
  <div class="q-pa-md">
    <q-table
      row-key="id"
      :loading="loading"
      class="my-sticky-header-table"
      style="background-color: #FAFAFA"
      flat
      :data="data"
      :columns="columns"
      :visible-columns="visibleColumns"
      :filter="filter"
      hide-pagination
      :pagination="pagination"
      rows-per-page-label="Registros por páginas"
      no-results-label="Collaborador não encontrado"
      no-data-label="Ainda não temos colaboradores cadastrados"
      @request="onRequest"
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
              <q-icon
                name="eva-people-outline"
                color="primary"
                size="md"
                style="display: block;"
              />
              <span
                style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif"
              >
                Colaboradores
              </span>
              <p class="subtitle">
                Sinta-se a vontade para acompanhar o estado atual de seus
                colaboradores.
              </p>
            </div>

            <div
              class="col-md-3 bg-grey-3 offset-md-3 row justify-around"
              style="border-radius: 1rem; transform: scale(.7);"
            >
              <div class="column justify-center text-center">
                <span
                  style="display: inline-block; font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif"
                  >{{ data.length }}</span
                >
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
            class="row justify-between"
            :class="{ 'justify-center': $q.screen.lt.sm }"
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

            <div class="col-md-4 col-sm-4">
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

            <div class="col-md-4 col-sm-5">
              <q-input
                class="float-right"
                dense
                filled
                debounce="750"
                v-model="filter"
                placeholder="Busca"
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
            v-for="col in props.cols.filter(item => item.name !== 'id')"
            :key="col.name"
            :props="props"
            >{{ col.label }}</q-th
          >

          <q-th> Ações </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" class="custom-table">
          <q-td style="width: 5%" :props="props" key="situation">
            <q-icon
              size="md"
              :color="props.row.situation.color"
              :name="props.row.situation.icon"
            />
            <q-tooltip
              content-class="bg-grey-1 "
              content-style="font-size: 16px; color: #575858; border: 2px solid #BDBDBF; width: 300px"
              :offset="[10, 10]"
              :delay="300"
            >
              <div>
                &nbsp;
                <q-icon
                  size="22px"
                  :name="props.row.situation.icon"
                  :color="props.row.situation.color"
                />&nbsp;
                <span :style="{ color: props.row.situation.color }">{{
                  props.row.situation.description
                }}</span>
                <br />
                <span class="subtitle" style="font-size: .9rem"
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                    props.row.situation.tooltip
                  }}</span
                >
              </div>
            </q-tooltip>
          </q-td>

          <q-td style="width: 10%" :props="props" key="register">{{
            props.row.register
          }}</q-td>
          <q-td style="width: 30%" :props="props" key="name">{{
            props.row.name
          }}</q-td>

          <q-td style="width: 10%" :props="props" key="birthday">{{
            props.row.birthday | moment('DD-MM-YYYY')
          }}</q-td>

          <q-td style="width: 10%" :props="props" key="hiringdate">{{
            props.row.hiringdate | moment('DD-MM-YYYY')
          }}</q-td>

          <q-td style="width: 20%">
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
    </q-table>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir o Colaborador?</span>
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
            label="Desejo sim!"
            color="red"
            @click="deleteCollaborator"
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

    <di-collaborator
      ref="di-collaborator"
      @on-close="refresh"
      style="height: auto !important"
    />

    <di-vacation @on-close="refresh" ref="di-vacation-request" />
  </div>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'
import moment from 'moment'
import DiImportColaborador from './di-import-collaborator'
import diCollaborator from './di-collaborator.vue'
import diVacation from './di-vacation.vue'

export default {
  name: 'dt-colaborator',

  props: ['btn-primary'],

  components: {
    'di-import-colaborador': DiImportColaborador,
    diCollaborator,
    diVacation
  },

  data () {
    return {
      filter: '',
      moment,
      showDelete: false,
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 100
      },
      visibleColumns: [
        'situation',
        'register',
        'name',
        'hiringdate',
        'birthday'
      ],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'situation',
          label: 'Situação',
          sort: (a, b, rowA, rowB) => a.limitMonths - b.limitMonths,
          field: 'situation',
          sortable: true
        },
        {
          align: 'left',
          name: 'register',
          label: 'Matricula',
          field: 'register',
          sortable: true
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
          name: 'birthday',
          label: 'Data de Nascimento',
          field: 'birthday',
          sortable: true
        },
        {
          align: 'left',
          name: 'hiringdate',
          label: 'Data de Admissão',
          field: 'hiringdate',
          sortable: true
        }
      ],
      data: []
    }
  },

  created () {
    EventBus.$on('on-refresh-person', () => {
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
    async onRequest (props) {
      try {
        this.loading = true

        const { data } = await this.$axios.get(this.$api.collaborators, {
          params: { filter: props.filter || undefined }
        })

        this.data.splice(0, this.data.length, ...data)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    customSort (rows, sortBy, descending) {
      const data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b

          if (sortBy === 'name') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }

      return data
    },

    openDialogColaborador () {
      this.$refs['di-collaborator'].onShow()
    },

    openDialogImportColaborador () {
      this.$refs['di-import-colaborador'].showDialog()
    },

    openEdit (person) {
      this.$refs['di-collaborator'].onShow(person)
    },

    openDelete (evaluation) {
      this.showDelete = true
      this.collaboratorFocus = Object.assign({}, evaluation)
    },

    openVacation (data) {
      this.$refs['di-vacation-request'].onShow(data)
    },

    refresh () {
      this.onRequest({
        filter: undefined
      })
    },

    async deleteCollaborator () {
      try {
        this.loading = true

        await this.$axios.delete(
          `${api.collaboratorGetBy.replace('{id}', this.collaboratorFocus.id)}/`
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Colaborador Excluido com Sucesso!'
        })

        this.collaboratorFocus = undefined
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
  @media (max-width: 1920px) {
    height: 90vh;
  }

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
}

.custom-table td {
  font-size: 1rem;
}
</style>
