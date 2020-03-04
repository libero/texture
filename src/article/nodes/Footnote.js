import { DocumentNode, CONTAINER, PLAIN_TEXT, STRING } from 'substance';

export default class Footnote extends DocumentNode {
  static getTemplate() {
    return {
      type: 'footnote',
      content: [{ type: 'paragraph' }],
    };
  }
}
Footnote.schema = {
  type: 'footnote',
  footnoteType: STRING,
  label: PLAIN_TEXT,
  content: CONTAINER('paragraph'),
};
