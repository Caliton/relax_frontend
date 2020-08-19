<template>
  <q-page class="flex flex-center">
    <div class="events-page">
      <dt-collaborator />
    </div>
    <di-collaborator />
  </q-page>
</template>

<script>
import dicollaborator from "src/components/collaborator/di-collaborator.vue";
import dtcollaborator from "src/components/collaborator/dt-collaborator.vue";

export default {
  name: "PageColaborator",
  components: {
    "di-collaborator": dicollaborator,
    "dt-collaborator": dtcollaborator,
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