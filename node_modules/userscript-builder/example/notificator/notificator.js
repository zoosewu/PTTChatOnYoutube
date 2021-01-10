import NotificatorConsole from "./notificatorConsole";

export class Notificator {
  static notify(text) {
    new NotificatorConsole().log('Notificator says: ' + text);
  }
}
