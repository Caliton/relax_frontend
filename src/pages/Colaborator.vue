<template>
  <q-page class="justify-center min-height">
    <div>
      <dt-collaborator/>
    </div>
    <di-collaborator style="height: auto !important"/>
    <di-vacation-request />
    <di-vacation-request-solicitation />
  </q-page>
</template>

<script>
import dicollaborator from 'src/components/collaborator/di-collaborator.vue'
import dtcollaborator from 'src/components/collaborator/dt-collaborator.vue'
import divacationrequest from 'src/components/collaborator/di-vacationRequest.vue'
import divacationRequestiSolicitation from 'src/components/collaborator/di-vacation-request-solicitation.vue'

export default {
  name: 'PageColaborator',
  components: {
    'di-collaborator': dicollaborator,
    'dt-collaborator': dtcollaborator,
    'di-vacation-request': divacationrequest,
    'di-vacation-request-solicitation': divacationRequestiSolicitation
  }
}
</script>
