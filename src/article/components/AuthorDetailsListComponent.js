/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface, FontAwesomeIcon } from 'substance';
import { NodeComponent } from '../../kit';
import FootnoteComponent from './FootnoteComponent';
import { CONTENT_MODE } from '../ArticleConstants';

export default class AuthorDetailsListComponent extends CustomSurface {
  getInitialState() {
    const items = this._getAuthors();
    return {
      hidden: items.length === 0,
      edit: false,
    };
  }

  render($$) {
    const el = $$('div').addClass('sc-author-details-list');
    el.append(this._renderAuthors($$));
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
    return 'author-details-list';
  }

  _getAuthors() {
    return this.props.model.getItems();
  }
}

class AuthorDetailsDisplay extends NodeComponent {
  render($$) {
    const author = this.props.node;

    const el = $$('div').addClass('se-author-details');
    el.append(this._renderHeader($$, author));

    // Only display an email for corresponding authors
    if (author.email) {
      el.append(
        $$('p')
          .addClass('se-author-details-correspondence')
          .append(author.corresp ? `${this.getLabel('author-details-correspendance')}: ` : '')
          .append(
            $$('a')
              .attr('href', `mailto:${author.email}`)
              .append(author.email),
          ),
      );
    }
    if (author.contributorIds.length > 0) {
      el.append(this._renderContribIds($$, author));
    }

    el.append(this._renderBio($$, author));

    // Render affliations in the format, <insitution> <dept> <city> <country>
    if (author.affiliations.length > 0) {
      el.append(this._renderAffiliations($$, author));
    }

    if (author.conflictOfInterests.length > 0) {
      el.append(this._renderConflictOfInterests($$, author));
    }

    return el;
  }

  _openEditAuthorDialog() {
    this.context.api.selectEntity(this.props.node.id);
    this.send('executeCommand', 'edit-author');
  }

  _renderAffiliations($$, author) {
    const doc = author.document;
    const affiliationsContainer = $$('div')
      .addClass('se-author-affiliations-container')
      .append(
        $$('p')
          .addClass('se-affiliations-title')
          .append(this.getLabel('affiliations-label')),
      );

    const affiliations = author.affiliations.reduce((elements, affiliationId) => {
      const affiliationElement = doc.get(affiliationId);
      if (affiliationElement) {
        const affRendered = $$('li')
          .addClass('se-author-details-affilations')
          .append(affiliationElement.toString());
        elements.push(affRendered);
      }
      return elements;
    }, []);

    return affiliationsContainer.append($$('ul').append(affiliations));
  }

  _renderHeader($$, author) {
    const Button = this.context.config.getComponent('button');
    const authorNameEl = $$('p')
      .addClass('se-author-details-fullname')
      .append(`${author.givenNames} ${author.surname}`);
    const editButton = $$(Button, { icon: 'edit-section' })
      .addClass('se-author-details-edit-button')
      .on('click', this._openEditAuthorDialog, this);

    return $$('div')
      .addClass('se-author-details-header')
      .append([authorNameEl, editButton]);
  }

  _renderBio($$, author) {
    const doc = author.document;
    const Paragraph = this.context.config.getComponent('paragraph');
    const bioParagraphs = author.bio.map(path => $$(Paragraph, { node: doc.get(path) }));
    return $$('div').append(bioParagraphs);
  }

  _renderContribIds($$, author) {
    const doc = author.document;
    return author.contributorIds.reduce((elements, contributorId) => {
      const orcidIdElement = $$('div').addClass('se-author-details-orchid');
      const contributorIdElement = doc.get(contributorId);
      if (contributorIdElement && contributorIdElement.contribIdType === 'orcid') {
        const orcidLink = $$('a')
          .attr('href', contributorIdElement.content)
          .attr('target', '_blank');

        if (contributorIdElement.authenticated) {
          orcidLink.append($$('span').addClass('se-author-details-orchid-icon'));
        }

        orcidLink.append(' ' + contributorIdElement.content);
        orcidIdElement.append(orcidLink);
      }
      elements.push(orcidIdElement);
      return elements;
    }, []);
  }

  _renderConflictOfInterests($$, author) {
    const doc = author.document;
    const competingInterests = author.conflictOfInterests.reduce((elements, id) => {
      const element = doc.get(id);
      if (element) {
        elements.push($$(FootnoteComponent, { node: element, mode: CONTENT_MODE }));
      }
      return elements;
    }, []);

    return $$('div')
      .addClass('se-author-competing-interests')
      .append(competingInterests);
  }
}
