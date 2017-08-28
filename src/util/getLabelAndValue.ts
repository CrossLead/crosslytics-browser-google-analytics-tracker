import { TrackedEvent } from 'crosslytics'

// https://stackoverflow.com/a/9716488/1406819
const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function getLabelAndValue<T>(
  event: TrackedEvent<T>
): [string | undefined, number | undefined] {
  const ret: [string | undefined, number | undefined] = [undefined, undefined]
  // Find suitable args for Label and Value
  const argPri = event.argPriority
  if (argPri.length > 0) {
    // Anything can become Label
    const label = event.args[argPri[0]]
    if (label !== undefined) {
      ret[0] = String(label)
    }
  }

  if (argPri.length > 1) {
    for (let i = 1; i < argPri.length; i++) {
      const argVal = event.args[argPri[i]]
      if (isNumber(argVal)) {
        ret[1] = Number(argVal)
        break
      }
    }
  }
  return ret
}
