import { DocumentNode, CHILD, CHILDREN, CONTAINER, STRING, TEXT } from 'substance';
import { RICH_TEXT_ANNOS, LINKS_AND_XREFS } from './modelConstants';
import MetadataField from './MetadataField';
import Graphic from './Graphic';
import Xref from './Xref';
import Paragraph from './Paragraph';
import SupplementaryFile from './SupplementaryFile';
import Permission from './Permission';

export default class FigurePanel extends DocumentNode {
  getContent() {
    const doc = this.getDocument();
    return doc.get(this.content);
  }

  static getTemplate() {
    return {
      type: 'figure-panel',
      content: {
        type: 'graphic',
      },
      legend: [
        {
          type: 'paragraph',
        },
      ],
      permissions: [
        {
          type: 'permission',
        },
      ],
    };
  }
}

FigurePanel.schema = {
  type: 'figure-panel',
  content: CHILD(Graphic.type),
  title: TEXT(...RICH_TEXT_ANNOS, Xref.type), // <caption> > <title>
  label: STRING, // <label>
  legend: CONTAINER({
    nodeTypes: [Paragraph.type, SupplementaryFile.type],
    defaultTextType: Paragraph.type,
  }),
  attribution: TEXT(...RICH_TEXT_ANNOS, ...LINKS_AND_XREFS), // <attrib>
  permissions: CHILDREN(Permission.type),
  metadata: CHILDREN(MetadataField.type),
};
