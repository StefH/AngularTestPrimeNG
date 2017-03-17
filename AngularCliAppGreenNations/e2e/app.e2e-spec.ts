import { AngularCliApp20170317Page } from './app.po';

describe('angular-cli-app20170317 App', () => {
  let page: AngularCliApp20170317Page;

  beforeEach(() => {
    page = new AngularCliApp20170317Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
