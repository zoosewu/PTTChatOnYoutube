import { InsFilter } from '../../filter/InsFilter.js'
import { InitTwitch } from './InitTwitch.js'

export const twitchfilter = InsFilter('Twitch', /www\.twitch\.tv/, 'https://www.twitch.tv/', InitTwitch)
