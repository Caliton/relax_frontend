<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale">
    <q-card style="max-width: 80vw;" class="cachorro">
      <q-card-section>
        <!-- <q-btn label="INSERE TUDO" @click="insertMonster" /> -->
        <!-- <q-input outlined v-model="text" :dense="dense" /> -->
        <p style="color: #4caf50; font-size: 20pt">Feriado</p>
        <div class="row">
          <q-input
            class="col-md-12"
            filled
            v-model="holiday.description"
            placeholder="Nome"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.holiday.description.$error"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            filled
            dense
            v-model="holiday.date"
            class="col-md-4"
            placeholder="Admissão"
            error-message="Campo Precisa ser preenchido"
            :error="$v.holiday.date.$error"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="holiday.date" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-section></q-card-section>
      <q-card-actions style="margin: 10px;" class="text-teal container-card absolute-bottom-right">
        <q-btn color="light-blue" dense no-caps label="Salvar!" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event_bus.js'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'di-collaborator',

  events: ['on-close'],

  created () {
    EventBus.$on('on-edit-holiday', (holiday) => {
      this.onShow = true
      this.holiday = holiday
      this.holiday.date = moment(this.holiday.date, 'YYYY-MM-DD').format('DD-MM-YYYY')
    })

    EventBus.$on('on-new-holiday', () => {
      this.holiday = {}
      this.$nextTick(() => { this.$v.$reset() })
      this.onShow = true
    })
  },

  beforeDestroy () {
    EventBus.$off('on-edit-holiday')

    EventBus.$off('on-new-holiday')
  },

  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },

  data () {
    return {
      onShow: false,
      holiday: {
        description: '',
        date: '',
      }
    }
  },

  validations: {
    holiday: {
      name: { required },
      date: { required },
    }
  },

  methods: {
    onShowModal () {
      this.onShow = true
    },

    onHideModal () {
      this.$emit('on-close')
      this.onShow = false
    },

    async confirm () {
      try {
        if (!this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = 'holiday'

        let result = {}

        this.holiday.date = moment(this.holiday.date, 'DD-MM-YYYY').format('YYYY-MM-DD')

        if (!this.holiday.id) {
          result = await axiosFunction(url, this.holiday)
          this.holiday.id = result.data.id
        }

        if (this.holiday.id) {
          url += `/${this.holiday.id}/`
          axiosFunction = this.$axios.put

          await axiosFunction(url, this.holiday)
          EventBus.$emit('on-refresh-holiday')
        }

        this.holiday = {}
        this.$nextTick(() => { this.$v.$reset() })
        EventBus.$emit('on-refresh-holiday')
        this.onHideModal()
      } catch (e) {
        console.log(e)
      }
    },

    validationsFields () {
      this.$v.holiday.$touch()

      return !this.$v.holiday.$error
    },

    canceled () {
      this.onHideModal()
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
</style>