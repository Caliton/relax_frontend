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
          Cargo
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
              src="~src/statics/profiles.png"
              style="max-width: 350px; opacity: .8"
            />
          </div>

          <div class="col-md-5">
            <div class="column justify-center">
              <q-input
                class="col-md-12 q-ma-sm"
                filled
                v-model="profile.description"
                label="Description"
                dense
                error-message="Campo Precisa ser preenchido"
                :error="$v.profile.description.$error"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-person-outline" />
                </template>
              </q-input>
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
import { api } from 'src/enumerator/api'

export default {
  name: 'di-profile',

  events: ['on-close'],

  data () {
    return {
      show: false,
      loading: false,
      profile: {
        description: ''
      },

      isEditing: false
    }
  },

  validations: {
    profile: {
      description: { required }
    }
  },

  methods: {
    onShow (profile) {
      this.cleanFields()

      this.profile = { ...this.profile }
      this.isEditing = false

      this.show = true

      if (!profile) return

      this.isEditing = true

      this.profile = { ...profile }
    },

    onHide () {
      this.$emit('on-close')
      this.show = false
    },

    async confirm () {
      try {
        if (this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = api.profile

        const payLoad = {
          ...this.profile
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
      this.$v.profile.$touch()

      return this.$v.profile.$error
    },

    cleanFields () {
      this.profile = {}
      this.$v.profile.$reset()
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
