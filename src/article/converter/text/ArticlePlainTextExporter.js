export default class ArticlePlainTextExporter {
  export(article) {
    console.error('TODO: implement full article to plain-text conversion');
  }

  exportNode(node) {
    if (node.isContainer()) {
      return this._exportContainer(node);
    } else if (node.isText()) {
      return this._exportText(node.getDocument(), node.getPath());
    }
    return '';
  }

  _exportContainer(node) {
    if (!node) return '';
    return node
      .getNodes()
      .map(node => {
        return this.exportNode(node);
      })
      .join('\n\n');
  }

  _exportText(doc, path) {
    return doc.get(path) || '';
  }
}
