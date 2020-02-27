import { createEmptyJATS } from '../../../../src/article/converter/util';
import { BrowserDOMElement } from 'substance';

describe('Empty JATS creation', () => {
  it('should create empty JATS', () => {
    expect(createEmptyJATS()).toBeInstanceOf(BrowserDOMElement);
  });
});
