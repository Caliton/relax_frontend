<template>
  <q-select
    v-model="model"
    :outlined="outlined"
    :square="square"
    :dense="dense"
    :rounded="rounded"
    :hide-bottom-space="hideBottomSpace"
    :class="[inputClass, { myPaddingOne: true, 'q-mb-md': required }]"
    :filled="filled"
    :options-dense="optionsDense"
    :standout="standout"
    :label-color="color"
    :bg-color="bgColor"
    use-input
    :disable="disable"
    :label="getLabel"
    ref="mySelect"
    :error="$v.model.$error && this.required"
    :error-message="getError()"
    @blur="validyEmptyError"
    @filter="filterOptions"
    @popup-show="onOpenPopup"
  >
    <template v-slot:prepend>
      <q-icon v-if="icon" :color="color" :name="icon" />
    </template>

    <template v-slot:no-option>
      <div>
        <q-infinite-scroll
          @load="onLoad"
          :offset="20"
          :style="`max-height: ${maxHeight}`"
          ref="infiniteScroll"
        >
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
              <q-spinner-hourglass color="primary" size="2.5em" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </template>

    <template v-slot:selected>
      <div>
        <div v-if="!multiple && model !== null">
          {{
            model[fieldLabel]
              ? model[fieldLabel].length >= 35
                ? model[fieldLabel].substr(0, 35) + '...'
                : model[fieldLabel]
              : model[fieldLabel]
          }}
        </div>
        <div v-else>
          <q-chip
            v-for="(option, index) in model"
            :key="index"
            dense
            removable
            @remove="removeItem(option)"
            text-color="primary"
            >{{ option[fieldLabel] }}</q-chip
          >
        </div>
      </div>
    </template>

    <template v-slot:append>
      <div class="row items-center">
        <div v-if="multiple" style="padding-top: 3px">
          <div v-if="maxCount" class="row justify-end text-caption">
            {{ model.length }}/{{ maxCount }}
          </div>
          <div v-else class="row justify-end text-caption">
            {{ model.length }}
          </div>
        </div>
        <div v-if="!!model && !notClear && model.length != 0">
          <q-icon
            size="xs"
            :color="color"
            name="eva-close-circle-outline"
            @click.stop="clearable()"
            class="cursor-pointer"
          />
        </div>
      </div>
    </template>

    <template v-slot:after>
      <slot name="after"></slot>
      <q-btn
        v-if="btnAfter"
        round
        dense
        flat
        icon="eva-edit-outline"
        @click="onBtnAft"
      >
        <q-tooltip v-if="tooltip !== ''" content-class="bg-green">
          {{ tooltip }}
        </q-tooltip>
      </q-btn>
    </template>
  </q-select>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'InfinitySelect',

  event: ['on-input', 'on-btn-after', 'on-popup'],

  data () {
    return {
      model: this.multiple ? [] : null,
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
        return `${this.label}${this.required && this.asterisk ? ' *' : ''}`
      }
      return `${this.label}${this.required && this.asterisk ? ' *' : ''}`
    }
  },

  props: {
    value: {
      required: true
    },

    color: {
      type: String
    },

    tooltip: {
      type: String,
      default: ''
    },

    extraQueryParams: {
      type: Array,
      default: () => []
    },

    bgColor: {
      type: String
    },

    standout: {
      type: Boolean,
      default: false
    },

    btnAfter: {
      type: Boolean,
      default: false
    },

    optionsDense: {
      type: Boolean,
      default: false
    },

    api: {
      type: String,
      default: ''
    },

    icon: {
      type: String,
      default: ''
    },

    inputClass: {
      type: String
    },

    disable: {
      type: Boolean,
      deafult: false
    },

    itemsPerPage: {
      type: Number,
      default: 10
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

    maxHeight: {
      type: String,
      default: '300px'
    },

    fieldLabel: {
      type: String,
      default: 'Name'
    },

    queryParamFilter: {
      type: String,
      default: 'name__icontains'
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
      type: [Number, Boolean],
      default: false
    },

    isAligned: {
      type: Boolean,
      default: false
    },

    notClear: {
      type: Boolean,
      default: false
    },

    outlined: {
      type: Boolean,
      default: false
    },

    square: {
      type: Boolean,
      default: false
    },

    dense: {
      type: Boolean,
      default: false
    },

    rounded: {
      type: Boolean,
      default: false
    },

    filled: {
      type: Boolean,
      default: false
    },

    hideBottomSpace: {
      type: Boolean,
      default: false
    },

    apiOption: {
      type: Array,
      default: () => {
        return []
      },
      validator: value => {
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
      default: false
    },

    translate: {
      type: Boolean,
      default: true
    },

    order: {
      type: String,
      default: ''
    },

    defaultValueCodeDescription: {
      type: Boolean,
      default: false
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
    onBtnAft () {
      this.$emit('on-btn-after')
    },

    onOpenPopup () {
      this.$emit('on-popup')
    },

    onLoad (page, done) {
      const params = {
        // order: 'name',
        limit: this.itemsPerPage,
        count: this.itemsPerPage,
        offset: this.itemsPerPage * (page - 1)
      }

      if (this.extraQueryParams.length > 0) {
        this.extraQueryParams.map(param => {
          params[param.name] = param.value
        })
      }

      if (this.filter !== '' && this.filter !== null) {
        params[this.queryParamFilter] = this.filter
      }

      if (this.order !== '' && this.order !== null) {
        params.order = this.order
      }

      // this.apiOption.forEach(el => {
      //   if (el.value) {
      //     params[el.field] = el.value
      //   }
      // })

      this.$axios
        .get(this.api, { params })
        .then(response => {
          const responseData = response.data
          if (responseData) {
            if (this.defaultValueCodeDescription) {
              if (this.options.filter(item => item.code === '0').length === 0) {
                this.options.push({ code: '0', description: '-' })
              }
            }
            responseData.forEach(elem => this.options.push(elem))

            if (responseData.length < this.itemsPerPage) {
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
        .catch(err => {
          console.log(err)
        })
    },

    verifyValue () {
      if (this.multiple) {
        if (this.value === null || typeof this.value === 'string') {
          this.$emit('input', [])
        } else if (typeof this.value === 'object') {
          this.model = this.value
        } else {
          this.value.forEach(id => {
            this.getElementById(id)
          })
        }
      } else {
        if (this.value === null) {
          this.$emit('input', '')
        } else if (typeof this.value === 'object') {
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
          if (this.model.length === this.maxCount - 1) {
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

    validyEmptyError () {
      this.$v.model.$touch()
      this.getError()
      return !this.$v.model.$error
    },

    getError () {
      if (!this.$v.model.required && this.required) {
        return 'Campo obrigatório'
      }
      return ''
    },

    hasError () {
      return this.required ? !this.$v.model.required : false
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
        return (
          this.value.find(el => {
            return el[this.fieldId] === item[this.fieldId]
          }) !== undefined
        )
      } else {
        return this.value.Id === item[this.fieldId]
      }
    },

    removeItem (item) {
      this.model = this.model.filter(elem => {
        return elem[this.fieldId] !== item[this.fieldId]
      })
      this.$emit('input', this.model)
    },

    getElementById (id) {
      this.$axios
        .get(`${this.api}${id}/`)
        .then(response => {
          if (this.multiple) {
            this.model.push(response.data)
          } else {
            this.model = response.data
          }
        })
        .catch(err => {
          console.log(err)
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
