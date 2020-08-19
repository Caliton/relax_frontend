<template>
  <div class="login-page">
    <div class="login-page-2">
      <div class="login-page-3">
        <div class="col-md-5" style="width: 50%">
          <img class="sun" src="~assets/sun.png" width="150px" style="float: right;" />
          <img src="~assets/logo_1.png" width="750px" style="float: right;" />
        </div>

        <div class="login-page-4">
          <div class="container-login">
            <div class="login-logo" style="background: none">
              <q-tab-panels
                v-model="tab"
                animated
                transition-prev="scale"
                transition-next="scale"
                class="text-center"
              >
                <q-tab-panel name="btn1">
                  <q-form @submit="onLogin" class="login-form">
                    <q-input
                      v-model="user.username"
                      input-style="color: #6F6F6F"
                      color="primary"
                      rounded
                      standout="bg-white text-black"
                      label="Login"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) || 'Qual é mesmo o teu login?'
                      ]"
                      v-on:keyup.enter="onSubmit"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" style="color: #6F6F6F !important" />
                      </template>
                    </q-input>

                    <q-input
                      v-model="user.password"
                      rounded
                      icon="eva-lock"
                      input-style="color: #6F6F6F"
                      standout="bg-grey-3"
                      :type="isPwd ? 'password' : 'text'"
                      label="Password"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          'Por favor precisamos saber se é você mesmo'
                      ]"
                      v-on:keyup.enter="onSubmit"
                    >
                      <template v-slot:prepend>
                        <q-icon name="eva-lock" style="color: #6F6F6F !important" />
                      </template>

                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          style="color: #6F6F6F !important"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>

                    <div style="margin-top: 1rem">
                      <q-btn
                        unelevated
                        rounded
                        class="action-button q-mr-sm full-width"
                        :loading="loading"
                        label="Entrar"
                        no-caps
                        type="submit"
                        color="light-blue"
                      >
                        <template v-slot:loading>
                          <q-spinner-bars />
                        </template>
                      </q-btn>

                      <!-- <q-btn
                        unelevated
                        rounded
                        class="action-button"
                        no-caps
                        label="Sou novo por aqui"
                        color="primary"
                        @click="tab = 'btn2'"
                      >
                        <template v-slot:loading>
                          <q-spinner-bars />
                        </template>
                      </q-btn>-->
                    </div>
                  </q-form>
                </q-tab-panel>

                <q-tab-panel name="btn2">
                  <q-form @submit="onSingup" class="login-form">
                    <q-input
                      v-model="newUser.name"
                      input-style="color: #6F6F6F"
                      color="primary"
                      rounded
                      standout="bg-grey-3 text-black"
                      label="Diga-nos o seu Nome"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          'Conte-nos qual é o seu nome?'
                      ]"
                      v-on:keyup.enter="onSubmit"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" style="color: #6F6F6F !important" />
                      </template>
                    </q-input>

                    <q-input
                      v-model="newUser.email"
                      input-style="color: #6F6F6F"
                      color="primary"
                      rounded
                      type="email"
                      standout="bg-grey-3 text-black"
                      label="Email"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          'Qual seu email, prometo que não vou te atormentar XD'
                      ]"
                      v-on:keyup.enter="onSubmit"
                    >
                      <template v-slot:prepend>
                        <q-icon name="fas fa-envelope" style="color: #6F6F6F !important" />
                      </template>
                    </q-input>

                    <q-input
                      v-model="newUser.password"
                      rounded
                      icon="eva-lock"
                      input-style="color: #6F6F6F"
                      standout="bg-grey-3"
                      :type="isPwd ? 'password' : 'text'"
                      label="Password"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          'Você precisa de uma senha (vai ser o nosso segredinho)'
                      ]"
                      v-on:keyup.enter="onSubmit"
                    >
                      <template v-slot:prepend>
                        <q-icon name="eva-lock" style="color: #6F6F6F !important" />
                      </template>

                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          style="color: #6F6F6F !important"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>

                    <div style="margin-top: 1rem">
                      <q-btn
                        unelevated
                        rounded
                        class="action-button q-mr-sm"
                        no-caps
                        label="voltar"
                        color="primary"
                        @click="tab = 'btn1'"
                      >
                        <template v-slot:loading>
                          <q-spinner-bars />
                        </template>
                      </q-btn>

                      <q-btn
                        unelevated
                        rounded
                        class="action-button"
                        :loading="loading"
                        label="Me Cadastre Por Favor!!!"
                        no-caps
                        type="submit"
                        color="light-blue"
                      >
                        <template v-slot:loading>
                          <q-spinner-bars />
                        </template>
                      </q-btn>
                    </div>
                  </q-form>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../functions/event_bus.js";

