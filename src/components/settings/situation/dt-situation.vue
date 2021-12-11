<template>
  <div>
    <q-card class="q-ma-md">
      <q-card-section>
        <q-btn
          flat
          no-caps
          icon="add"
          :label="title"
          @click="showSituation"
          color="green"
        />
      </q-card-section>

      <q-card-section class="bg-red row">
        <q-card
          :key="item.id"
          v-for="item in listStatus"
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
        </q-card>
      </q-card-section>
    </q-card>

    <di-situation ref="situation" :type="type" />

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
      listStatus: [],
      daysAllowed: 30,
      tab: 'holiday',
      limitEnterprise: 6,
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

    async onRequest () {
      try {
        this.loading = true
        const { data } = await this.$axios.get(
          this.$api.situation.replace('{type}', this.type)
        )

        this.listStatus.splice(0, this.listStatus.length, ...data)
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
          this.$api.situationDelete.replace('{id}', this.situationSelected.id)
        )

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Usuario Excluido com Sucesso!'
        })

        this.situationSelected = null
        this.refresh()
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
