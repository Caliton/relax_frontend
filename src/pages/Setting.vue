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

    <q-card class="q-ma-md">
      <q-card-section>
        <q-btn
          flat
          no-caps
          label="Tipos de Status"
          @click="showSituation"
          color="green"
        />
      </q-card-section>

      <q-card-section>
        <div class="row adsf" :key="item.id" v-for="item in listStatus">
          <div class="row" @click="editSituation(item)">
            <q-icon class="q-pa-sm" :color="item.color" :name="item.icon" />
            <div class="q-pa-sm">
              {{ item.description }}
            </div>

            <div class="q-pa-sm ">
              {{ item.limitMonths }}
            </div>

            <div class="q-pa-sm ">
              {{ item.tooltip }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

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
            label="Prazo limite pela empresa"
            dense
          />
        </div>

        <div class="row">
          <q-input
            class="col-md-3 q-ma-sm"
            filled
            v-model="ultimate"
            label="Prazo limite pela lei"
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

    <di-situation ref="situation" />
  </q-page>
</template>

<script>
import { api } from 'src/enumerator/api'
import diSituation from 'src/components/settings/di-situation.vue'

export default {
  name: 'PageConfiguracoes',
  components: {
    diSituation
  },

  data () {
    return {
      loading: false,
      listStatus: [],
      daysAllowed: 30,
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