export default {
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      newUser: {
        name: "",
        login: "",
        password: "",
        isGuest: false,
        profileId: 2,
        departamentId: 2,
      },
      isPwd: true,
      loading: false,
      tab: "btn1",
    };
  },

  created() {
    if (localStorage.getItem("access_token")) {
      this.$router.push("/dashboard");
    }
  },

  beforeCreate() {
    EventBus.$on("showNotify", (notification) => {
      this.showNotify(notification);
    });
  },

  beforeDestroy() {
    EventBus.$off("showNotify");
  },

  methods: {
    // submit for the login form
    async onLogin() {
      this.loading = true;

      try {
        var response = await this.$axios.post("auth/login", this.user);

        console.log(
          "Estou fazendo a requisição e essa é a resposta: ",
          response
        );

        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("userProfile", response.data.profileId);
        localStorage.setItem("userDepartament", response.data.departamentId);

        this.$router.push("/dashboard");

        this.loading = false;
        this.$q.notify({
          color: "positive",
          type: "positive",
          message: "Seja Bem Vindo!",
        });
      } catch (error) {
        this.loading = false;
      }
    },

    async onSingup() {
      this.loading = true;

      try {
        await this.$axios.post("auth/signup", this.newUser);

        this.user = this.newUser;
        this.onLogin();

        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    showNotify(notification) {
      this.$q.notify({
        color: notification.color,
        textColor: "white",
        icon: notification.icon,
        message: notification.message,
      });
    },
  },
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Montserrat:700|Poppins:400,500,700&display=swap');

@font-face {
  font-family: customfont;
  src: url('../css/fonts/VeganStylePersonalUse-5Y58.ttf');
}

.sun {
  -webkit-animation: spin 20s linear infinite;
  -moz-animation: spin 20s linear infinite;
  animation: spin 20s linear infinite;
}

@keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.login-page {
  font-family: 'Poppins', sans-serif;
  background-color: #eee;
  letter-spacing: unset;
  color: #3c4858;

  .login-page-2 {
    height: auto;
    min-height: 100vh;
  }

  .login-page-3 {
    // background: #9053c7;
    // background: -webkit-linear-gradient(-135deg, #ffffff,#A7DFF9);
    // background: -o-linear-gradient(-135deg, #fff,#A7DFF9);
    // background: -moz-linear-gradient(-135deg, #fff,#A7DFF9);
    // background: linear-gradient(-135deg, #fff,#A7DFF9);
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-position: top;
    background-size: cover;
    margin: 0;
    padding: 0;
    border: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .login-page-4 {
    border-radius: 12px;
    width: 30%;
    margin-left: 15rem;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    background-color: white;
    z-index: 9999 !important;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    position: relative;
    overflow: unset;
    font-size: 0.875rem;
    -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    color: #333;
  }

  .login-form {
    padding: 15px 20px;
    line-height: 1.75em;
    position: relative;
    font-size: 14px;
  }

  .bg-text {
    padding: 15px;
    z-index: 2;
    z-stclass = 'text-center' style = 'max-width: 50%';
  }

  .login-logo {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 1.5rem;
  }

  .q-field--focused .q-field__control {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    background: #F2F2F2 !important;
  }

  .action-button {
    -webkit-transition-property: opacity, -webkit-transform !important;
    transition-property: opacity, -webkit-transform !important;
    transition-property: transform, opacity !important;
    transition-property: transform, opacity, -webkit-transform !important;
    -webkit-transition-timing-function: ease-in-out !important;
    transition-timing-function: ease-in-out !important;
    -webkit-transition-duration: 40ms !important;
    transition-duration: 40ms !important;
  }

  .action-button:active {
    -webkit-transform: scale(0.96);
    transform: scale(0.96);
  }

  .container-login {
    max-width: 80%;
    transition: 0.3s;
    margin: 0 auto;
  }

  .name-login {
    font-family: customfont;
    font-size: 1.8rem;
  }

  @media (max-width: 1440px) {
    .container-login {
      max-width: 80%;
    }
  }

  @media (max-width: 1366px) {
    .container-login {
      max-width: 90%;
    }
  }

  @media (max-width: 1024px) {
    .container-login {
      max-width: 100%;
    }
  }
}
</style>
