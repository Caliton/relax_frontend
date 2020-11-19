<template>
  <q-page class="flex flex-center">
    <div class="events-page">
      <dt-holiday />
    </div>
    <di-holiday />
  </q-page>
</template>

<script>
import dtholiday from 'src/components/settings/holiday/dt-holiday.vue'
import diholiday from 'src/components/settings/holiday/di-holiday.vue'

export default {
  name: 'PageConfiguracoes',
  components: {
    'dt-holiday': dtholiday,
    'di-holiday': diholiday
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
