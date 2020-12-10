import Vue from 'vue'
import Vuetify from 'vuetify'

// Components
import PageFooter from '@/components/PageFooter'

// Utilities
import { mount, createLocalVue } from '@vue/test-utils'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('PageFooter.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should have a custom title and match snapshot', () => {
    const wrapper = mount(PageFooter, {
      localVue,
      vuetify,
      propsData: {},
    })

    // With jest we can create snapshot files of the HTML output
    expect(wrapper.html()).toMatchSnapshot()

    // We could also verify this differently
    // by checking the text content
    const title = wrapper.find('span.caption')

    expect(title.text()).toBe('Hybrid Technologies © 2020')
  })
})
