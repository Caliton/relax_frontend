<template>
  <q-page class="justify-center min-height">
    <div>
      <dt-reserva />
    </div>
  </q-page>
</template>

<script>
import dtReserva from 'components/reserva/dt-reserva.vue'

export default {
  name: 'PageReserva',
  components: {
    'dt-reserva': dtReserva
  },
  data () {
    return {}
  }
}
</script>
