import InsFilter from 'src/filter/InsFilter'
import InitlineTV from './InitlineTV'

const lineTVfilter = InsFilter('Line TV', /today\.line\.me\/tw\/v2\/article/, 'https://today.line.me', InitlineTV)
export default lineTVfilter
