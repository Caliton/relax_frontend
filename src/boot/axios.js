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
  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    response => {
      return response
    },
    error => {
      var notification = {
        color: 'red',
        textColor: 'white',
        icon: 'error_outline',
        message: 'Alguma coisa aconteceu de ruim :('
      }

      if (error.response) {
        const { status, data } = error.response
        const message = 'Problema interno no servidor'
        if (status === REQUEST.LOGIN_FAILED) {
          EventBus.$emit('invalid-token')
        } else if (status === REQUEST.UNAUTHORIZED) {
          EventBus.$emit('invalid-token')
        }

        notification.message = (Array.isArray(data.message) ? data.message[0] : data.message) ||
          message

        EventBus.$emit('showNotify', notification)

        return Promise.reject(error)
      }
    }
  )

  Vue.prototype.$axios = axiosInstance
}
