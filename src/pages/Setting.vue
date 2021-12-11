<template>
  <q-page class="min-height">
    <div class="row q-pa-lg">
      <div class="col" style="display: block">
        <q-icon
          name="eva-pantone-outline"
          color="primary"
          size="md"
          style="display: block;"
        />
        <span style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif"
          >Configurações</span
        >
        <p class="subtitle">
          As engrenagens do nosso sistema
        </p>
      </div>
    </div>

    <q-tabs inline-label v-model="tab" class="text-green" align="justify">
      <q-tab name="general" icon="eva-grid-outline" label="Geral" no-caps />
      <q-tab
        name="typeStatus"
        icon="eva-pricetags-outline"
        label="Situação dos Colaboradores"
        no-caps
      />
      <q-tab
        name="holiday"
        icon="eva-calendar-outline"
        label="Feriados"
        no-caps
      />
      <q-tab name="users" icon="eva-person-outline" label="Usuários" no-caps />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="">
      <q-tab-panel name="general">
        <q-card class="q-ma-md">
          <q-card-section>
            <q-btn
              flat
              no-caps
              label="Configurações Gerais"
              @click="showSituation"
              color="green"
            />
          </q-card-section>

          <q-card-section>
            <div class="row">
              <q-input
                class="col-md-3 q-ma-sm"
                filled
                v-model="daysAllowed"
                label="Dias de direito"
                dense
              />
            </div>

            <div class="row">
              <q-input
                class="col-md-3 q-ma-sm"
                filled
                v-model="limitEnterprise"
                label="Prazo limite definido pela empresa (meses)"
                dense
              />
            </div>

            <div class="row">
              <q-input
                class="col-md-3 q-ma-sm"
                filled
                v-model="ultimate"
                label="Prazo limite definido pela lei (meses)"
                dense
              />
            </div>

            <div class="row q-mt-md">
              <q-btn
                label="Salvar alterações"
                no-caps
                rounded
                color="green"
                size="sm"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="typeStatus">
        <dt-situation type="effective" title="Tipos de Status - Efetivo" />
        <dt-situation type="intern" title="Tipos de Status - Estagiário" />
      </q-tab-panel>

      <q-tab-panel name="holiday">
        <dt-holiday />
      </q-tab-panel>

      <q-tab-panel name="users">
        <dt-users />
      </q-tab-panel>
    </q-tab-panels>

    <di-situation ref="situation" />
  </q-page>
</template>

<script>
import { api } from 'src/enumerator/api'
import diSituation from 'src/components/settings/situation/di-situation.vue'
import dtSituation from 'src/components/settings/situation/dt-situation.vue'
import dtHoliday from 'src/components/settings/holiday/dt-holiday.vue'
import dtUsers from 'src/components/settings/users/dt-users.vue'

export default {
  name: 'PageConfiguracoes',

  components: {
    diSituation,
    dtHoliday,
    dtUsers,
    dtSituation
  },

  data () {
    return {
      loading: false,
      listStatus: [],
      daysAllowed: 30,
      tab: 'typeStatus',
      limitEnterprise: 6,
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
        const { data } = await this.$axios.get(api.situation)

        this.listStatus.splice(0, this.listStatus.length, ...data)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    editSituation (data) {
      this.$refs.situation.onShow(data)
    }
  }
}
</script>

<style lang="stylus">

.adsf:hover{
  background-color: $green-1 !important
  cursor pointer
}
.subtitle {
  color: #555d61;
  font: 16px / 24px Avenir Next W01, Helvetica, Arial, sans-serif;
}

.events-page {
  width: 90%;
  min-height: 80vmin;
  border-radius: 6px;
}
</style>
