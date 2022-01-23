<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-6 q-pa-md">
        <q-table
          :data="data"
          flat
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          no-data-label="Ainda não temos departamentos cadastrados"
          :loading="loading"
          hide-pagination
          :filter="filter"
          @request="onRequest"
          :visible-columns="visibleColumns"
          rows-per-page-label="Registros por páginas"
          binary-state-sort
        >
          <template v-slot:top>
            <div class="full-width">
              <q-btn
                color="green"
                label="Departamentos"
                flat
                icon="eva-plus-outline"
                no-caps
                @click="newDepartament"
                class="q-ml-md q-mb-xs q-mt-xs"
              />
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr class="cursor-pointer" :props="props">
              <q-td
                @click="editDepartament(props.row)"
                key="description"
                :props="props"
              >
                {{ props.row.description }}
              </q-td>

              <q-td style="width: 50px">
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
    </div>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir o Departamento?</span>
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
            @click="deleteDepartament"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <di-departament ref="departament" @on-close="refresh" />
  </div>
</template>

<script>
import diDepartament from 'src/components/settings/departament/di-departament.vue'

export default {
  name: 'dt-departament',

  components: {
    diDepartament
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
      visibleColumns: ['description'],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'description',
          label: 'Descrição',
          field: 'description',
          sortable: true
        }
      ],
      data: [],
      dataNational: [],
      departamentSelected: {}
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    async onRequest (props) {
      try {
        const { page, rowsPerPage, sortBy, descending } = props.pagination

        this.loading = true

        const { data } = await this.$axios.get(this.$api.departament)

        this.data.splice(0, this.data.length, ...data)

        this.pagination = {
          ...this.pagination,
          page,
          rowsPerPage,
          sortBy,
          descending
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    newDepartament () {
      this.$refs.departament.onShow()
    },

    editDepartament (departament) {
      this.$refs.departament.onShow(departament)
    },

    openDelete (data) {
      this.showDelete = true
      this.departamentSelected = { ...data }
    },

    refresh () {
      this.onRequest({
        pagination: this.pagination,
        filter: undefined
      })
    },

    async deleteDepartament () {
      try {
        this.loading = true

        await this.$axios.delete(
          this.$api.departamentDelete.replace(
            '{id}',
            this.departamentSelected.id
          )
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Departamento excluido com Sucesso!'
        })

        this.departamentSelected = null
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
