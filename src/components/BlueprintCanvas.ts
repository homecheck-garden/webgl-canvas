import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import BlueprintCanvas from '@/components/BlueprintCanvas.vue'

describe('BlueprintCanvas', () => {
    const msg = 'Hello Vue 3'

    const wrapper = mount(BlueprintCanvas, {
      props: { msg },
    })

    //expect(wrapper.find('h1').text()).toEqual(msg)
})
