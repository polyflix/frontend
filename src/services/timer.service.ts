export class TimerService {
  static _timer: number | null = null;

  static start(handler: Function, delay: number) {
    this._timer = setInterval(handler, delay);
  }

  static stop() {
    clearInterval(this._timer as number);
    this._timer = null;
  }
}
