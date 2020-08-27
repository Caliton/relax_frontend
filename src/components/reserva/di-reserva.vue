<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale">
    <q-card style="max-width: 80vw;" class="cachorro">
      <q-card-section>
        <!-- <q-input outlined v-model="text" :dense="dense" /> -->
        <p style="color: #4caf50; font-size: 20pt">Colaborador</p>
        <div class="row">
          <q-input
            class="col-md-12"
            filled
            v-model="person.firstName"
            placeholder="Nome"
            dense
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'digite o nome do Colaborador'
            ]"
          />
        </div>

        <div class="row">
          <q-input
            class="col-md-12"
            filled
            v-model="person.lastName"
            placeholder="Sobrenome"
            dense
            lazy-rules
            :rules="[
              val =>
                (val && val.length > 0) || 'digite o sobrenome do Colaborador '
            ]"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input filled dense v-model="person.hiringDate" class="col-md-4" placeholder="Admissão">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="person.hiringDate" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="person.hiringDate" mask="DD-MM-YYYY" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            dense
            v-model="person.birthDay"
            class="col-md-4 q-mr-sm"
            placeholder="Aniversário"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="person.birthDay" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="person.birthDay" mask="DD-MM-YYYY" format24h />
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
import { EventBus } from "src/functions/event_bus.js";
import moment from "moment";

export default {
  name: "di-collaborator",

  events: ["on-close"],

  created() {
    EventBus.$on("on-edit-person", (person) => {
      this.onShow = true;
      this.person = person;
    });

    EventBus.$on("on-new-person", () => {
      this.onShow = true;
    });
  },

  beforeDestroy() {
    EventBus.$off("on-edit-person");
  },

  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
  },

  data() {
    return {
      onShow: false,
      person: {
        firstName: "",
        lastName: "",
        hiringDate: "",
        birthDay: "",
      },
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
</style>
