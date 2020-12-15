<template>
  <q-page class="flex flex-center min-height">
    <q-img src="~src/statics/beach.png" style="max-width: 600px; position: absolute;" />
  </q-page>
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
