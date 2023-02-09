import { device, element, by, expect } from 'detox'

describe('TesteExpo', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should display welcome message', async () => {
    await expect(element(by.id('heading'))).toHaveText('Welcome TesteExpo 👋')
  })
})
