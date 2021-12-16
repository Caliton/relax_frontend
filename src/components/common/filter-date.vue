<template>
  <div>
    <q-input
      filled
      v-model="rangeDate.start"
      label="Data inicio"
      dense
      class="col-4 q-mb-md"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date
              :locale="locale"
              v-model="rangeDate.start"
              mask="DD-MM-YYYY"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  no-caps
                  label="Fechar"
                  rounded
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="rangeDate.start" mask="DD-MM-YYYY" format24h>
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  no-caps
                  label="Fechar"
                  rounded
                  color="primary"
                  flat
                />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-input
      filled
      v-model="rangeDate.final"
      label="Data final"
      dense
      class="col-4"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date
              :locale="locale"
              v-model="rangeDate.final"
              mask="DD-MM-YYYY"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  no-caps
                  label="Fechar"
                  rounded
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="rangeDate.final" mask="DD-MM-YYYY" format24h>
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  no-caps
                  label="Fechar"
                  rounded
                  color="primary"
                  flat
                />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import moment from 'moment'
import { locale } from 'src/enumerator/locale.js'

export default {
  name: 'filter-date',

  props: {},

  events: ['get-range'],

  data () {
    return {
      moment,
      locale,
      rangeDate: {
        start: moment()
          .subtract(1, 'd')
          .format('DD-MM-YYYY'),
        final: moment().format('DD-MM-YYYY')
      }
    }
  },

  watch: {
    'rangeDate.start': function (item) {
      this.$emit('get-range-start', item)
    },

    'rangeDate.final': function (item) {
      this.$emit('get-range-final', item)
    }
  },

  methods: {
    getRange () {
      console.log(this.rangeDate)
      this.$emit('get-range', this.rangeDate)
    }
  }
}
</script>

<style lang="stylus"></style>
