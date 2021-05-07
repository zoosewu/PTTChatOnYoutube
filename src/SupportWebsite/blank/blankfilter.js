import { InsFilter } from '../../filter/InsFilter.js'
import { Initblank } from './Initblank.js'

export const blankfilter = InsFilter('Blank', /blank\.org/, 'http://blank.org/', Initblank)
