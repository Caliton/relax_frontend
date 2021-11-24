<template>
  <div
    style="width: 50px; height: 50px; border-radius: 20px; background-color: #f2f4f5; text-align: center; overflow: hidden; transition: background .2s ease-in-out;"
  >
    <div
      style="font-size: 8px; height: 15px; line-height: 15px; background-color: #d83556; font-weight: 600; color: white; text-transform: uppercase"
    >
      {{ getMonth(parseInt(date.split('-')[1])) }}
    </div>
    <div
      style="font-size: 16px; height: 35px; line-height: 30px; color #1c242b; font-weight: 500"
    >
      {{ date | moment('DD') }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'circleCalendar',

  components: {},

  props: {
    date: {
      type: String,
      default: '2010-01-01'
    }
  },

  data () {
    return {
      moment
    }
  },

  methods: {
    getMonth (item) {
      item--
      return 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_')[item]
    }
  }
}
</script>

<style lang="stylus"></style>
