import InsFilter from 'src/filter/InsFilter'
import InitTwitch from './InitTwitch'

const twitchfilter = InsFilter('Twitch', /www\.twitch\.tv/, 'https://www.twitch.tv/', InitTwitch)
export default twitchfilter
