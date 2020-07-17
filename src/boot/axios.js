import axios from 'axios'
import { REQUEST } from 'src/enumerator/request.js'
import { EventBus } from 'src/functions/event_bus.js'

export default async ({ Vue }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.API,
    withCredentials: false,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // INTERCEPTORS
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }, (error) => {
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    var notification = {
      color: 'red',
      textColor: 'white',
      icon: 'error_outline',
      message: 'Alguma coisa aconteceu de ruim :('
    }

    if (error.response) {
      const status = error.response.status

      if (status === REQUEST.LOGIN_FAILED) {
        notification.message = 'Você não tem permissão'
        EventBus.$emit('expiredToken')
      } else if (status === REQUEST.EXPIRED_TOKEN) {
        notification.message = 'Seu acesso esta espirado'
        EventBus.$emit('expiredToken')
      } else if (status === REQUEST.UNAUTHORIZED) {
        notification.message = 'Você não tem permissão'
        EventBus.$emit('expiredToken')
      } else if (status === REQUEST.NOT_FOUND) {
        notification.message = 'Uhm... não consegui encontrar o que buscava :('
      } else if (status === REQUEST.SERVER_ERROR) {
        notification.message = 'Erro interno no servidor'
      }
    } else {
      notification.message = 'Problema na conexão com Servidor'
    }

    EventBus.$emit('showNotify', notification)

    return Promise.reject(error)
  })

  Vue.prototype.$axios = axiosInstance
}
