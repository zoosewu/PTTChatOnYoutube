import { InsFilter } from '../../filter/InsFilter'
import { InitTwitch } from './InitTwitch'

export const twitchfilter = InsFilter('Twitch', /www\.twitch\.tv/, 'https://www.twitch.tv/', InitTwitch)
