/**
 * A converter for JATS `<p>`.
 */
export default class ParagraphConverter {
  get type() {
    return 'paragraph';
  }

  get tagName() {
    return 'p';
  }

  import(el, node, importer) {
    // NOTE: The intent of this is to capture and handle different formatting of XML...
    for (const child of el.childNodes) {
      if (child.el && child.el instanceof Text) {
        // If the line contains a LF or CR
        // prettier-ignore
        const reContainsLfOrCR = new RegExp('.*[\n\l].*');
        if (reContainsLfOrCR.test(child.el.nodeValue)) {
          // And only contains spaces...
          const reOnlyLrCrOrSpace = new RegExp('^[\n\r ]*$');
          if (reOnlyLrCrOrSpace.test(child.el.nodeValue)) {
            // Then remove it...
            el.removeChild(child);
          }
        }
      }
    }
    node.content = importer.annotatedText(el, [node.id, 'content']);
  }

  export(node, el, exporter) {
    el.append(exporter.annotatedText([node.id, 'content']));
  }
}
