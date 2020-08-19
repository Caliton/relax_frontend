<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      no-data-label="Ainda não temos colaboradores cadastrados"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      :visible-columns="visibleColumns"
      rows-per-page-label="Registros por páginas"
      binary-state-sort
    >
      <template v-slot:top>
        <q-btn
          color="primary"
          :disable="loading"
          label="Adicionar Colaborador"
          no-caps
          @click="openDialog"
        />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols.filter((item) => item.name !== 'id')"
            :key="col.name"
            :props="props"
          >{{ col.label }}</q-th>

          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td :props="props" key="status">
            <q-icon v-if="true" color="green" name="eva-checkmark-circle-outline" />
            <q-icon v-else color="red" name="eva-close-circle-outline" />
          </q-td>

          <q-td auto-width :props="props" key="firstName">{{props.row.firstName}}</q-td>
          <q-td auto-width :props="props" key="lastName">{{props.row.lastName}}</q-td>
          <q-td
            auto-width
            :props="props"
            key="hiringDate"
          >{{ props.row.hiringDate | moment('DD-MM-YYYY')}}</q-td>
          <q-td
            auto-width
            :props="props"
            key="birthDay"
          >{{props.row.birthDay | moment('DD-MM-YYYY')}}</q-td>

          <q-td auto-width>
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="light-blue"
              round
              dense
              icon="eva-edit-outline"
              @click="openEdit(props.row)"
            />
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="red"
              round
              dense
              icon="eva-trash-2-outline"
              @click="openDelete(props.row)"
            />
          </q-td>
        </q-tr>
      </template>

      <div
        v-if="false"
        slot="bottom"
        slot-scope="props"
        class="flex flex-center"
        style="width: 100%;"
      >
        <div class="q-pa-lg flex flex-center absolute-bottom" style="margin-top: 10rem !important">
          <q-pagination
            v-model="props.pagination.page"
            :max="props.pagesNumber"
            :direction-links="true"
            @input="setPagination"
          />
        </div>
      </div>
    </q-table>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir a Avaliação?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Vou pensar melhor..." color="grey" v-close-popup />
          <q-btn
            flat
            no-caps
            label="Sim, não quero mais!"
            color="red"
            @click="deletePerson"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { EventBus } from "src/functions/event_bus.js";
import moment from "moment";

export default {
  name: "dt-colaborator",

  props: ["btn-primary"],

  data() {
    return {
      filter: "",
      showDelete: false,
      loading: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      visibleColumns: [
        "status",
        "firstName",
        "lastName",
        "hiringDate",
        "birthDay",
      ],
      columns: [
        { align: "left", name: "id", label: "id", field: "id", sortable: true },
        {
          align: "left",
          name: "status",
          label: "Status",
          field: "status",
          sortable: true,
          style: "width: 10px",
          headerStyle: "width: 50px",
        },
        {
          align: "left",
          name: "firstName",
          label: "Nome",
          field: "firstName",
          sortable: true,
        },
        {
          align: "left",
          name: "lastName",
          label: "Sobrenome",
          field: "lastName",
          sortable: true,
        },
        {
          align: "left",
          name: "hiringDate",
          label: "Data de admissão",
          field: "hiringDate",
          sortable: true,
        },
        {
          align: "left",
          name: "birthDay",
          label: "Aniversário",
          field: "birthDay",
          sortable: true,
        },
      ],
      data: [],
    };
  },

  created() {
    EventBus.$on("on-refresh-person", (event) => {
      this.refresh();
    });
  },

  beforeDestroy() {
    EventBus.$off("on-refresh-person");
  },

  mounted() {
    this.refresh();
  },
  methods: {
    openDialog() {
      EventBus.$emit("on-new-person");
    },

    async onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      this.loading = true;

      const fetchCount =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

      const startRow = (page - 1) * rowsPerPage;

      let returnedData = await this.$axios.get("person");

      returnedData.data.forEach((item, i) => {
        returnedData.data[i].status = true;
      });

      this.data.splice(0, this.data.length, ...returnedData.data);

      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;

      this.loading = false;
    },

    openEdit(person) {
      EventBus.$emit("on-edit-person", person);
    },

    openDelete(evaluation) {
      this.showDelete = true;
      this.evaluationFocus = Object.assign({}, evaluation);
    },

    refresh() {
      this.onRequest({
        pagination: this.pagination,
        filter: undefined,
      });
    },

    async deletePerson() {
      try {
        this.loading = true;

        await this.$axios.delete(
          `${"/person/{id}".replace("{id}", this.evaluationFocus.id)}/`
        );

        this.$q.notify({
          color: "positive",
          type: "positive",
          message: "Colaborador Excluido com Sucesso!",
        });

        this.evaluationFocus = undefined;
        this.refresh();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
  },
};
</script>
