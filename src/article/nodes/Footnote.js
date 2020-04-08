import { DocumentNode, CONTAINER, PLAIN_TEXT, STRING } from 'substance';

export default class Footnote extends DocumentNode {
  static getTemplate() {
    return {
      type: 'footnote',
      content: [{ type: 'paragraph' }],
    };
  }

  render(options = {}) {
    const doc = this.getDocument();
    const content = [];
    for (const id of this.content) {
      content.push(doc.get(id).content);
    }
    return content;
  }

  toString() {
    return this.render().join('. ');
  }
}
Footnote.schema = {
  type: 'footnote',
  footnoteType: STRING,
  label: PLAIN_TEXT,
  content: CONTAINER('paragraph'),
};
