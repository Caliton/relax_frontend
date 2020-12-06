<template>
  <div class="row items-center">
    <div class="form">
      <div class="vue-csv-uploader-part-one">
        <q-uploader
          style="max-width: 300px"
          v-model="csv"
          @change.prevent="validFileMimeType"
          @added="load"
          @removed="reset"
          ref="csv"
          name="csv"
        >

          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
              <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" no-caps dense flat >
                Limpar Area
                <q-tooltip>Limpar area</q-tooltip>
              </q-btn>
              <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
                <q-tooltip>Remove Uploaded Files</q-tooltip>
              </q-btn>

              <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />

              <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" no-caps dense flat>
                Subir Arquivo csv
                <q-uploader-add-trigger />
              <q-tooltip>Adicionar Arquivo CSV</q-tooltip>
              </q-btn>

              <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
              <q-tooltip>Abort Upload</q-tooltip>
              </q-btn>
            </div>
          </template>

          <template v-slot:list="scope">
            <q-list separator>

              <q-item v-for="file in scope.files" :key="file.name">
                <q-item-section>
                  <q-item-label class="full-width ellipsis">
                    {{ file.name }}
                  </q-item-label>

                  <q-item-label caption>
                    Colaboradores encontrado: {{ value.length }}
                  </q-item-label>
                </q-item-section>

                <q-item-section
                  v-if="file.__img"
                  thumbnail
                  class="gt-xs"
                >
                  <img :src="file.__img.src">
                </q-item-section>

                <q-item-section top side>
                  <q-btn
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file)"
                  />
                </q-item-section>
              </q-item>

            </q-list>
          </template>
        </q-uploader>

        <div class="form-group csv-import-file">
          <slot name="error" v-if="showErrorMessage">
            <div class="invalid-feedback d-block">Tipo de Arquivo Invalido</div>
          </slot>
        </div>

        <div class="form-group">
          <slot name="next" :load="load">
            <!-- <q-btn
              @click.prevent="load"
              class="q-ma-sm"
              dense
              no-caps
              label="Processar "
              icon="eva-settings-2-outline"
              color="blue"
            />-->
          </slot>
        </div>
      </div>

      <!-- <div class="vue-csv-uploader-part-two">
        <div class="vue-csv-mapping" v-if="false">
          <table :class="tableClass">
            <slot name="thead">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>CSV Column</th>
                </tr>
              </thead>
            </slot>
            <tbody>
              <tr v-for="(field, key) in fieldsToMap" :key="key">
                <td>{{ field.label }}</td>
                <td>
                  <select
                    :class="tableSelectClass"
                    :name="`csv_uploader_map_${key}`"
                    v-model="map[field.key]"
                  >
                    <option :value="null" v-if="canIgnore">Ignore</option>
                    <option v-for="(column, key) in firstRow" :key="key" :value="key">{{ column }}</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="form-group" v-if="url">
            <slot name="submit" :submit="submit">
              <input
                type="submit"
                :class="buttonClass"
                @click.prevent="submit"
                :value="submitBtnText"
              />
            </slot>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { drop, every, forEach, get, isArray, map, set } from 'lodash'
import axios from 'axios'
import Papa from 'papaparse'
import mimeTypes from 'mime-types'

