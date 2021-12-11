<template>
  <q-dialog
    v-model="show"
    transition-show="scale"
    transition-hide="scale"
    persistent
    style="height: auto !important"
  >
    <q-card
      style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto !important"
    >
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">
          Feriado
        </q-toolbar-title>
        <q-btn
          class="float-right"
          flat
          round
          dense
          icon="close"
          @click="canceled"
        />
      </q-toolbar>

      <q-card-section style="height: auto !important;">
        <div class="row justify-around">
          <div class="col-md-5 flex flex-center">
            <q-img
              src="~src/statics/holiday.png"
              style="max-width: 350px; opacity: .8"
            />
          </div>

          <div class="col-md-5">
            <div class="row justify-center">
              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="holiday.name"
                label="Descrição"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.holiday.name.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                reverse-fill-mask
                dense
                v-model="holiday.date"
                mask="##-##-####"
                maxlength="10"
                label="Data"
                error-message="Campo precisa ser preenchido"
                :error="$v.holiday.date.$error"
                @blur="$v.holiday.date.$touch()"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-calendar-outline" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="holiday.date"
                        mask="DD-MM-YYYY"
                        default-view="Years"
                        :locale="myLocale"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fechar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-select
                class="col-md-12 q-ma-sm"
                filled
                :options="comboType"
                v-model="holiday.type"
                label="Tipo"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.holiday.type.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-more-vertical-outline" />
                </template>
              </q-select>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section></q-card-section>
      <q-card-actions
        style="margin: 10px;"
        class="text-teal container-card absolute-bottom-right"
      >
        <q-btn color="primary" dense no-caps label="salvar" @click="confirm" />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-facebook color="light-blue" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import { api } from 'src/enumerator/api'

export default {
  name: 'di-holiday',

  events: ['on-close'],

  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },

  data () {
    return {
      show: false,
      loading: false,
      holiday: {
        name: '',
        type: { value: 'regional', label: 'Regional' },
        date: moment().format('YYYY-MM-DD')
      },

      myLocale: {
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split(
          '_'
        ),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split(
          '_'
        ),
        firstDayOfWeek: 1
      },

      comboType: [
        { value: 'national', label: 'Nacional' },
        { value: 'regional', label: 'Regional' }
      ]
    }
  },

  validations: {
    holiday: {
      name: { required },
      type: { required },
      date: { required }
    }
  },

  methods: {
    onShow (holiday) {
      this.cleanFields()

      this.show = true

      if (!holiday) return

      this.holiday = { ...holiday }
    },

    onHide () {
      this.$emit('on-close')
      this.show = false
    },

    async confirm () {
      try {
        if (!this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = api.holiday

        const payLoad = {
          ...this.holiday,
          type: this.holiday.type.value,
          date: moment(this.holiday.date).format('YYYY-MM-DD')
        }

        if (payLoad.id) {
          url += `/${payLoad.id}/`
          axiosFunction = this.$axios.put
        }

        this.loading = true
        await axiosFunction(url, payLoad)

        this.onHide()
        this.show = false
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    validationsFields () {
      this.$v.holiday.$touch()

      return !this.$v.holiday.$error
    },

    cleanFields () {
      this.holiday = {}
      this.$v.holiday.$reset()
    },

    canceled () {
      this.onHide()
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
