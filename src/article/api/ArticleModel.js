import Model from './Model';

/**
 * An extra API for the article, which hides implementation details
 * about how to access certain parts of the document.
 */
export default class ArticleModel extends Model {
  getAbstract() {
    return this._getValueModel('article.abstract');
  }

  getAcknowledgements() {
    return this._getValueModel('article.acknowledgements');
  }

  getAffiliations() {
    return this._getValueModel('metadata.affiliations');
  }

  getAuthors() {
    return this._getValueModel('metadata.authors');
  }

  hasAuthors() {
    return this.getAuthors().length > 0;
  }

  getBody() {
    return this._getValueModel('body.content');
  }

  getFootnotes() {
    return this._getValueModel('article.footnotes');
  }

  hasFootnotes() {
    return this.getFootnotes().length > 0;
  }

  getConflictOfInterests() {
    return this._getValueModel('article.conflictOfInterests');
  }

  hasConflictOfInterests() {
    return this.getConflictOfInterests().length > 0;
  }

  getKeywords() {
    return this._getValueModel('metadata.keywords');
  }

  hasKeywords() {
    return this.getKeywords().length > 0;
  }

  getReferences() {
    return this._getValueModel('article.references');
  }

  hasReferences() {
    return this.getReferences().length > 0;
  }

  getRelatedArticles() {
    return this._getValueModel('article.relatedArticles');
  }

  hasRelatedArticles() {
    return this.getRelatedArticles().length > 0;
  }

  getTitle() {
    return this._getValueModel('article.title');
  }

  getSubjects() {
    return this._getValueModel('metadata.subjects');
  }

  hasSubjects() {
    return this.getSubjects().length > 0;
  }

  getSubTitle() {
    return this._getValueModel('article.subTitle');
  }

  // FIXME: Should consider adding a 'getValue' method, although I don't event think that would be the right way to get
  //        the value.
  getDoi() {
    return this._getValueModel('metadata.doi')._value;
  }

  getELocationId() {
    return this._getValueModel('metadata.elocationId')._value;
  }

  getYear() {
    return this._getValueModel('metadata.elocationId')._value;
  }

  getCollectionDate() {
    return this._getValueModel('metadata.collectionDate')._value;
  }

  getVolume() {
    return this._getValueModel('metadata.volume')._value;
  }

  getPublishDate() {
    return this._getValueModel('metadata.publishedDate')._value;
  }

  getPermissions() {
    return this._getValueModel('metadata.permission')._value;
  }

  getArticleType() {
    return this._getValueModel('metadata.articleType')._value;
  }

  getArticleISSN() {
    return this._getValueModel('metadata.issn')._value;
  }

  getArticleDTDVersion() {
    return this._getValueModel('metadata.dtdVersion')._value;
  }

  getArticlePublisherName() {
    return this._getValueModel('metadata.publisherName')._value;
  }
}
