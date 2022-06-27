import InsFilter from 'src/filter/InsFilter'
import Initblank from './Initblank'

const blankfilter = InsFilter('Blank', /blank\.org/, 'https://blank.org/', Initblank)
export default blankfilter
