import "./say-hello.css";
import { Notificator } from "../notificator/notificator.js";

/**
 * JSDoc
 * comment
 * Multyline one
 */
export   default  class SayHello {
  constructor(name) {
    // One string comment new line
    this.name = name;
  }

  /**
   * And
   * one
   * more
   * multyline
   * comment
   */
  now() { // One string comment inline
    Notificator.notify("Hello: " + this.name);
  }
}
