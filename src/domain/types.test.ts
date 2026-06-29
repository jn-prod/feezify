import { describe, it, expect } from 'vitest'
import { metric } from './types.js'

describe('metric()', () => {
  it('tags provenance and incompatibility', () => {
    const m = metric(42, 'computed:JN-hrTSS')
    expect(m).toEqual({ value: 42, provenance: 'computed:JN-hrTSS', incompatible: false })
    expect(metric(50, 'strava:relative-effort', true).incompatible).toBe(true)
  })
})
