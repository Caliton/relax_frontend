import { api } from 'src/enumerator/api'

export default ({ Vue }) => {
  Vue.prototype.$api = api
}
