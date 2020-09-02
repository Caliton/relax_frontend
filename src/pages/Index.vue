<template>
  <q-page class="flex flex-center"></q-page>
</template>

<script>
export default {
  name: 'PageIndex',

  components: {},

  data () {
    return {
      idUser: localStorage.getItem('userId')
    }
  },

  methods: {}
}
</script>

<style lang="stylus"></style>
