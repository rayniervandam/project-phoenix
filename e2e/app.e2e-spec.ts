import { SkimulatorPage } from './app.po';

describe('skimulator App', () => {
  let page: SkimulatorPage;

  beforeEach(() => {
    page = new SkimulatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
