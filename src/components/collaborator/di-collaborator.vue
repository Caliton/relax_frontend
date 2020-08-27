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

    // insertMonster() {
    //   let colaborator = [
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Andre Vasconcelos Souto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Angélica Lúcio Fidale Sampaio",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Anna Paula Graboski Correia Lima",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Anna Paula Graboski Correia Lima - Acesso Publico",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Antonio Carlos Neto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Arthur Henrique Silva Ferreira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Bruno Alberto de Oliveira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Bruno de Paula Nery",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Caio Cezar Queiroz",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Caliton Marcos Gonçalves Junior",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Camila Ribeiro Ramires",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Camila Tavares Mota",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Carla de Mello Caixeta",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Carlos Augusto Dantas Marquez",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Carlos Dantas",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Carlos Marques",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Carlos Pena Langoni",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Cesar Gonçalves",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Daniel Lucas Ferreira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Danielly Souza Silva",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Dejanir de Almeida Júnior",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Diego Rafael Carvalho",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Douglas Alcantara de Araujo Cata Preta",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Dyonatan Diogo Dias Souza",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Emilia de Souza Vieira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Ernane Benedito Vieira Junior",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Evelise Graboski Correia Lima",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Fabiano Araujo",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Fabíola Nogueira Leal",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Fabrício Pinho Palmezoni",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Felipe Freitas da Silva",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Gitlab Service",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "gitlabadmin",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Glenda Neves Santos Schwanz",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Guilherme Ferreira Ribeiro",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Isaac Nascimento Gomes",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Ivan Arantes Coimbra Jurnior",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Jessica Almeida Pereira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Jéssica Maria Teixeira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "João Vitor Alves Passos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "José dos Santos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "José Ribeiro Filho",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "José Ricardo",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Joyce Emanuele Oliveira Silva",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Laís dos Santos Marra Bisinotto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Layr Stefen Araújo de Souza",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "ldxtools",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Leandro Eduardo Borges Carneiro",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Leonardo Camargos Lemes",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Leonardo Rodrigues Gonçalves",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Letícia Figueredo",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Leticia Ramos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Lourival de Freitas Pedrosa Neto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Luan Oliveira Freitas",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Lucas de Assis dos Santos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Lucas Graboski Correia Lima",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Lucas Rossi Rabelo",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Marcela Micaela Moreira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Marcelo Henrique do Nascimento",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Marcelo Macedo de Melo Silva",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Marco Antônio da Silva Rodrigues",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Maria Gabriella Paganini Duran Rebouças",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Maria Luiza de Barros Ramos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Mariana Luiza Volpi Fiori",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Miguel da Rocha Correia Lima",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Moara Vieira Fonseca",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Myllena Queiroz Martins",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Nathália Martins Ribeiro Yunes",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Nicolas Araújo Nogueira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Nina Cervilha Oliveira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Orlando Silva Martins Neto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Patrick Coelho Freitas",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Paulo Contini Junior",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Pedro Henrique Morita",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Pedro Henrique Rodovalho Alves",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Pedro Severino M. Neto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Pollyanna Aparecida de Melo Ramos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Rangel Otoni",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Renzo Rodrigues Santos",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Ricardo Rezende",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Roberta Alves Moro",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Rodrigo Borborema Nogueira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Rodrigo Borges Machado",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Rodrigo Uehara Dias",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Sebastião Aquino de Resende Neto",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Silvestre de Caldas",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Tais Clemente",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Talitha Cristina Salomé Silva",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Tamara Ferreira Ayres",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Tayná Barreiros Moreira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Thamires da Silva Vieira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Thiago Borges Vieira",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Thiago Rosa De Sousa",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Tiago Rodrigues Morais",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Valdson Bezerra de Souza",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Vinicius Costa Faria",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Viviane Teles de Souza",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Walthony Alves Almeida",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "Wender Vinícius Batista Duarte",
    //       lastName: "any",
    //     },
    //     {
    //       birthDay: "2020-08-20",
    //       hiringDate: "2020-08-22",
    //       firstName: "William de Oliveira Garcez",
    //       lastName: "any",
    //     },
    //   ];

    //   colaborator.forEach(async (item) => {
    //     let result = await this.$axios.post("person", item);
    //     console.log("Bixo Inserido: ", item.firstName);
    //   });
    // },

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
