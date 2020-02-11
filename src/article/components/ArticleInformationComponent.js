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

// class AuthorDetailsDisplay extends NodeComponent {
//   render($$) {
//     const author = this.props.node;
//     const doc = author.document;

//     let el = $$('div').addClass('se-author-details');
//     el.append(
//       $$('p')
//         .addClass('se-author-details-fullname')
//         .append(`${author.givenNames} ${author.surname}`),
//     );

//     // Only display an email fir corresponding authors
//     if (author.email) {
//       el.append(
//         $$('p')
//           .addClass('se-author-details-correspondence')
//           .append(author.corresp ? `${this.getLabel('author-details-correspendance')}: ` : '')
//           .append(
//             $$('a')
//               .attr('href', `mailto:${author.email}`)
//               .append(author.email),
//           ),
//       );
//     }

//     // Render affliations in the format, <insitution> <dept> <city> <country>
//     if (author.affiliations.length > 0) {
//       author.affiliations.map(affiliationId => {
//         const affiliationElement = doc.get(affiliationId);
//         if (affiliationElement) {
//           el.append(
//             $$('p')
//               .addClass('se-author-details-affilations')
//               .append(affiliationElement.toString()),
//           );
//         }
//       });
//     }

//     if (author.contributorIds.length > 0) {
//       author.contributorIds.map(contributorId => {
//         const orcidIdElement = $$('div').addClass('se-author-details-orchid');
//         const contributorIdElement = doc.get(contributorId);
//         if (contributorIdElement && contributorIdElement.contribIdType === 'orcid') {
//           if (contributorIdElement.authenticated) {
//             orcidIdElement.append($$(FontAwesomeIcon, { icon: 'fa-circle' }).addClass('se-icon'));
//           }
//           // FIXME: Not 100% happy with the below solution, there is likely a better way to do this.
//           const match = /0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]/.exec(contributorIdElement.content);
//           if (match) {
//             orcidIdElement.append(
//               $$('p')
//                 .addClass('se-author-details-orcid')
//                 .append(
//                   $$('a')
//                     .attr('href', match.input)
//                     .append(match[0]),
//                 ),
//             );
//           } else {
//             orcidIdElement.append(
//               $$('p')
//                 .addClass('se-author-details-orcid')
//                 .append(
//                   $$('a')
//                     .attr('href', contributorIdElement.content)
//                     .append(contributorIdElement.content),
//                 ),
//             );
//           }
//         }
//         el.append(orcidIdElement);
//       });
//     }

//     if (author.competingInterests.length > 0) {
//       author.competingInterests.map(id => {
//         const element = doc.get(id);
//         if (element) {
//           el.append($$(FootnoteComponent, { node: element, mode: CONTENT_MODE }));
//         }
//       });
//     }

//     return el;
//   }
// }
