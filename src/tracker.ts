import { Identity, Page, TrackedEvent, Tracker } from 'crosslytics'
import { getLabelAndValue } from './util/getLabelAndValue'

const assertGa = (window: Window) => {
  if (!window.ga) {
    throw Error(
      'ga() command queue not initialized. Please call GoogleAnalyticsTracker.initialize() first'
    )
  }
}

export class GoogleAnalyticsTracker implements Tracker {

  public static SAMPLE_SIZE = 1;

  /**
   * Initialize the overall ga() command queue. Equivalent to pasting
   * the Google Analytics snippet into your markup.
   * @param window context
   * @see {@link https://developers.google.com/analytics/devguides/collection/analyticsjs/}
   */
  public static initialize(window: Window) {
    // Lightly modified Google Analytics snippet for Typescript and to not use globals
    ;((i, s, o: 'script', g, r: 'ga') => {
      i.GoogleAnalyticsObject = r
      ;(i[r] =
        i[r] ||
        // tslint:disable-next-line:only-arrow-functions
        (function() {
          ;(i[r].q = i[r].q || []).push(arguments)
        } as any)), (i[r].l = Number(new Date()))
      const a: HTMLScriptElement = s.createElement(o)
      const m: any = s.getElementsByTagName(o)[0]
      a.async = true
      a.src = g
      m.parentNode.insertBefore(a, m)
    })(
      window,
      window.document,
      'script',
      'https://www.google-analytics.com/analytics.js',
      'ga'
    )
  }

  public persistentParams: UniversalAnalytics.FieldsObject

  /**
   * Store reference to window rather than window.ga since GA snippet
   * overwrites the window reference.
   */
  protected w: Window

  constructor(public id: string, w = window) {
    assertGa(w)
    this.persistentParams = {}
    this.w = w
    this.w.ga('create', this.id, 'auto', {
      siteSpeedSampleRate: GoogleAnalyticsTracker.SAMPLE_SIZE
    })
  }

  public identify(identity: Identity) {
    this.w.ga('set', 'userId', identity.userId)
  }

  public async track<T>(event: TrackedEvent<T>) {
    const labelAndVal = getLabelAndValue(event)

    const params: UniversalAnalytics.FieldsObject = {
      eventAction: event.name,
      eventCategory: event.category,
      ...labelAndVal[0] !== undefined && { eventLabel: labelAndVal[0] },
      ...labelAndVal[1] !== undefined && { eventValue: labelAndVal[1] }
    }

    return new Promise<void>(resolve => {
      this.w.ga('send', 'event', {
        ...this.persistentParams,
        ...params,
        hitCallback: resolve
      })
    })
  }

  public async page(page: Page) {
    const params: UniversalAnalytics.FieldsObject = {
      location: page.url,
      ...page.title && { title: page.title },
      ...page.referrer && { referrer: page.referrer }
    }

    return new Promise<void>(resolve => {
      this.w.ga('send', 'pageview', {
        ...this.persistentParams,
        ...params,
        hitCallback: resolve
      })
    })
  }
}
