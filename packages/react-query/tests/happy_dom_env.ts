import { GlobalRegistrator } from '@happy-dom/global-registrator'

export class HappyDom {
  static init() {
    GlobalRegistrator.register({
      url: 'http://localhost:3000',
      width: 1920,
      height: 1080,
    })
  }

  static destroy() {
    GlobalRegistrator.unregister()
  }
}
