import VueMoment from 'vue-moment'
import moment from 'moment'

export default ({ Vue }) => {
  Vue.use(VueMoment, {
    moment
  })
}
