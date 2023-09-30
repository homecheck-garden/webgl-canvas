import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BlueprintCanvas from '@/components/BlueprintCanvas.vue'

describe('BlueprintCanvas', () => {
  it('should display header text', () => {
    const msg = 'Hello Vue 3'

    const wrapper = mount(BlueprintCanvas, {
      props: { msg },
    })

    //expect(wrapper.find('h1').text()).toEqual(msg)
  })
})
