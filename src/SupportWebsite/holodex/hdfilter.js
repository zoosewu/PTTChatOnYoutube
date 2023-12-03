import InsFilter from 'src/filter/InsFilter'
import InitHD from './InitHD'

const hdfilter = InsFilter('Holodex', /holodex\.net/, 'https://holodex.net', InitHD)
export default hdfilter
