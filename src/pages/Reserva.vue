<template>
  <q-page class="flex flex-center">
    <div class="events-page">
      <dt-reserva />
    </div>
  </q-page>
</template>

<script>
import dtReserva from 'components/reserva/dt-reserva'

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

<style lang="stylus">
.events-page {
  width: 90%;
  min-height: 80vmin;
  border-radius: 6px;
}
</style>
