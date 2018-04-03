class Common {
  constructor() {
    this.text = 'example';

    this._init();
  }
  _init() {
    console.log(`${this.text} common js`);
  }
}

export default Common;
