// Typed access to src/data/career-stats.json, the single source of truth for
// every career figure on the site. Do not hand-type numbers into components:
// change the figures only through scripts/refresh-career-stats.mjs.
import raw from '@/data/career-stats.json'

export interface FieldPay {
  id: string
  name: string
  medianRs: number
  meanRs: number
  regularSharePct: number
  sampleN: number
  note?: string
}
export interface LadderStage {
  title: string
  fromYear: number
  topPayRs: number
}
export interface Ladder {
  id: string
  name: string
  source: string
  startPayRs: number
  stages: LadderStage[]
}

const f = raw.figures as {
  allIndiaMedianRs: number
  allIndiaMeanRs: number
  plfsRecords: number
  distinctCareersAudited: number
  fields: FieldPay[]
  ladders: Ladder[]
}

export const FIELDS: FieldPay[] = f.fields
export const LADDERS: Ladder[] = f.ladders
export const ALL_INDIA_MEDIAN_RS = f.allIndiaMedianRs
export const ALL_INDIA_MEAN_RS = f.allIndiaMeanRs
export const DATA_PERIOD = raw.meta.dataPeriod

export const formatRs = (n: number): string => `₹${n.toLocaleString('en-IN')}`
/** Rs per year -> "₹6.7 L" (lakh). */
export const formatLakh = (n: number): string => `₹${(n / 100000).toFixed(1)} L`
export const formatNum = (n: number): string => n.toLocaleString('en-IN')

export const HEADLINE_STATS = [
  {
    value: formatNum(f.plfsRecords),
    label: 'labour-survey records read',
    detail: `NSO PLFS person records, ${DATA_PERIOD.replace('NSO PLFS, ', '')}, behind the field pay figures`,
  },
  {
    value: String(FIELDS.length),
    label: 'career fields compared',
    detail: 'each tied to national occupation codes (NCO-2015)',
  },
  {
    value: String(LADDERS.length),
    label: 'pay ladders from official rules',
    detail: 'IAS, IPS, Army and university professor, from the published pay documents',
  },
  {
    value: formatNum(f.distinctCareersAudited),
    label: 'distinct careers audited',
    detail: 'the ParamAI™ career universe, de-duplicated by name',
  },
]

/** Pay on entering stage i = start pay for stage 0, else the previous stage's top. */
export const entryPay = (l: Ladder, i: number): number => (i === 0 ? l.startPayRs : l.stages[i - 1].topPayRs)
