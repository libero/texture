import { CustomSurface, FontAwesomeIcon } from 'substance';

export default class ArticleInformationComponent extends CustomSurface {
  getInitialState() {
    return {
      hidden: false,
      edit: false, // TODO: Check if this effects children of the control or not!
    };
  }

  render($$) {
    const el = $$('div').addClass('sc-article-information');

    // Components
    const KeywordsListComponent = this.getComponent('keywords-list');
    const SubjectsListComponent = this.getComponent('subjects-list');
    const SectionLabel = this.getComponent('section-label');

    // Models
    const subjectsModel = this.props.model.getSubjects();
    const keywordsModel = this.props.model.getKeywords();
    const articleDoi = this.props.model.getDoi();
    const articleELocationId = this.props.model.getELocationId();
    const articleVolume = this.props.model.getVolume();
    const articlePublishDate = this.props.model.getPublishDate();
    const articleYear = this.props.model.getCollectionDate();

    // Subjects
    el.append($$(SectionLabel, { label: this.getLabel('article-information-subjects-label') }));
    el.append(
      $$(SubjectsListComponent, {
        model: subjectsModel,
        type: 'subject',
      }).addClass('sm-subjects-list'),
    );

    // FIXME: This code be changed to get all keywords, sort by group then render each group.

    // Keywords By Author
    el.append($$(SectionLabel, { label: this.getLabel('author-generated') }));
    el.append(
      $$(KeywordsListComponent, {
        model: keywordsModel,
        type: 'author-generated',
      }).addClass('sm-keywords-list'),
    );

    // Keywords Research Organisms
    el.append($$(SectionLabel, { label: this.getLabel('research-organism') }));
    el.append(
      $$(KeywordsListComponent, {
        model: keywordsModel,
        type: 'research-organism',
      }).addClass('sm-keywords-list'),
    );

    // Article Type
    el.append($$(SectionLabel, { label: this.getLabel('article-information-type-label') }));
    el.append(
      $$(SubjectsListComponent, {
        model: subjectsModel,
        type: 'heading',
      }).addClass('sm-subjects-list'),
    );

    // Article DOI
    if (articleDoi) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-doi-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-doi')
          .append(articleDoi),
      );
    }

    // Article eLocation ID
    if (articleELocationId) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-elocation-id-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-elocation-id')
          .append(articleELocationId),
      );
    }

    // Article Year
    if (articleYear) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-year-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-year')
          .append(articleYear),
      );
    }

    // Article Volume
    if (articleVolume) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-volume-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-volume')
          .append(articleVolume),
      );
    }

    // Publish Date
    if (articlePublishDate) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-publish-date-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-publish-date')
          .append(articlePublishDate),
      );
    }
    return el;
  }

  _renderAuthors($$) {
    const authors = this._getAuthors();
    const els = [];
    authors.forEach((author, index) => {
      const authorEl = $$(AuthorDetailsDisplay, { node: author }).ref(author.id);
      els.push(authorEl);
    });
    return els;
  }

  _getCustomResourceId() {
    return 'article-information';
  }
}
