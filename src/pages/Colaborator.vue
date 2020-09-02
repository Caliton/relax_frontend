<template>
  <q-page class="flex flex-center">
    <div class="events-page">
      <dt-collaborator />
    </div>
    <di-collaborator />
    <di-vacation-request/>
  </q-page>
</template>

<script>
import dicollaborator from "src/components/collaborator/di-collaborator.vue";
import dtcollaborator from "src/components/collaborator/dt-collaborator.vue";
import divacationrequest from "src/components/collaborator/di-vacationRequest.vue";

export default {
  name: "PageColaborator",
  components: {
    "di-collaborator": dicollaborator,
    "dt-collaborator": dtcollaborator,
    "di-vacation-request": divacationrequest
  },
};
</script>

<style lang="stylus">
.events-page {
  width: 90%;
  min-height: 80vmin;
  border-radius: 6px;
}
</style>