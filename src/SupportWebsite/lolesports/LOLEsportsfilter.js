import InsFilter from 'src/filter/InsFilter'
import InitLOLEsports from './InitLOLEsports'

const LOLeSportFilter = InsFilter('Twitch', /www\.twitch\.tv/, 'https://www.twitch.tv/', InitTwitch)
export default LOLeSportFilter
