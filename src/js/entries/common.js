class Common {
  constructor() {
    this.init();
  }

  init() {
    this.sayHello();
  }

  sayHello() {
    console.log('hello, common');
  }
}

const common = new Common();
