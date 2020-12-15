<template>
  <div class="row no-wrap q-pa-md">
    <div class="column q-gutter-sm">
      <div class="text-h6 q-mb-md text-center">Inserir novo periodo</div>
      <q-input
        filled
        v-model="vacationTime.vacationYear"
        label="Ano"
        dense
        lazy-rules
      />

      <q-input
        filled
        v-model="vacationTime.daysAllowed"
        label="Dias de direito"
        dense
        lazy-rules
      />

      <q-btn
        color="primary"
        class="q-mt-lg"
        label="Salvar"
        :loading="loadingVacationTime"
        @click="registerVacationTime"
        push
        size="sm"
        v-close-popup
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'fo-vacation-time',

  props: {
    personId: {
      type: Number
    },

    vacationTimeEdit: {
      type: Object
    }
  },

  data() {
    return {
      vacationTime: {
        daysAllowed: '',
        vacationYear: ''
      },
      loadingVacationTime: false
    }
  },

  methods: {
    async registerVacationTime () {
      try {
        this.loadingVacationTime = true

        const result = await this.$axios.post(`person/${this.personId}/vacationtime`,
          {
            daysAllowed: this.vacationTime.daysAllowed,
            vacationYear: this.vacationTime.vacationYear
          })

        // this.getVacationsTimes()

        this.loadingVacationTime = false

      } catch (e) {
        console.log(e)
        this.loadingVacationTime = false
      }
    },
  },
}
</script>