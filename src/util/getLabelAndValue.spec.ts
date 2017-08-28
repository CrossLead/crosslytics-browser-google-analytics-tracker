import { TrackedEvent } from 'crosslytics'
import { getLabelAndValue } from './getLabelAndValue'

interface LightsaberArgs {
  'Blades'?: number
  'Color'?: string
  'Inscription'?: string
}

class LightsaberBuilt extends TrackedEvent<LightsaberArgs> {
  public name = 'Lightsaber Built'
  public category = 'Lightsabers'
  public argPriority = new Array<keyof LightsaberArgs>(
    'Inscription',
    'Color',
    'Blades'
  )
}

describe('getLabelAndValue test', () => {
  it('Should use first number arg as value', () => {
    const inscription = `Obi-wan's lightsaber`
    const event = new LightsaberBuilt({
      Blades: 2,
      Color: 'Blue',
      Inscription: inscription
    })

    const labelAndVal = getLabelAndValue(event)
    expect(labelAndVal[0]).toBe(inscription)
    expect(labelAndVal[1]).toBe(2)
  })

  it('Should work for label but no val', () => {
    const event = new LightsaberBuilt({
      Inscription: 'Legendary'
    })

    const labelAndVal = getLabelAndValue(event)
    expect(labelAndVal[0]).toBe('Legendary')
    expect(labelAndVal[1]).toBe(undefined)
  })

  it('Should work for val but no label', () => {
    const event = new LightsaberBuilt({
      Blades: 1
    })

    const labelAndVal = getLabelAndValue(event)
    expect(labelAndVal[0]).toBe(undefined)
    expect(labelAndVal[1]).toBe(1)
  })

  it('Should work for no args', () => {
    const event = new LightsaberBuilt({})

    const labelAndVal = getLabelAndValue(event)
    expect(labelAndVal[0]).toBe(undefined)
    expect(labelAndVal[1]).toBe(undefined)
  })
})
