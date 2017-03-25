import { AngularCliApp20170325Page } from './app.po';

describe('angular-cli-app20170325 App', () => {
  let page: AngularCliApp20170325Page;

  beforeEach(() => {
    page = new AngularCliApp20170325Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
