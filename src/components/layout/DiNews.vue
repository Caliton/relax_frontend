<template>
  <q-dialog
    v-model="onShow"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card style="max-width: 90vw; max-height: 80vh; height: auto">
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">Novidades!</q-toolbar-title>
      </q-toolbar>

      <q-card-section class="flex flex-center">
        <div class="row justify-around">
          <div class="col-5">
            <img src="../../statics/news_02.png" style="width: 100%" />
          </div>

          <div class="col-6">
            <div class="login-logo">
              <span> Relax 2021 - Versão 2.0 </span>
            </div>

            <ul class="text-weight-light" style="font-size: 18px">
              <li>
                Acesso aos colaboradores para realização do agendamento das
                próprias férias.
              </li>
              <li>
                Controle de acessos aos perfis admin, colaborador, RH e gestor.
              </li>
              <li>
                Configuração de status de situação por colaborador efetivo e
                colaborador estagiário.
              </li>
              <li>
                Geração automática de períodos, dias de direito e dias
                usufruídos de férias.
              </li>
              <li>Aprovação de agendamento de férias.</li>
              <li>Filtro de férias agendadas por período.</li>
              <li>
                Interface para cadastros:
                <ul style="font-size: 16px">
                  <li>Usuários.</li>
                  <li>Feriados.</li>
                  <li>
                    Dias de direito de férias, prazo limite da empresa e prazo
                    limite da CLT.
                  </li>
                  <li>
                    Dados para gerar os status de situação dos colaboradores.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </q-card-section>

      <q-card-section> </q-card-section>
      <q-card-section> </q-card-section>

      <q-card-actions class="text-teal absolute-bottom-right">
        <q-btn
          rounded
          color="primary"
          dense
          no-caps
          label="Fechar"
          @click="confirm"
        />
      </q-card-actions>

      <q-card-actions class="text-teal absolute-bottom-left">
        <q-checkbox
          keep-color
          v-model="reveleNews"
          @input="setStateNews"
          label="Não mostrar novamente"
          color="cyan"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'

export default {
  name: 'di-news',

  created () {
    EventBus.$on('on-show-news', event => {
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
