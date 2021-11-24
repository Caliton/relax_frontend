<template>
  <q-page class="justify-center min-height">
    <div>
      <dt-collaborator />
    </div>
  </q-page>
</template>

<script>
import dtcollaborator from 'src/components/collaborator/dt-collaborator.vue'

export default {
  name: 'PageColaborator',
  components: {
    'dt-collaborator': dtcollaborator
  }
}
</script>
