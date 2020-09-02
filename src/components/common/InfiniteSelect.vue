<template>
  <q-select
    v-model="model"
    outlined
    square
    dense
    use-input
    :disable="disable"
    color="accent"
    :class="[
      'full-width',
      { 'myPaddingOne': true },
      { 'q-mb-lg': required }
    ]"
    :label="getLabel"
    ref="mySelect"
    :rules="[
      () => !hasError()]"
    :error-message="getError()"
    @filter="filterOptions"
  >
    <template v-slot:no-option>
      <div>
        <q-infinite-scroll @load="onLoad" :offset="20" ref="infiniteScroll">
          <q-list>
            <q-item
              v-for="(item, index) in options"
              :key="index"
              clickable
              v-ripple
              :active="itemActive(item)"
              @click="putInModel(item, index)"
            >
              <q-item-section>{{ item[fieldLabel] }}</q-item-section>
            </q-item>
          </q-list>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-hourglass color="primary" size="2.5em"/>
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </template>

    <template v-slot:selected>
      <div>
        <div v-if="!multiple && model !== null">{{ model[fieldLabel] }}</div>
        <div v-else>
          <q-chip
            v-for="(option, index) in model"
            :key="index"
            dense
            removable
            @remove="removeItem(option)"
            color="grey-3"
            text-color="primary"
          >{{ option[fieldLabel] }}</q-chip>
        </div>
      </div>
    </template>

    <template v-slot:append>
      <div class="row items-center">
        <div v-if="multiple" class="q-mr-sm" style="padding-top: 3px">
          <div v-if="maxCount" class="row justify-end text-caption">{{model.length}}/{{maxCount}}</div>
          <div v-else class="row justify-end text-caption">{{model.length}}</div>
        </div>
        <div v-if="(!!model && clear && (model.length != 0))">
          <q-icon name="fas fa-times-circle" @click.stop="clearable()" class="cursor-pointer"/>
        </div>
      </div>
    </template>
  </q-select>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'InfiniteSelect',

  data () {
    return {
      model: (this.multiple) ? [] : null,
      options: [],
      filter: '',
      count: null,
      control: false,
      needGetElements: true
    }
  },

  created () {
    this.verifyValue()
  },

  computed: {
    getLabel () {
      if (this.translate) {
        return `${this.$t(this.label)}${(this.required && this.asterisk) ? ' *' : ''}`
      }
      return `${this.label}${(this.required && this.asterisk) ? ' *' : ''}`
    }
  },

  props: {
    value: {
      required: true
    },

    api: {
      type: String,
      default: ''
    },

    disable: {
      type: Boolean,
      deafult: false
    },

    itemsPerPage: {
      type: Number,
      default: 50
    },

    responseData: {
      type: String,
      default: 'data'
    },

    fieldId: {
      type: String,
      default: 'Id'
    },

    label: {
      type: String,
      default: ''
    },

    fieldLabel: {
      type: String,
      default: 'Name'
    },

    required: {
      type: Boolean,
      default: false
    },

    multiple: {
      type: Boolean,
      default: false
    },

    maxCount: {
      type: [ Number, Boolean ],
      default: false
    },

    clear: {
      type: Boolean,
      default: true
    },

    apiOption: {
      type: Array,
      default: () => { return [] },
      validator: (value) => {
        for (const el of value) {
          if (el.field === undefined || el.value === undefined) {
            return false
          }
        }
        return true
      }
    },

    asterisk: {
      type: Boolean,
      default: true
    },

    translate: {
      type: Boolean,
      default: true
    }
  },

  validations () {
    return {
      model: {
        required
      }
    }
  },

  watch: {
    value: function (val) {
      if (!this.multiple) {
        if (!this.control) {
          if (val === null) {
            this.model = null
          }
          this.verifyValue()
        } else {
          this.control = false
        }
      } else {
        // SELECT IS MULTIPLE
        if (this.needGetElements) {
          this.needGetElements = false
          if (this.model.length === 0) {
            this.verifyValue()
          }
        }
      }
    }
  },

  methods: {
    onLoad (page, done) {
      let params = {
        count: this.itemsPerPage,
        offset: (page - 1) * this.itemsPerPage,
        order: 'name'
      }
      if (this.filter !== '' && this.filter !== null) {
        params.name = this.filter
      }
      this.apiOption.forEach((el) => {
        if (el.value) {
          params[el.field] = el.value
        }
      })

      this.$axios.get(this.api, { params: params })
        .then((response) => {
          if (response.data.Result[Object.getOwnPropertyNames(response.data.Result)[0]]) {
            response.data.Result[Object.getOwnPropertyNames(response.data.Result)[0]].forEach(elem => this.options.push(elem))
            if (response.data.Result[Object.getOwnPropertyNames(response.data.Result)[0]].length < this.itemsPerPage) {
              if (this.$refs.infiniteScroll !== undefined) {
                this.$refs.infiniteScroll.stop()
              }
            }
            done()
          } else {
            this.$refs.infiniteScroll.stop()
            done()
          }
        })
        .catch(() => {
        })
    },
    verifyValue () {
      if (this.multiple) {
        if (this.value === null || typeof (this.value) === 'string') {
          this.$emit('input', [])
        } else if (typeof (this.value) === 'object') {
          this.model = this.value
        } else {
          this.value.forEach((id) => {
            this.getElementById(id)
          })
        }
      } else {
        if (this.value === null) {
          this.$emit('input', '')
        } else if (typeof (this.value) === 'object') {
          this.model = this.value
        } else {
          if (this.value !== '') {
            this.getElementById(this.value)
          }
        }
      }
    },
    putInModel (item) {
      if (!this.multiple) {
        this.model = item
        this.$emit('input', item)
        this.$refs.mySelect.hidePopup()
        this.control = true
        return
      }

      if (this.itemActive(item)) {
        this.removeItem(item)
        this.control = true
        return
      }

      if (this.maxCount) {
        if (this.model.length < this.maxCount) {
          if (this.model.length === (this.maxCount - 1)) {
            this.$refs.mySelect.hidePopup()
          }

          this.model.push(item)
          this.$emit('input', this.value)
        } else {
          // emitir mensagem de limite excedido
        }
      } else {
        this.model.push(item)
        this.$emit('input', this.value)
      }

      this.control = true
    },

    filterOptions (filter, update, abort) {
      abort(() => {
        this.$refs.mySelect.showPopup()
      })
      update(() => {
        this.filter = filter
        this.options = []
      })
    },

    getError () {
      if ((!this.$v.model.required) && this.required) {
        return this.$t('emptyField')
      }
      return ''
    },

    hasError () {
      return (this.required) ? !this.$v.model.required : false
    },

    clearable () {
      if (this.multiple) {
        this.model = []
        this.$emit('input', [])
      } else {
        this.model = null
        this.$emit('input', null)
      }
    },

    itemActive (item) {
      if (this.multiple) {
        return (this.value.find((el) => { return el[this.fieldId] === item[this.fieldId] }) !== undefined)
      } else {
        return this.value.Id === item[this.fieldId]
      }
    },

    removeItem (item) {
      this.model = this.model.filter((elem) => {
        return elem[this.fieldId] !== item[this.fieldId]
      })
      this.$emit('input', this.model)
    },

    getElementById (id) {
      this.$axios.get(`${this.api}/${id}`)
        .then((response) => {
          if (this.multiple) {
            this.model.push(response.data)
          } else {
            this.model = response.data
          }
        })
        .catch(() => {
        })
    },

    myValidate () {
      this.$refs.mySelect.validate()
    },

    resetValidation () {
      this.$refs.mySelect.resetValidation()
    }
  }
}
</script>

<style>
.q-field--outlined .q-field__control::before {
  border: 2px solid #5b5b5b;
}

.q-stepper__step-content .q-stepper__step-inner {
  padding: 12px;
}
</style>
