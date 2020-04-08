import { DocumentNode, STRING, TEXT } from 'substance';
import { RICH_TEXT_ANNOS } from './modelConstants';

export default class Keyword extends DocumentNode {
  // not used
  // toString () {
  //   return this.render().join('')
  // }

  render(options = {}) {
    const { category, name } = this;
    const result = [name];
    if (!options.short) {
      if (category) {
        result.push(', ', category);
      }
    }
    return result;
  }
}

Keyword.schema = {
  type: 'keyword',
  groupType: STRING,
  name: TEXT(...RICH_TEXT_ANNOS),
  category: STRING,
};
