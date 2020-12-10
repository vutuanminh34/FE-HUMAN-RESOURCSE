import Vue from 'vue'
import moment from 'moment'

// Format Date
Vue.filter('DateFormat', (date) => {
  if (new Date(date) !== 'Invalid Date' && !isNaN(new Date(date))) {
    return moment(date).format('DD-MM-YYYY')
  }
  return date
})
