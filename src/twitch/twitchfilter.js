import { InsFilter } from '../filter/InsFilter.js';
import { InitTwitch } from './InitTwitch.js';

export let twitchfilter = InsFilter("Twitch", /www\.twitch\.tv/, "https://www.twitch.tv/", InitTwitch); 