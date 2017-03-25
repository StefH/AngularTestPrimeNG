import { browser, element, by } from 'protractor';

export class AngularCliApp20170325Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
