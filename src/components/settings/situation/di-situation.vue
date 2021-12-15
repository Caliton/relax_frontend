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
          Status do periodo
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
              src="~src/statics/feedstatus.png"
              style="max-width: 500px; opacity: .8"
            />
          </div>

          <div class="col-md-5">
            <div class="row justify-start">
              <q-select
                class="col-md-12 q-ma-sm"
                filled
                :options="comboIcon"
                v-model="situation.icon"
                label="Icone"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.icon.$error"
              >
                <template v-slot:prepend>
                  <q-icon
                    :style="{
                      color: `${
                        isHexColor(situation.color) ? situation.color : ''
                      }`
                    }"
                    :color="
                      `${!isHexColor(situation.color) ? situation.color : ''}`
                    "
                    :name="situation.icon.value"
                    class="cursor-pointer"
                  />
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section avatar>
                      <q-icon
                        :style="{
                          color: `${
                            isHexColor(situation.color) ? situation.color : ''
                          }`
                        }"
                        :color="
                          `${
                            !isHexColor(situation.color) ? situation.color : ''
                          }`
                        "
                        :name="scope.opt.icon"
                      />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label v-html="scope.opt.label" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.color"
                label="Cor"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.color.$error"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="eva-color-palette-outline"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        no-header
                        no-footer
                        format-model="hex"
                        default-view="palette"
                        v-model="situation.color"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon
                    :color="
                      `${!isHexColor(situation.color) ? situation.color : ''}`
                    "
                    :style="{
                      color: `${
                        isHexColor(situation.color) ? situation.color : ''
                      }`
                    }"
                    name="colorize"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        no-header
                        no-footer
                        format-model="hex"
                        default-view="palette"
                        v-model="situation.color"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.description"
                label="Nome"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.description.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-stop-circle-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.limitMonths"
                label="Diferença do prazo final em meses"
                mask="NNN"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.limitMonths.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-calendar-outline" />
                </template>
              </q-input>

              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="situation.tooltip"
                label="Descrição"
                dense
                maxlength="80"
                type="textarea"
                error-message="Campo Precisa ser preenchido"
                :error="$v.situation.tooltip.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-file-text-outline" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section />
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
import { api } from 'src/enumerator/api'

export default {
  name: 'di-situation',

  events: ['on-close'],

  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },

  props: {
    type: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      show: false,
      loading: false,
      situation: {
        description: '',
        limitMonths: '',
        tooltip: '',
        icon: {
          label: 'eva-person-outline',
          value: 'eva-person-outline',
          icon: 'eva-person-outline'
        },
        color: 'grey'
      },

      comboIcon: [
        {
          label: 'eva-person',
          value: 'eva-person',
          icon: 'eva-person'
        },
        {
          label: 'eva-alert-circle-outline',
          value: 'eva-alert-circle-outline',
          icon: 'eva-alert-circle-outline'
        },
        {
          label: 'eva-alert-triangle-outline',
          value: 'eva-alert-triangle-outline',
          icon: 'eva-alert-triangle-outline'
        },
        {
          label: 'eva-activity-outline',
          value: 'eva-activity-outline',
          icon: 'eva-activity-outline'
        },
        {
          label: 'eva-checkmark-circle-outline',
          value: 'eva-checkmark-circle-outline',
          icon: 'eva-checkmark-circle-outline'
        },
        {
          label: 'eva-clock-outline',
          value: 'eva-clock-outline',
          icon: 'eva-clock-outline'
        },
        {
          label: 'eva-close-outline',
          value: 'eva-close-outline',
          icon: 'eva-close-outline'
        },
        {
          label: 'eva-star-outline',
          value: 'eva-star-outline',
          icon: 'eva-star-outline'
        },
        {
          label: 'eva-camera-outline',
          value: 'eva-camera-outline',
          icon: 'eva-camera-outline'
        },
        {
          label: 'eva-briefcase-outline',
          value: 'eva-briefcase-outline',
          icon: 'eva-briefcase-outline'
        },
        {
          label: 'eva-checkmark-outline',
          value: 'eva-checkmark-outline',
          icon: 'eva-checkmark-outline'
        },
        {
          label: 'eva-person',
          value: 'eva-person',
          icon: 'eva-person'
        },
        {
          label: 'eva-person',
          value: 'eva-person',
          icon: 'eva-person'
        }
      ]
    }
  },

  validations: {
    situation: {
      description: { required },
      limitMonths: { required },
      tooltip: { required },
      icon: { required },
      color: { required }
    }
  },

  methods: {
    onShow (situation) {
      this.cleanFields()
      this.show = true

      if (!situation) return

      this.situation = situation
    },

    isHexColor (a) {
      let b = false

      if (a) b = a.includes('#')

      return b
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
        let url = api.situation

        const payLoad = {
          ...this.situation,
          icon: this.situation.icon.value,
          type: this.type
        }

        console.log(payLoad)

        if (payLoad.id) {
          url = api.situationGetBy
          url = url.replace('{id}', this.situation.id)
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
      this.$v.situation.$touch()

      return !this.$v.situation.$error
    },

    cleanFields () {
      this.situation = {
        description: '',
        limitMonths: '',
        tooltip: '',
        icon: {
          label: 'eva-person',
          value: 'eva-person',
          icon: 'eva-person'
        },
        color: 'grey'
      }

      this.$v.situation.$reset()
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
