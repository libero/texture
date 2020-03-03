import { Component } from 'substance';
import { renderModel } from '../../kit';
import ManuscriptSection from './ManuscriptSection';

export default class ManuscriptComponent extends Component {
  render($$) {
    const manuscript = this.props.model;

    // TODO: Need to understand why in some places they 'lookup' the components and assign them to variables, vs just a
    //       simple import. Assume there is some method to - what seems to me - madness in doing things different ways.
    const AffiliationsListComponent = this.getComponent('affiliations-list');
    const ArticleInformationComponent = this.getComponent('article-information');
    const AuthorsListComponent = this.getComponent('authors-list');
    const AuthorDetailsListComponent = this.getComponent('author-details-list');
    const ReferenceListComponent = this.getComponent('reference-list');
    const RelatedArticlesListComponent = this.getComponent('related-articles-list');
    const JournalMetaComponent = this.getComponent('journal-meta');

    const el = $$('div').addClass('sc-manuscript');

    // TODO: maybe we want to be able to configure if a section should be hidden when empty

    // Title
    const titleModel = manuscript.getTitle();
    el.append(
      $$(ManuscriptSection, {
        name: 'title',
        label: this.getLabel('title-label'),
        model: titleModel,
      }).append(
        renderModel($$, this, titleModel, {
          placeholder: this.getLabel('title-placeholder'),
        }).addClass('sm-title'),
      ),
    );

    // Sub-title
    const subTitleModel = manuscript.getSubTitle();
    el.append(
      $$(ManuscriptSection, {
        name: 'subtitle',
        label: this.getLabel('subtitle-label'),
        model: subTitleModel,
      }).append(
        renderModel($$, this, subTitleModel, {
          placeholder: this.getLabel('subtitle-placeholder'),
        }).addClass('sm-subtitle'),
      ),
    );

    // Authors
    const authorsModel = manuscript.getAuthors();
    el.append(
      $$(ManuscriptSection, {
        name: 'authors',
        label: this.getLabel('authors-label'),
        model: authorsModel,
        hideWhenEmpty: true,
      }).append(
        $$(AuthorsListComponent, {
          model: authorsModel,
        }).addClass('sm-authors'),
      ),
    );

    // Affiliations
    const affiliationsModel = manuscript.getAffiliations();
    el.append(
      $$(ManuscriptSection, {
        name: 'affiliations',
        label: this.getLabel('affiliations-label'),
        model: affiliationsModel,
      }).append(
        $$(AffiliationsListComponent, {
          model: affiliationsModel,
          placeholder: this.getLabel('affiliations-label'),
        }).addClass('sm-affiliations'),
      ),
    );

    // Abstract
    const abstractModel = manuscript.getAbstract();
    el.append(
      $$(ManuscriptSection, {
        name: 'abstract',
        label: this.getLabel('abstract-label'),
        model: abstractModel,
      }).append(
        renderModel($$, this, abstractModel, {
          name: 'abstract',
          placeholder: this.getLabel('abstract-placeholder'),
        }).addClass('sm-abstract'),
      ),
    );

    // Body
    const bodyModel = manuscript.getBody();
    el.append(
      $$(ManuscriptSection, {
        name: 'body',
        label: this.getLabel('body-label'),
        model: bodyModel,
      }).append(
        renderModel($$, this, bodyModel, {
          name: 'body',
          placeholder: this.getLabel('body-placeholder'),
        }).addClass('sm-body'),
      ),
    );

    // Footnotes
    const footnotesModel = manuscript.getFootnotes();
    el.append(
      $$(ManuscriptSection, {
        name: 'footnotes',
        label: this.getLabel('footnotes-label'),
        model: footnotesModel,
        hideWhenEmpty: true,
      }).append(renderModel($$, this, footnotesModel).addClass('sm-footnotes')),
    );

    // Acknowledgements
    const acknowledgementsModel = manuscript.getAcknowledgements();
    el.append(
      $$(ManuscriptSection, {
        name: 'acknowledgements',
        label: this.getLabel('acknowledgement-label'),
        model: acknowledgementsModel,
        hideWhenEmpty: true,
      }).append(
        renderModel($$, this, acknowledgementsModel, {
          name: 'acknowledgement',
          placeholder: this.getLabel('acknowledgement-placeholder'),
        }).addClass('sm-acknowledgement'),
      ),
    );

    // References
    const referencesModel = manuscript.getReferences();
    el.append(
      $$(ManuscriptSection, {
        name: 'references',
        label: this.getLabel('references-label'),
        model: referencesModel,
        hideWhenEmpty: true,
      }).append(
        $$(ReferenceListComponent, {
          model: referencesModel,
        }).addClass('sm-references'),
      ),
    );

    // Author Details
    const authorDetailsModel = manuscript.getAuthors();
    el.append(
      $$(ManuscriptSection, {
        name: 'author-details',
        label: this.getLabel('author-details-label'),
        model: authorDetailsModel,
        hideWhenEmpty: true,
      }).append(
        $$(AuthorDetailsListComponent, {
          model: authorDetailsModel,
        }).addClass('sm-authors'),
      ),
    );

    // Article Information
    el.append(
      $$(ManuscriptSection, {
        name: 'article-information',
        label: this.getLabel('article-information-label'),
        model: this.props.model,
        hideWhenEmpty: false,
      }).append(
        $$(ArticleInformationComponent, {
          model: this.props.model,
          manuscript: this,
        }),
      ),
    );

    // Related Articles
    const relatedArticlesModel = manuscript.getRelatedArticles();
    el.append(
      $$(ManuscriptSection, {
        name: 'related-articles',
        label: this.getLabel('relatedArticleSectionTitle'),
        model: relatedArticlesModel,
        hideWhenEmpty: true,
      }).append(
        $$(RelatedArticlesListComponent, {
          model: relatedArticlesModel,
        }).addClass('sm-related-articles'),
      ),
    );

    // Journal Meta
    el.append(
      $$(JournalMetaComponent, {
        model: this.props.model,
        manuscript: this,
      }).addClass('sm-journal-meta'),
    );

    return el;
  }
}
