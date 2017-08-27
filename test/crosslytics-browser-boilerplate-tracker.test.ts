import { SampleTracker } from '../src'

/**
 * Tracker test
 */
describe('Tracker test', () => {
  it('SampleTracker is instantiable', () => {
    expect(new SampleTracker('accountId')).toBeInstanceOf(SampleTracker)
  })
})
