<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-6 q-pa-md">
        <q-table
          :data="dateRegional"
          title="Regional"
          flat
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          no-data-label="Ainda não temos feriados cadastrados"
          :loading="loading"
          hide-pagination
          :filter="filter"
          @request="onRequestRegional"
          :visible-columns="visibleColumns"
          rows-per-page-label="Registros por páginas"
          binary-state-sort
        >
          <template v-slot:top>
            <div class="full-width">
              <span class="text-h6 text-green text-left"> Regional </span>
              <q-btn
                color="green"
                dense
                size="sm"
                round
                icon="eva-plus-outline"
                no-caps
                @click="newHoliday"
                class="q-ml-md q-mb-xs q-mt-xs"
              />
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr class="cursor-pointer" :props="props">
              <q-td @click="editHoliday(props.row)" key="name" :props="props">
                {{ props.row.name }}
              </q-td>

              <q-td @click="editHoliday(props.row)" key="date" :props="props">
                {{ props.row.date | moment('DD-MM-YYYY') }}
              </q-td>

              <q-td @click="editHoliday(props.row)" key="type" :props="props">
                <div class="text-pre-wrap">{{ props.row.type }}</div>
              </q-td>

              <q-td>
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
      </div>

      <div class="col-md-6 q-pa-md">
        <q-table
          title="Feriados nacionais"
          :data="dataNational"
          flat
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          no-data-label="Ainda não temos feriados cadastrados"
          :loading="loading"
          hide-pagination
          :filter="filter"
          @request="onRequestNational"
          :visible-columns="visibleColumns"
          rows-per-page-label="Registros por páginas"
          binary-state-sort
        >
          <template v-slot:top>
            <div class=" full-width">
              <span class="text-h6 text-green text-left">
                Feriados nacionais
              </span>
            </div>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir o Feriado?</span>
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
            label="Sim, excluir!"
            color="red"
            @click="deleteHoliday"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <di-holiday ref="holiday" @on-close="refresh" />
  </div>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'
import moment from 'moment'
import diHoliday from 'src/components/settings/holiday/di-holiday.vue'

const enumType = {
  NATIONAL: 'national',
  REGIONAL: 'regional'
}

export default {
  name: 'dt-holiday',

  components: {
    diHoliday
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
      visibleColumns: ['name', 'date', 'type'],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'name',
          label: 'Feriado',
          field: 'name',
          sortable: true,
          style: 'width: 10px',
          headerStyle: 'width: 50px'
        },
        {
          align: 'left',
          name: 'date',
          label: 'Data',
          format: val => moment(val).format('DD-MM-YYYY'),
          field: 'date',
          sortable: true
        },
        {
          align: 'left',
          name: 'type',
          format: val =>
            `${val === enumType.NATIONAL ? 'nacional' : 'regional'}`,
          label: 'Tipo',
          field: 'type',
          sortable: true
        }
      ],
      dateRegional: [],
      dataNational: [],
      holidaySelected: {}
    }
  },

  mounted () {
    this.refresh()
  },
  methods: {
    async onRequestRegional (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.loading = true

      const { data } = await this.$axios.get(this.$api.holidayRegional)

      this.dateRegional.splice(0, this.dateRegional.length, ...data)

      this.pagination = {
        ...this.pagination,
        page,
        rowsPerPage,
        sortBy,
        descending
      }

      this.loading = false
    },

    async onRequestNational (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.loading = true

      const { data } = await this.$axios.get(
        this.$api.holidayNational.replace(
          '{year}',
          moment()
            .year()
            .toString()
        )
      )

      this.dataNational.splice(0, this.dataNational.length, ...data)

      this.pagination = {
        ...this.pagination,
        page,
        rowsPerPage,
        sortBy,
        descending
      }

      this.loading = false
    },

    newHoliday () {
      this.$refs.holiday.onShow()
    },

    editHoliday (holiday) {
      this.$refs.holiday.onShow(holiday)
    },

    openEdit (person) {
      EventBus.$emit('on-edit-person', person)
    },

    openDelete (data) {
      this.showDelete = true
      this.holidaySelected = { ...data }
    },

    refresh () {
      this.onRequestRegional({
        pagination: this.pagination,
        filter: undefined
      })

      this.onRequestNational({
        pagination: this.pagination,
        filter: undefined
      })
    },

    async deleteHoliday () {
      try {
        this.loading = true

        await this.$axios.delete(
          this.$api.holidayDelete.replace('{id}', this.holidaySelected.id)
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Usuario Excluido com Sucesso!'
        })

        this.holidaySelected = undefined
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
