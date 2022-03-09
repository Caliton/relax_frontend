<template>
  <q-page class="flex flex-center min-height">
    <span class="text-green">em breve....</span>
    <q-img
      src="~src/statics/beach.png"
      style="max-width: 600px; position: absolute;"
    />
  </q-page>
</template>

<script>
// import { GGanttChart, GGanttRow } from 'vue-ganttastic'

export default {
  name: 'PageIndex',

  // components: {
  //   GGanttChart,
  //   GGanttRow
  // },

  data () {
    return {
      myChartStart: '2020-03-01 00:00',
      myChartEnd: '2020-04-01 00:00',
      rows: [
        {
          label: 'My row #1',
          bars: [
            {
              myStart: '2020-03-01 12:10',
              myEnd: '2020-03-01 16:35'
            }
          ]
        },
        {
          label: 'My row #2',
          bars: [
            {
              myStart: '2020-03-02 01:00',
              myEnd: '2020-03-02 12:00'
            },
            {
              myStart: '2020-03-02 13:00',
              myEnd: '2020-03-02 22:00'
            }
          ]
        }
      ]
    }
  },

  methods: {}
}
</script>

<style lang="stylus"></style>
