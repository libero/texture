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
    // If the paragraph starts with a LF or CR and then only contains spaces, then ignore it.
    const child = el.firstChild;
    if (child && child.el && child.el instanceof Text) {
      const reOnlyLrCrOrSpace = new RegExp('^(\n|\r) +$');
      if (reOnlyLrCrOrSpace.test(child.el.nodeValue)) {
        el.removeChild(child);
      }
    }
    node.content = importer.annotatedText(el, [node.id, 'content']);
  }

  export(node, el, exporter) {
    el.append(exporter.annotatedText([node.id, 'content']));
  }
}
