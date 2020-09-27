<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale" persistent>
    <q-card style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto">
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">Novidades!</q-toolbar-title>
      </q-toolbar>

      <q-card-section class="flex flex-center">
        <div class="row justify-around">
          <div class="col-5">
            <img src="../../statics/news_02.png" style="width: 100%"/>
          </div>

          <div class="col-6">
            <div class="login-logo">
              <span>Relax</span>
            </div>

            <ul class="text-weight-light" style="font-size: 18px">
              <li>Acesso liberado para equipe de RH e Gestão</li>
              <li>Visualização de Status</li>
            </ul>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
      </q-card-section>
      <q-card-section>
      </q-card-section>

      <q-card-actions class="text-teal absolute-bottom-right">
        <q-btn rounded color="light-blue" dense no-caps label="Fechar" @click="confirm" />
      </q-card-actions>

      <q-card-actions class="text-teal absolute-bottom-left">
        <q-checkbox keep-color v-model="reveleNews" @input="setStateNews" label="Não mostrar novamente" color="cyan" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'

export default {
  name: 'di-news',

  created () {
    EventBus.$on('on-show-news', (event) => {
      this.onShowDialog()
    })

    if (!localStorage.getItem('revele-news')) {
      localStorage.setItem('revele-news', true)
    }
  },

  beforeDestroy () {
    EventBus.$off('on-show-news')
  },

  data () {
    return {
      onShow: false,
      reveleNews: localStorage.getItem('revele-news') === 'false'
    }
  },

  mounted () {
    if (localStorage.getItem('revele-news') === 'true') {
      EventBus.$emit('on-show-news')
    }
  },

  methods: {
    onShowDialog () {
      this.onShow = true
    },

    setStateNews (item) {
      localStorage.setItem('revele-news', !item)
    },

    onHideDialog () {
      this.onShow = false
    },

    confirm () {
      this.onHideDialog()
    },

    canceled () {
      this.onHideDialog()
    }
  }
}
</script>

<style lang="stylus">
.list-guest {
  list-style: none;

  .q-field--focused .q-field__control {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    background: #F2F2F2 !important;
  }
}
.login-logo
  text-align left
  font-size 1.5rem

</style>
