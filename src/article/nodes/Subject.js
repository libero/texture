import { DocumentNode, STRING } from 'substance';

export default class Subject extends DocumentNode {
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
Subject.schema = {
  type: 'subject',
  groupType: STRING,
  name: STRING,
  category: STRING,
};
