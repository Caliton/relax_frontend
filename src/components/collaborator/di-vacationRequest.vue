<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale">
    <q-card style="width: 800px; max-width: 80vw;">
      <q-card-section class="q-gutter-lg">
        <div class="row">
          <p style="color: #4caf50; font-size: 20pt">Período</p>
        </div>
        <!-- <q-input outlined v-model="text" :dense="dense" /> -->

        <div class="row">
          <q-select
            label="Período"
            class="col-md-10 col-sm-10"
            transition-show="scale"
            transition-hide="scale"
            filled
            @input="setVacationCombo"
            v-model="selectedOption"
            :options="vacationsCombo"
          >
            <template v-slot:after>
              <q-btn round dense icon="add" color="green">
                <q-menu
                  anchor="top left"
                  self="top left"
                >
                  <div class="row no-wrap q-pa-md">
                    <div class="column q-gutter-sm">
                      <div class="text-h6 q-mb-md">Inserir novo periodo</div>

                      <q-input
                        filled
                        v-model="vacationTime.vacationYear"
                        label="Ano"
                        dense
                        lazy-rules
                      />

                      <q-input
                        filled
                        v-model="vacationTime.daysAllowed"
                        label="Dias de direito"
                        dense
                        lazy-rules
                      />

                      <q-input filled dense v-model="vacationTime.hiringDate" class="col-md-4" label="Admissão">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-date v-model="vacationTime.hiringDate" mask="DD-MM-YYYY" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>

                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time v-model="vacationTime.hiringDate" mask="DD-MM-YYYY" format24h />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>

                      <q-input
                        filled
                        dense
                        v-model="vacationTime.birthDay"
                        class="col-md-4 q-mr-sm"
                        label="Salve"
                      >
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-date v-model="vacationTime.birthDay" mask="DD-MM-YYYY" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>

                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time v-model="vacationTime.birthDay" mask="DD-MM-YYYY" format24h />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>

                      <q-btn
                        color="primary"
                        label="Salvar"
                        @click="registerVacation"
                        push
                        size="sm"
                        v-close-popup
                      />
                    </div>
                  </div>
                </q-menu>
              </q-btn>
            </template>
          </q-select>
        </div>


        <div class="row q-gutter-md">

          <div v-if="vacationSelected.id" >
            <span class="vacations-label">Dias de Direito: </span> 
              {{vacationSelected.daysAllowed }} </br>
            
            <span class="vacations-label">Dias  Usufruídos: </span>  
              {{vacationSelected.daysEnjoyed }} </br>
            
            <span class="vacations-label">Dias Saldos: </span> 
              {{vacationSelected.daysBalance}} </br>
            
            <span class="vacations-label">Data Limite: </span> 
              {{vacationSelected.limitDate  | moment('DD-MM-YYYY') }} -----> {{vacationSelected.limitDate }} </br>
            
            <span class="vacations-label">Limite com 6 meses: </span> 
              {{vacationSelected.limit6Months | moment('DD-MM-YYYY') }} ---> {{vacationSelected.limit6Months}}</br>
          </div>

        </div>
      </q-card-section>

      <q-card-section>
        <p style="color: #4caf50; font-size: 20pt">Solicitação</p>
      </q-card-section>
      <q-card-actions style="margin: 10px;" class="text-teal container-card absolute-bottom-right">
        <q-btn color="light-blue" dense no-caps label="Salvar!" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from "src/functions/event_bus.js";


import moment from "moment";

export default {
  name: "di-vacation-request",

  events: ["on-close"],
  
  created() {
    EventBus.$on("on-show-vacation-request", (data) => {
      this.onShow = true;
      if (data) {
        this.getVacationsTimes(data);
      }
    });
  },

  beforeDestroy() {
    EventBus.$off("on-show-vacation-request");
  },

  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
  },

  data() {
    return {
      onShow: false,
      vacations: [],
      vacationSelected: {},
      vacationTime: {
        vacationYear: "",
        daysAllowed: 30,
      },
      model: "2019-02-22 21:02",
      showInputVacationTime: false,
      vacationsCombo: [],
      selectedOption: {label: 'Carregando', value: 2020} ,
    };
  },

  methods: {
    removeAt(idx) {
      this.guests.splice(idx, 1);
    },

    add() {
      this.id++;
      this.guests.push({ id: this.id, name: "", relationShip: "" });
    },

    onShowModal() {
      this.onShow = true;
    },

    onHideModal() {
      this.$emit("on-close");
      this.onShow = false;
    },
    openNewVacationTime() {
      this.showInputVacationTime = true;
    },

    setVacationCombo (vacationSelected) {

      this.vacationSelected = this.vacations.find((item) => item.id === vacationSelected.value)


      console.log('Deu certo safado;: ', this.vacationSelected)

    },

    async getVacationsTimes (personId) {
      try {
        let result = await this.$axios.get('person/{id}/vacationtime'.replace('{id}', personId));

        this.vacationsCombo = []
        this.vacations = result.data

        result.data.forEach((item) => {
          this.vacationsCombo.push({label: item.vacationDate.split('-')[0], value: item.id})
        })
        console.log('Olha o nego ai: ', result)
      } catch (e) {
        console.log(e);
      }
    },


    async confirm() {
      try {
        let axiosFunction = this.$axios.post;
        let url = "person";

        let result = {};

        this.person.birthDay = moment(Date.now()).format("YYYY-MM-DD");
        this.person.hiringDate = moment(Date.now()).format("YYYY-MM-DD");

        if (!this.person.id) {
          result = await axiosFunction(url, this.person);
          this.person.id = result.data.id;
        }

        if (this.person.id) {
          url += `/${this.person.id}/`;
          axiosFunction = this.$axios.put;

          await axiosFunction(url, this.person);
          EventBus.$emit("on-refresh-evaluation");
        }

        EventBus.$emit("on-refresh-person");
        this.onHideModal();
      } catch (e) {
        console.log(e);
      }
    },

    canceled() {
      this.onHideModal();
    },
  },
};
</script>

<style lang="stylus">
.list-guest {
  list-style: none;

  .q-field--focused .q-field__control {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    background: #F2F2F2 !important;
  }
}

.vacations-label
  color $green
</style>
