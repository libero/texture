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
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-subjects-label') }).addClass('sm-subjects-label'),
    );
    el.append(
      $$(SubjectsListComponent, {
        model: subjectsModel,
        type: 'subject',
      }).addClass('sm-subjects-list'),
    );

    // FIXME: This code be changed to get all keywords, sort by group then render each group.

    // Keywords By Author
    el.append($$(SectionLabel, { label: this.getLabel('author-generated') }).addClass('sm-keywords-label'));
    el.append(
      $$(KeywordsListComponent, {
        model: keywordsModel,
        type: 'author-generated',
      })
        .addClass('sm-keywords-list')
        .addClass('sm-keywords'),
    );

    // Keywords Research Organisms
    el.append($$(SectionLabel, { label: this.getLabel('research-organism') }).addClass('sm-research-organism-label'));
    el.append(
      $$(KeywordsListComponent, {
        model: keywordsModel,
        type: 'research-organism',
      })
        .addClass('sm-keywords-list')
        .addClass('sm-research-organism'),
    );

    // Article Type
    el.append($$(SectionLabel, { label: this.getLabel('article-information-type-label') }).addClass('sm-type-label'));
    el.append(
      $$(SubjectsListComponent, {
        model: subjectsModel,
        type: 'heading',
      })
        .addClass('sm-subjects-list')
        .addClass('sm-type'),
    );

    // Article DOI
    el.append($$(SectionLabel, { label: this.getLabel('article-information-doi-label') }).addClass('sm-doi-label'));
    el.append(
      $$('p')
        .addClass('se-article-information-doi')
        .append(articleDoi)
        .addClass('sm-doi'),
    );

    // Article eLocation ID
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-elocation-id-label') }).addClass(
        'sm-elocation-id-label',
      ),
    );
    el.append(
      $$('p')
        .addClass('se-article-information-elocation-id')
        .append(articleELocationId)
        .addClass('sm-elocation-id'),
    );

    // Article Year
    el.append($$(SectionLabel, { label: this.getLabel('article-information-year-label') }).addClass('sm-year-label'));
    el.append(
      $$('p')
        .addClass('se-article-information-year')
        .append(articleYear)
        .addClass('sm-year'),
    );

    // Article Volume
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-volume-label') }).addClass('sm-volume-label'),
    );
    el.append(
      $$('p')
        .addClass('se-article-information-volume')
        .append(articleVolume)
        .addClass('sm-volume'),
    );

    // Publish Date
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-publish-date-label') }).addClass(
        'sm-publish-date-label',
      ),
    );
    el.append(
      $$('p')
        .addClass('se-article-information-publish-date')
        .append(articlePublishDate)
        .addClass('sm-publish-date'),
    );

    // License Type
    const licenseTypeModel = createValueModel(api, [articlePermissions.id, 'license']);
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-license-type-label') }).addClass(
        'sm-license-type-label',
      ),
    );
    el.append(
      $$(LicenseEditor, { model: licenseTypeModel })
        .ref(articlePermissions.id)
        .addClass('sm-license-type'),
    );

    // Copyright Statement
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-license-statement-label') }).addClass(
        'sm-license-statement-label',
      ),
    );
    el.append(
      $$('p')
        .addClass('se-article-information-license-statement')
        .append(articlePermissions.copyrightStatement)
        .addClass('sm-license-statement'),
    );

    // Permissions
    el.append(
      $$(SectionLabel, { label: this.getLabel('article-information-license-permissions-label') }).addClass(
        'sm-permissions-label',
      ),
    );
    el.append(
      $$('p')
        .addClass('se-article-information-permissions')
        .append(articlePermissions.licenseText)
        .addClass('sm-permissions'),
    );

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
