import { CustomSurface } from 'substance';

export default class JournalMetaComponent extends CustomSurface {
  getInitialState() {
    return {
      hidden: false,
      edit: false, // TODO: Check if this effects children of the control or not!
    };
  }

  render($$) {
    const model = this.props.model;

    const el = $$('div').addClass('sc-journal-meta');

    // Models
    const articlePublisherName = model.getArticlePublisherName();
    const articleISSN = model.getArticleISSN();
    const articleDTDVersion = model.getArticleDTDVersion();
    const articleType = model.getArticleType();

    // Publisher Name
    if (articlePublisherName) {
      el.append(
        $$('p')
          .addClass('se-journal-meta-publisher-name')
          .append(`${articlePublisherName}.`),
      );
    }

    // ISSN
    if (articleISSN) {
      el.append(
        $$('p')
          .addClass('se-journal-meta-publisher-issn')
          .append(`ISSN: ${articleISSN}.`),
      );
    }

    // JATS DTD
    if (articleDTDVersion) {
      el.append(
        $$('p')
          .addClass('se-journal-meta-jats-dtd-version')
          .append(`JATS DTD version: ${articleDTDVersion}.`),
      );
    }

    // Article Type
    if (articleType) {
      el.append(
        $$('p')
          .addClass('se-journal-meta-article-type')
          .append(`article-type: ${articleType}`),
      );
    }

    return el;
  }

  _getCustomResourceId() {
    return 'journal-meta';
  }
}
