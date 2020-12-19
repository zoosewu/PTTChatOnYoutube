import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

(function () {
  Notificator.notify('creating John and Mark');

  const greetJohn = new SayHello('John');
  const greetMark = new SayHello('Mark');

  Notificator.notify('And now...');

  greetJohn.now();
  greetMark.now();
})();
