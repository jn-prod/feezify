# `activities.json` — the activities cache contract

The single source of truth for the shape of `<coreDir>/activities.json` — the local cache
the deterministic engine reads when it doesn't call Strava itself. Whoever writes the cache
(the AI via the **official Strava MCP connector**, a manual export, another provider's
adapter) must produce this shape. Don't restate this contract elsewhere; link here.

## Shape

A JSON **array** of activity objects (Strava-shaped). Fields the engine reads:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `start_date_local` | ISO datetime string | one of the two | preferred (athlete's local day) |
| `start_date` | ISO datetime string | one of the two | UTC fallback (official connector shape) |
| `type` or `sport_type` | string | yes | Strava sport names (`Ride`, `TrailRun`, `GravelRide`, `Yoga`…) — unknown values map to `Other` |
| `moving_time` | number (seconds) | yes | |
| `average_heartrate` | number (bpm) | no | enables hrTSS recompute from raw |
| `average_watts` | number | no | power path |
| `weighted_average_watts` | number | no | preferred over `average_watts` when present |
| `device_watts` | boolean | no | power/NP are only trusted when `true` (real power meter) |
| `suffer_score` | number | no | Strava "relative effort" — a **different definition** than TSS: it is taken but **flagged incompatible** (provenance `strava:relative-effort`); the engine prefers recomputing from raw HR/power |

Unknown extra fields are ignored. No PII is needed — don't cache names, GPS coordinates,
or addresses; the engine never reads them.

## Example

```json
[
  {
    "start_date": "2026-07-01T06:30:00Z",
    "sport_type": "GravelRide",
    "moving_time": 5400,
    "average_heartrate": 142,
    "suffer_score": 96
  },
  {
    "start_date_local": "2026-07-02T18:00:00",
    "type": "Run",
    "moving_time": 2400,
    "average_heartrate": 155
  }
]
```

## How it's used

- **Official Strava MCP connector (no terminal):** the AI fetches the athlete's recent
  activities (~200 days for EWMA warm-up; fewer is fine, the numbers just warm up over
  time) through the connector's tools, transforms them to this shape, and writes
  `<coreDir>/activities.json`. Consent rule unchanged: only when `connectors.strava: true`
  in `config.yml`.
- **Developer path:** with a token in `.env`, the engine calls the Strava REST API itself
  and the cache isn't needed.
- **No Strava at all:** the file may be absent — the read still works from the journal
  alone (load provenance is then `none`).
