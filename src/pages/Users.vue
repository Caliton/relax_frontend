<template>
  <q-page class="justify-center min-height">
    <div>
      <q-img
        src="~src/statics/beach.png"
        style="max-width: 600px; position: absolute;"
      />

      <di-users />
    </div>
  </q-page>
</template>

<script>
import diUser from 'components/reserva/di-user.vue'

export default {
  name: 'PageReserva',
  components: {
    'di-users': diUser
  },
  data () {
    return {}
  }
}
</script>
