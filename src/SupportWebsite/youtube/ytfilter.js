import { InsFilter } from '../../filter/InsFilter'
import { InitYT } from './InitYT'

export const ytfilter = InsFilter('Youtube', /www\.youtube\.com/, 'https://www.youtube.com', InitYT)
