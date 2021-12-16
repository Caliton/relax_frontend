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
        <fo-settings />
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
import diSituation from 'src/components/settings/situation/di-situation.vue'
import dtSituation from 'src/components/settings/situation/dt-situation.vue'
import dtHoliday from 'src/components/settings/holiday/dt-holiday.vue'
import dtUsers from 'src/components/settings/users/dt-users.vue'
import foSettings from 'src/components/settings/globalsettings/fo-settings.vue'

export default {
  name: 'PageConfiguracoes',

  components: {
    diSituation,
    dtHoliday,
    dtUsers,
    dtSituation,
    foSettings
  },

  data () {
    return {
      loading: false,
      listStatus: [],
      daysAllowed: 30,
      tab: 'general',
      limitEnterprise: 6,
      ultimate: 23
    }
  },

  methods: {
    showSituation (data) {
      this.$refs.situation.onShow(data)
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
