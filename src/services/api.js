import axios from 'axios'

export default ({ Vue }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.API,
    withCredentials: false,
    crossdomain: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `EP2S ${localStorage.getItem('access_token')}`
    },
    path: '/'
  })

  Vue.prototype.$axios = axiosInstance
}
