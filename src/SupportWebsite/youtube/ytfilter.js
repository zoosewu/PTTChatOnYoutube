import InsFilter from 'src/filter/InsFilter'
import InitYT from './InitYT'

const ytfilter = InsFilter('Youtube', /www\.youtube\.com/, 'https://www.youtube.com', InitYT)
export default ytfilter
