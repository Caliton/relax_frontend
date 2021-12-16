<template>
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
</template>

<script>
export default {
  name: 'foSettings',

  data () {
    return {
      settings: {
        MAX_DAYS_PER_PERIOD: 30,
        PARAM_LIMIT_DATE_ENTERPRISE: 6,
        PARAM_LIMIT_DATE_GOVERNE: 23
      },

      loading: false,
      listStatus: [],
      daysAllowed: 30,
      tab: 'typeStatus',
      limitEnterprise: 6,
      ultimate: 23
    }
  },

  methods: {
    async onRequest () {
      try {
        const { data } = await this.$axios.get(this.$api.globalsettings)
        console(data)
      } catch (e) {}
    },

    async onSave () {
      try {
        const { data } = await this.$axios.put(this.$api.globalsettings)
        console(data)
      } catch (e) {}
    }
  }
}
</script>

<style scoped></style>