export default {

  events: ['reset-csv'],

  props: {
    value: Array,
    url: {
      type: String
    },
    mapFields: {
      required: true
    },
    callback: {
      type: Function,
      default: () => ({})
    },
    catch: {
      type: Function,
      default: () => ({})
    },
    finally: {
      type: Function,
      default: () => ({})
    },
    parseConfig: {
      type: Object,
      default () {
        return {}
      }
    },
    headers: {
      default: null
    },
    loadBtnText: {
      type: String,
      default: 'Next'
    },
    submitBtnText: {
      type: String,
      default: 'Submit'
    },
    autoMatchFields: {
      type: Boolean,
      default: false
    },
    autoMatchIgnoreCase: {
      type: Boolean,
      default: false
    },
    tableClass: {
      type: String,
      default: 'table'
    },
    checkboxClass: {
      type: String,
      default: 'form-check-input'
    },
    buttonClass: {
      type: String,
      default: 'btn btn-primary'
    },
    inputClass: {
      type: String,
      default: 'form-control-file'
    },
    validation: {
      type: Boolean,
      default: true
    },
    fileMimeTypes: {
      type: Array,
      default: () => {
        return ['text/csv', 'text/x-csv', 'application/vnd.ms-excel', 'text/plain']
      }
    },
    tableSelectClass: {
      type: String,
      default: 'form-control'
    },
    canIgnore: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    form: {
      csv: null
    },
    fieldsToMap: [],
    map: {},
    hasHeaders: true,
    csv: null,
    sample: null,
    isValidFileMimeType: false,
    fileSelected: false
  }),

  created () {
    this.hasHeaders = this.headers

    if (isArray(this.mapFields)) {
      this.fieldsToMap = map(this.mapFields, (item) => {
        return {
          key: item,
          label: item
        }
      })
    } else {
      this.fieldsToMap = map(this.mapFields, (label, key) => {
        return {
          key: key,
          label: label
        }
      })
    }
  },

  methods: {
    submit () {
      const _this = this
      this.form.csv = this.buildMappedCsv()
      this.$emit('input', this.form.csv)

      if (this.url) {
        axios.post(this.url, this.form).then(response => {
          _this.callback(response)
        }).catch(response => {
          _this.catch(response)
        }).finally(response => {
          _this.finally(response)
        })
      } else {
        _this.callback(this.form.csv)
      }
    },

    reset () {
      this.$emit('reset-csv')
    },

    buildMappedCsv () {
      const _this = this

      const csv = this.hasHeaders ? drop(this.csv) : this.csv

      return map(csv, (row) => {
        const newRow = {}

        forEach(_this.map, (column, field) => {
          set(newRow, field, get(row, column))
        })

        return newRow
      })
    },
    validFileMimeType () {
      const file = this.$refs.csv.files[0]
      const mimeType = file.type === '' ? mimeTypes.lookup(file.name) : file.type

      if (file) {
        this.fileSelected = true
        this.isValidFileMimeType = this.validation ? this.validateMimeType(mimeType) : true
      } else {
        this.isValidFileMimeType = !this.validation
        this.fileSelected = false
      }
    },
    validateMimeType (type) {
      return this.fileMimeTypes.indexOf(type) > -1
    },

    load () {
      const _this = this

      this.readFile((output) => {
        _this.sample = get(Papa.parse(output, { preview: 2, skipEmptyLines: true }), 'data')
        _this.csv = get(Papa.parse(output, { skipEmptyLines: true }), 'data')
      })
    },

    readFile (callback) {
      const file = this.$refs.csv.files[0]

      if (file) {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = function (evt) {
          callback(evt.target.result)
        }
        reader.onerror = function () {
        }
      }
    },
    toggleHasHeaders () {
      this.hasHeaders = !this.hasHeaders
    },
    makeId (id) {
      return `${id}${this._uid}`
    }
  },
  watch: {
    map: {
      deep: true,
      handler: function (newVal) {
        if (!this.url) {
          const hasAllKeys = Array.isArray(this.mapFields) ? every(this.mapFields, function (item) {
            // eslint-disable-next-line no-prototype-builtins
            return newVal.hasOwnProperty(item)
          }) : every(this.mapFields, function (item, key) {
            // eslint-disable-next-line no-prototype-builtins
            return newVal.hasOwnProperty(key)
          })

          if (hasAllKeys) {
            this.submit()
          }
        }
      }
    },
    sample (newVal, oldVal) {
      if (this.autoMatchFields) {
        if (newVal !== null) {
          this.fieldsToMap.forEach(field => {
            newVal[0].forEach((columnName, index) => {
              if (this.autoMatchIgnoreCase === true) {
                if (field.label.toLowerCase().trim() === columnName.toLowerCase().trim()) {
                  this.$set(this.map, field.key, index)
                }
              } else {
                if (field.label.trim() === columnName.trim()) {
                  this.$set(this.map, field.key, index)
                }
              }
            })
          })
        }
      }
    }
  },
  computed: {
    firstRow () {
      return get(this, 'sample.0')
    },
    showErrorMessage () {
      return this.fileSelected && !this.isValidFileMimeType
    },
    disabledNextButton () {
      return !this.isValidFileMimeType
    }
  }
}
</script>
