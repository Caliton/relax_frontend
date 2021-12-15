<template>
  <div>
    <q-card class="q-ma-md">
      <q-card-section class="row">
        <q-table
          :data="data"
          flat
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          no-data-label="Ainda não temos situações cadastrados"
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
              <!-- <span class="text-h6 text-green text-left"> Usuários </span> -->
              <q-btn
                color="green"
                :label="title"
                flat
                icon="eva-plus-outline"
                no-caps
                @click="showSituation()"
                class="q-ml-md q-mb-xs q-mt-xs"
              />
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr class="cursor-pointer" :props="props">
              <q-td @click="showSituation(props.row)" key="icon" :props="props">
                <q-icon
                  v-if="isHexColor(props.row.color)"
                  class="q-pa-sm"
                  :style="{ color: props.row.color }"
                  :name="props.row.icon"
                />

                <q-icon
                  v-else
                  class="q-pa-sm"
                  :color="props.row.color"
                  :name="props.row.icon"
                />
              </q-td>

              <q-td
                @click="showSituation(props.row)"
                key="description"
                :props="props"
              >
                {{ props.row.description }}
              </q-td>

              <q-td
                @click="showSituation(props.row)"
                key="limitMonths"
                :props="props"
              >
                {{ props.row.limitMonths }}
              </q-td>

              <q-td
                @click="showSituation(props.row)"
                key="tooltip"
                :props="props"
              >
                <div class="text-pre-wrap">
                  {{ props.row.tooltip }}
                </div>
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

        <!-- <q-card
          :key="item.id"
          v-for="item in data"
          class="q-ma-sm"
          style="width: 400px"
        >
          <q-card-section
            class="cursor-pointer q-pa-xs"
            @click="editSituation(item)"
          >
            <div class="q-pa-sm">
              <q-icon class="q-pa-sm" :color="item.color" :name="item.icon" />
              {{ item.description }}

              <div class="q-pa-sm float-right">
                {{ item.limitMonths }} meses.
                <q-tooltip>
                  Diferença de meses com relação ao prazo final
                </q-tooltip>
              </div>
            </div>

            <div class="q-pa-sm " style="overflow: auto; max-height: 80px">
              {{ item.tooltip }}
            </div>
          </q-card-section>

          <q-card-actions class="justify-end q-pa-xs">
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="red"
              round
              dense
              icon="eva-trash-2-outline"
              @click="openDelete(item)"
            />
          </q-card-actions>
        </q-card> -->
      </q-card-section>
    </q-card>

    <di-situation ref="situation" :type="type" @on-close="onRequest" />

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir o Situação?</span>
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
            @click="deleteSituation"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import diSituation from 'src/components/settings/situation/di-situation.vue'

const enumType = {
  EFFECTIVE: 'effective',
  INTERN: 'intern'
}

export default {
  name: 'DtSituation',

  components: {
    diSituation
  },

  props: {
    title: {
      type: String,
      default: 'Titulo'
    },

    type: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      loading: false,
      data: [],
      daysAllowed: 30,
      limitEnterprise: 6,
      filter: '',
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      visibleColumns: ['icon', 'description', 'tooltip', 'type', 'limitMonths'],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'icon',
          label: 'icon',
          field: 'icon',
          sortable: true
        },
        {
          align: 'left',
          name: 'color',
          label: 'color',
          field: 'color',
          sortable: true
        },
        {
          align: 'left',
          name: 'description',
          label: 'Nome',
          field: 'description',
          sortable: true,
          style: 'width: 10px',
          headerStyle: 'width: 50px'
        },
        {
          align: 'left',
          name: 'limitMonths',
          label: 'Dif. em mes / prazo final',
          field: 'limitMonths',
          sortable: true
        },
        {
          align: 'left',
          name: 'tooltip',
          label: 'Descrição',
          field: 'tooltip',
          sortable: true
        }
      ],
      situationSelected: {},
      showDelete: false,
      ultimate: 23
    }
  },

  mounted () {
    this.onRequest()
  },

  methods: {
    showSituation (data) {
      this.$refs.situation.onShow(data)
    },

    isHexColor (a) {
      return a.includes('#')
    },

    translateType (val) {
      let type = ''
      switch (val) {
        case enumType.EFFECTIVE:
          type = 'Efetivo'
          break

        case enumType.INTERN:
          type = 'Estagiário'
          break

        default:
          type = 'Não identificado'
          break
      }

      return type
    },

    async onRequest () {
      try {
        this.loading = true
        const { data } = await this.$axios.get(
          this.$api.situationType.replace('{type}', this.type)
        )

        this.data.splice(0, this.data.length, ...data)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    openDelete (data) {
      this.showDelete = true
      this.situationSelected = { ...data }
    },

    async deleteSituation () {
      try {
        this.loading = true

        await this.$axios.delete(
          this.$api.situationGetBy.replace('{id}', this.situationSelected.id)
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Situação excluido com sucesso!'
        })

        this.situationSelected = null
        this.onRequest()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    editSituation (data) {
      this.$refs.situation.onShow(data)
    }
  }
}
</script>
