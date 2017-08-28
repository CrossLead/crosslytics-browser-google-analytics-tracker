import { GoogleAnalyticsTracker } from '../src'

// TODO: mock window so we can do real tests

/**
 * Tracker test
 */
describe('GoogleAnalyticsTracker tests', () => {
  it('GoogleAnalyticsTracker should throw if not initialized()', () => {
    expect(() => new GoogleAnalyticsTracker('accountId')).toThrow()
  })
})
