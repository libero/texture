import { CustomSurface, FontAwesomeIcon } from 'substance';
import { createValueModel } from '../../kit/model/index';
import { default as LicenseEditor } from './LicenseEditor';

export default class ArticleInformationComponent extends CustomSurface {
  getInitialState() {
    return {
      hidden: false,
      edit: false, // TODO: Check if this effects children of the control or not!
    };
  }

  render($$) {
    const api = this.context.api;
    const model = this.props.model;

    const el = $$('div').addClass('sc-article-information');

    // Components
    const KeywordsListComponent = this.getComponent('keywords-list');
    const SubjectsListComponent = this.getComponent('subjects-list');
    const SectionLabel = this.getComponent('section-label');

    // Models
    const subjectsModel = model.getSubjects();
    const keywordsModel = model.getKeywords();
    const articleDoi = model.getDoi();
    const articleELocationId = model.getELocationId();
    const articleVolume = model.getVolume();
    const articlePublishDate = model.getPublishDate();
    const articleYear = model.getCollectionDate();
    const articlePermissionsId = model.getPermissions();
    const articlePermissions = api.getDocument().get(articlePermissionsId);

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

    const container = $$('div').addClass('article-information-container');

    // Article DOI
    if (articleDoi) {
      const subContainer = $$('div').addClass('article-information-sub-container');
      subContainer.append($$(SectionLabel, { label: this.getLabel('article-information-doi-label') }));
      subContainer.append(
        $$('p')
          .addClass('se-article-information-doi')
          .append(articleDoi),
      );
      container.append(subContainer);
    }

    // Article eLocation ID
    if (articleELocationId) {
      const subContainer = $$('div').addClass('article-information-sub-container');
      subContainer.append($$(SectionLabel, { label: this.getLabel('article-information-elocation-id-label') }));
      subContainer.append(
        $$('p')
          .addClass('se-article-information-elocation-id')
          .append(articleELocationId),
      );
      container.append(subContainer);
    }

    // Article Year
    if (articleYear) {
      const subContainer = $$('div').addClass('article-information-sub-container');
      subContainer.append($$(SectionLabel, { label: this.getLabel('article-information-year-label') }));
      subContainer.append(
        $$('p')
          .addClass('se-article-information-year')
          .append(articleYear),
      );
      container.append(subContainer);
    }

    // Article Volume
    if (articleVolume) {
      const subContainer = $$('div').addClass('article-information-sub-container');
      subContainer.append($$(SectionLabel, { label: this.getLabel('article-information-volume-label') }));
      subContainer.append(
        $$('p')
          .addClass('se-article-information-volume')
          .append(articleVolume),
      );
      container.append(subContainer);
    }

    el.append(container);

    // Publish Date
    if (articlePublishDate) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-publish-date-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-publish-date')
          .append(articlePublishDate),
      );
    }

    // License Type
    if (articlePermissions && articlePermissions.license) {
      const model = createValueModel(api, [articlePermissions.id, 'license']);
      el.append($$(SectionLabel, { label: this.getLabel('article-information-license-type-label') }));
      el.append($$(LicenseEditor, { model }).ref(articlePermissions.id));
    }

    // Copyright Statement
    if (articlePermissions && articlePermissions.copyrightStatement) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-license-statement-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-license-statement')
          .append(articlePermissions.copyrightStatement),
      );
    }

    // Permissions
    if (articlePermissions && articlePermissions.licenseText) {
      el.append($$(SectionLabel, { label: this.getLabel('article-information-license-permissions-label') }));
      el.append(
        $$('p')
          .addClass('se-article-information-permissions')
          .append(articlePermissions.licenseText),
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
