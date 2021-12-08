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
          no-data-label="Ainda não temos usuários cadastrados"
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
              <span class="text-h6 text-green text-left"> Usuários </span>
              <q-btn
                color="green"
                dense
                size="sm"
                round
                icon="eva-plus-outline"
                no-caps
                @click="newUser"
                class="q-ml-md q-mb-xs q-mt-xs"
              />
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr
              class="cursor-pointer"
              @click="editUser(props.row)"
              :props="props"
            >
              <q-td key="login" :props="props">
                {{ props.row.login }}
              </q-td>

              <q-td key="collaborator" :props="props">
                {{ props.row.collaborator.name }}
              </q-td>

              <q-td key="role" :props="props">
                <div class="text-pre-wrap">
                  {{ translateRole(props.row.role) }}
                </div>
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
            @click="deleteUser"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <di-users ref="user" @on-close="refresh" />
  </div>
</template>

<script>
import diUsers from 'src/components/settings/users/di-users.vue'

const enumRole = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  COLLABORATOR: 'collaborator',
  RH: 'rh'
}

export default {
  name: 'dt-user',

  components: {
    diUsers
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
      visibleColumns: ['login', 'role', 'type', 'collaborator'],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'login',
          label: 'Login',
          field: 'login',
          sortable: true,
          style: 'width: 10px',
          headerStyle: 'width: 50px'
        },
        {
          align: 'left',
          name: 'collaborator',
          label: 'Colaborador',
          format: val => val.name,
          field: 'collaborator',
          sortable: true
        },
        {
          align: 'left',
          name: 'role',
          label: 'Perfil de Acesso',
          field: 'role',
          sortable: true
        }
      ],
      data: [],
      dataNational: []
    }
  },

  mounted () {
    this.refresh()
  },
  methods: {
    translateRole (val) {
      let role = ''
      switch (val) {
        case enumRole.ADMIN:
          role = 'Admin'
          break

        case enumRole.RH:
          role = 'Rh'
          break

        case enumRole.SUPERVISOR:
          role = 'Gestor'
          break

        case enumRole.COLLABORATOR:
          role = 'Colaborador'
          break

        default:
          role = 'Não identificado'
          break
      }

      return role
    },

    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.loading = true

      const { data } = await this.$axios.get(this.$api.user)

      this.data.splice(0, this.data.length, ...data)

      this.pagination = {
        ...this.pagination,
        page,
        rowsPerPage,
        sortBy,
        descending
      }

      this.loading = false
    },

    newUser () {
      this.$refs.user.onShow()
    },

    editUser (user) {
      this.$refs.user.onShow(user)
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

    async deleteUser () {
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
