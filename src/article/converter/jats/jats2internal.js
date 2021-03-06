/* eslint-disable @typescript-eslint/no-use-before-define */
import { uuid, documentHelpers } from 'substance';
import { findChild, getText, retainChildren } from '../util/domHelpers';
import SectionContainerConverter from './SectionContainerConverter';

export default function jats2internal(jats, doc, jatsImporter) {
  // metadata
  _populateAuthorNotes(doc, jats, jatsImporter);
  _populateAffiliations(doc, jats);
  _populateAuthors(doc, jats, jatsImporter);
  _populateEditors(doc, jats, jatsImporter);
  _populateFunders(doc, jats);
  _populateArticleInfo(doc, jats, jatsImporter);
  _populateKeywords(doc, jats, jatsImporter);
  _populateSubjects(doc, jats);
  _populateRelatedArticles(doc, jats, jatsImporter);

  // content
  _populateTitle(doc, jats, jatsImporter);
  _populateSubTitle(doc, jats, jatsImporter);
  _populateAbstract(doc, jats, jatsImporter);
  _populateBody(doc, jats, jatsImporter);
  _populateFootnotes(doc, jats, jatsImporter);
  _populateConflictOfInterests(doc, jats, jatsImporter);
  _populateReferences(doc, jats, jatsImporter);
  _populateAcknowledgements(doc, jats, jatsImporter);

  return doc;
}

function _populateAffiliations(doc, jats) {
  // FIXME: At the moment we are ONLY getting affiliations for Authors, so we are missing editors, etc. I think that
  //        to properly support them all we need to re-model the metadata model.
  const affEls = jats.findAll('article > front > article-meta > contrib-group[content-type=author] > aff');
  const orgIds = affEls.map(el => {
    const org = {
      id: el.id,
      type: 'affiliation',
      institution: getText(el, 'institution[content-type=orgname]') || getText(el, 'institution:not([content-type])'),
      division1: getText(el, 'institution[content-type=orgdiv1]') || getText(el, 'institution[content-type=dept'),
      division2: getText(el, 'institution[content-type=orgdiv2]'),
      division3: getText(el, 'institution[content-type=orgdiv3]'),
      street: getText(el, 'addr-line[content-type=street-address]'),
      addressComplements: getText(el, 'addr-line[content-type=complements]'),
      city: getText(el, 'city') || getText(el, 'addr-line > city'),
      county: getText(el, 'state'),
      postalCode: getText(el, 'postal-code'),
      country: getText(el, 'country'),
      phone: getText(el, 'phone'),
      fax: getText(el, 'fax'),
      email: getText(el, 'email'),
      uri: getText(el, 'uri[content-type=link]'),
    };
    return doc.create(org).id;
  });
  doc.set(['metadata', 'affiliations'], orgIds);
}

function _populateAuthors(doc, jats, importer) {
  const authorEls = jats.findAll(`contrib-group[content-type=author] > contrib`);
  _populateContribs(doc, jats, importer, ['metadata', 'authors'], authorEls);
}

function _populateEditors(doc, jats, importer) {
  const editorEls = jats.findAll(`contrib-group[content-type=editor] > contrib`);
  _populateContribs(doc, jats, importer, ['metadata', 'editors'], editorEls);
}

function _populateContribs(doc, jats, importer, contribsPath, contribEls, groupId) {
  for (const contribEl of contribEls) {
    if (contribEl.attr('contrib-type') === 'group') {
      // ATTENTION: groups are defined 'inplace'
      // the members of the group are appended to the list of persons
      const group = {
        id: contribEl.id,
        type: 'group',
        name: getText(contribEl, 'named-content[content-type=name]'),
        email: getText(contribEl, 'email'),
        affiliations: _getAffiliationIds(contribEl, true),
        equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
        corresp: contribEl.getAttribute('corresp') === 'yes',
        funders: _getAwardIds(contribEl),
      };
      documentHelpers.append(doc, ['metadata', 'groups'], doc.create(group).id);

      const memberEls = contribEl.findAll('contrib');
      _populateContribs(doc, jats, importer, contribsPath, memberEls, group.id);
    } else {
      const contrib = doc.create({
        id: contribEl.id,
        type: 'person',
        givenNames: getText(contribEl, 'given-names'),
        surname: getText(contribEl, 'surname'),
        email: getText(contribEl, 'email'),
        alias: getText(contribEl, 'string-name[content-type=alias]'),
        prefix: getText(contribEl, 'prefix'),
        suffix: getText(contribEl, 'suffix'),
        affiliations: _getAffiliationIds(contribEl),
        funders: _getAwardIds(contribEl),
        bio: _getBioContent(contribEl, importer),
        equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
        corresp: contribEl.getAttribute('corresp') === 'yes',
        deceased: contribEl.getAttribute('deceased') === 'yes',
        group: groupId,
        contributorIds: _getContributorIds(contribEl, importer),
        conflictOfInterests: _getAuthorConflictOfInterests(contribEl, importer),
      });
      documentHelpers.append(doc, contribsPath, contrib.id);
    }
  }
}

function _populateAuthorNotes(doc, jats, jatsImporter) {
  const $$ = jats.createElement.bind(jats);
  const fnEls = jats.findAll('article > front > article-meta > author-notes > fn:not([fn-type=COI-statement])');
  const article = doc.get('article');
  article.authorNotes = fnEls.map(fnEl => {
    // there must be at least one paragraph
    if (!fnEl.find('p')) {
      fnEl.append($$('p'));
    }
    return jatsImporter.convertElement(fnEl).id;
  });
}

function _getAuthorConflictOfInterests(el, importer) {
  const xrefs = el.findAll('xref[ref-type=fn]');
  const ids = xrefs.map(xref => xref.attr('rid'));
  return ids;
}

// ATTENTION: bio is not a specific node anymore, just a collection of paragraphs
function _getBioContent(el, importer) {
  const $$ = el.createElement.bind(el.getOwnerDocument());
  let bioEl = findChild(el, 'bio');
  // If there is no bio element we should provide it
  if (!bioEl) {
    bioEl = $$('bio');
  }

  // TODO: this code looks similar to what we have in abstract or and caption
  // drop everything other than 'p' from bio
  retainChildren(bioEl, 'p');
  // there must be at least one paragraph
  if (!bioEl.find('p')) {
    bioEl.append($$('p'));
  }

  return bioEl.children.map(child => importer.convertElement(child).id);
}

function _getAffiliationIds(el, isGroup) {
  // let dom = el.ownerDocument
  let xrefs = el.findAll('xref[ref-type=aff]');
  // NOTE: for groups we need to extract only affiliations of group, without members
  if (isGroup) {
    xrefs = el.findAll('collab > xref[ref-type=aff]');
  }
  const affs = xrefs.map(xref => xref.attr('rid'));
  return affs;
}

function _getContributorIds(el, importer) {
  const elements = el.findAll('contrib-id');
  const contributorIds = elements.map(element => importer.convertElement(element).id);
  return contributorIds;
}

function _getAwardIds(el) {
  const xrefs = el.findAll('xref[ref-type=award]');
  const awardIds = xrefs.map(xref => xref.attr('rid'));
  return awardIds;
}

function _populateFunders(doc, jats) {
  const awardEls = jats.findAll('article > front > article-meta > funding-group > award-group');
  const funderIds = awardEls.map(el => {
    const funder = {
      id: el.id,
      type: 'funder',
      institution: getText(el, 'institution'),
      fundRefId: getText(el, 'institution-id'),
      awardId: getText(el, 'award-id'),
    };
    return doc.create(funder).id;
  });
  doc.set(['metadata', 'funders'], funderIds);
}

// TODO: use doc API for manipulation, not a bare object
function _populateArticleInfo(doc, jats, jatsImporter) {
  const articleEl = jats.find('article');
  const articleMetaEl = articleEl.find('front > article-meta');
  const metadata = doc.get('metadata');
  Object.assign(metadata, {
    doi: getText(articleMetaEl, 'article-id[pub-id-type=doi]'),
    articleType: articleEl.getAttribute('article-type') || '',
    elocationId: getText(articleMetaEl, 'elocation-id'),
    fpage: getText(articleMetaEl, 'fpage'),
    lpage: getText(articleMetaEl, 'lpage'),
    issue: getText(articleMetaEl, 'issue'),
    volume: getText(articleMetaEl, 'volume'),
    pageRange: getText(articleMetaEl, 'page-range'),
    dtdVersion: articleEl.getAttribute('dtd-version'),
  });

  // TODO: At the moment I am only getting the bits I need, but need to generalise and process
  //       the whole of the journal-meta section.
  const journalMetaEl = articleEl.find('front > journal-meta');
  if (journalMetaEl) {
    metadata['issn'] = getText(journalMetaEl, 'issn');
    const publisherEl = findChild(journalMetaEl, 'publisher');
    if (publisherEl) {
      metadata['publisherName'] = getText(publisherEl, 'publisher-name');
    }
  }

  const issueTitleEl = findChild(articleMetaEl, 'issue-title');
  if (issueTitleEl) {
    metadata['issueTitle'] = jatsImporter.annotatedText(issueTitleEl, ['metadata', 'issueTtle']);
  }
  // Import permission if present
  const permissionsEl = articleMetaEl.find('permissions');
  // An empty permission is already there, but will be replaced if <permission> element is there
  if (permissionsEl) {
    doc.delete(metadata.permission);
    const permission = jatsImporter.convertElement(permissionsEl);
    // ATTENTION: so that the document model is correct we need to use
    // the Document API  to set the permission id
    metadata.permission = permission.id;
  }

  // FIXME: This isn't an effective means to handle dates in my mind. We should parse all 'date' and 'pub-date' elements
  //        into internal 'date' nodes, stored as a collection under the Metadata node. There should then be helper
  //        functions to get specific dates.
  //const articleDateEls = articleMetaEl.findAll('history > date, pub-date');
  const articleDateEls = articleMetaEl.findAll('pub-date');
  if (articleDateEls.length > 0) {
    const dates = {};
    articleDateEls.forEach(dateEl => {
      const date = _extractPubDate(dateEl);
      dates[date.type] = date.value;
    });
    Object.assign(metadata, dates);
  }
}

const DATE_TYPES_MAP = {
  pub: 'publishedDate',
  accepted: 'acceptedDate',
  received: 'receivedDate',
  'rev-recd': 'revReceivedDate',
  'rev-request': 'revRequestedDate',
};

function _extractDate(el) {
  const dateType = el.getAttribute('date-type');
  const value = el.getAttribute('iso-8601-date');
  const entityProp = DATE_TYPES_MAP[dateType];
  return {
    value: value,
    type: entityProp,
  };
}

const PUB_DATE_TYPES_MAP = {
  publication: 'publishedDate',
  collection: 'collectionDate',
};

function _extractPubDate(el) {
  const dateType = el.getAttribute('pub-type') || el.getAttribute('date-type');
  const day = getText(el, 'day');
  const month = getText(el, 'month');
  const year = getText(el, 'year');
  const value = [day, month, year]
    .reduce((acc, val) => {
      if (val) acc.push(val);
      return acc;
    }, [])
    .join('/');
  const entityProp = PUB_DATE_TYPES_MAP[dateType];
  return {
    value: value,
    type: entityProp,
  };
}

function _populateKeywords(doc, jats, jatsImporter) {
  const kwdGroupEls = jats.findAll('article > front > article-meta > kwd-group');
  const kwdIds = [];
  for (const kwdGroup of kwdGroupEls) {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'author-generated';
    const kwdEls = kwdGroup.findAll('kwd');
    for (const kwdEl of kwdEls) {
      const kwd = doc.create({
        type: 'keyword',
        groupType: kwdGroupType,
        category: kwdEl.getAttribute('content-type'),
        language: kwdEl.getParent().getAttribute('xml:lang'),
      });
      kwd.name = jatsImporter.annotatedText(kwdEl, [kwd.id, 'name']);
      kwdIds.push(kwd.id);
    }
  }
  doc.get('metadata').keywords = kwdIds;
}

function _populateRelatedArticles(doc, jats, jatsImporter) {
  const relatedArticleEls = jats.findAll('article > front > article-meta > related-article');
  const relatedArticleIds = relatedArticleEls.map(relatedArticleEl => {
    const relatedArticle = doc.create({
      type: 'related-article',
      extLinkType: relatedArticleEl.getAttribute('ext-link-type'),
      id: relatedArticleEl.getAttribute('id'),
      relatedArticleType: relatedArticleEl.getAttribute('related-article-type'),
      href: relatedArticleEl.getAttribute('xlink:href'),
    });
    return relatedArticle.id;
  });
  doc.get('article').relatedArticles = relatedArticleIds;
}

function _populateSubjects(doc, jats) {
  // TODO: IMO we need to consolidate this. The original meaning of <subj-group> seems to be
  // to be able to define an ontology, also hierarchically
  // This implementation assumes that subjects are flat.
  // To support translations, multiple subj-groups can be provided with different xml:lang
  const subjGroups = jats.findAll('article > front > article-meta > article-categories > subj-group');
  // TODO: get this from the article element
  const DEFAULT_LANG = 'en';
  for (const subjGroup of subjGroups) {
    const language = subjGroup.attr('xml:lang') || DEFAULT_LANG;
    const groupType = subjGroup.attr('subj-group-type');
    const subjectEls = subjGroup.findAll('subject');
    for (const subjectEl of subjectEls) {
      const subject = doc.create({
        type: 'subject',
        name: subjectEl.textContent,
        category: subjectEl.getAttribute('content-type'),
        groupType,
        language,
      });
      documentHelpers.append(doc, ['metadata', 'subjects'], subject.id);
    }
  }
}

function _populateTitle(doc, jats, jatsImporter) {
  const article = doc.get('article');
  const titleEl = jats.find('article > front > article-meta > title-group > article-title');
  if (titleEl) {
    article.title = jatsImporter.annotatedText(titleEl, ['article', 'title']);
  }
  // FIXME: bring back translations
  // translations
  // let transTitleEls = jats.findAll('article > front > article-meta > title-group > trans-title-group > trans-title')
  // for (let transTitleEl of transTitleEls) {
  //   let group = transTitleEl.parentNode
  //   let language = group.attr('xml:lang')
  //   let translation = doc.create({
  //     type: 'article-title-translation',
  //     id: transTitleEl.id,
  //     source: ['article', 'title'],
  //     language
  //   })
  //   translation.content = jatsImporter.annotatedText(transTitleEl, translation.getPath())
  //   documentHelpers.append(doc, ['article', 'translations'], translation.id)
  // }
}

function _populateSubTitle(doc, jats, jatsImporter) {
  const article = doc.get('article');
  const subTitleEl = jats.find('article > front > article-meta > title-group > subtitle');
  if (subTitleEl) {
    article.subTitle = jatsImporter.annotatedText(subTitleEl, ['article', 'subTitle']);
  }
}

function _populateAbstract(doc, jats, jatsImporter) {
  const $$ = jats.createElement.bind(jats);
  const sectionContainerConverter = new SectionContainerConverter();

  // NOTE: The first abstract without abstract-type is used as main abstract,
  // if there are others they should be imported as a custom abstract
  // as well as abstracts with abstract-type attribute
  const mainAbstract = doc.get('abstract');
  const abstractEls = jats.findAll('article > front > article-meta > abstract');
  let mainAbstractImported = false;
  abstractEls.forEach(abstractEl => {
    const titleEl = findChild(abstractEl, 'title');
    if (titleEl) {
      abstractEl.removeChild(titleEl);
    }
    // if the abstract is empty, add an empty paragraph
    if (abstractEl.getChildCount() === 0) {
      abstractEl.append($$('p'));
    }
    const abstractType = abstractEl.attr('abstract-type');
    if (!abstractType && !mainAbstractImported) {
      sectionContainerConverter.import(abstractEl, mainAbstract, jatsImporter);
      mainAbstractImported = true;
    } else {
      const abstract = doc.create({
        type: 'custom-abstract',
        id: abstractEl.id,
        abstractType: abstractType,
      });
      sectionContainerConverter.import(abstractEl, abstract, jatsImporter);
      if (titleEl) {
        abstract.title = jatsImporter.annotatedText(titleEl, [abstract.id, 'title']);
      }
      documentHelpers.append(doc, ['article', 'customAbstracts'], abstract.id);
    }
  });

  // FIXME: bring back translations
  // translations
  // let transAbstractEls = jats.findAll('article > front > article-meta > trans-abstract')
  // for (let transAbstractEl of transAbstractEls) {
  //   let language = transAbstractEl.attr('xml:lang')
  //   let translation = doc.create({
  //     type: 'article-abstract-translation',
  //     id: transAbstractEl.id,
  //     source: [mainAbstract.id, 'content'],
  //     language,
  //     content: transAbstractEl.getChildren().map(child => {
  //       return jatsImporter.convertElement(child).id
  //     })
  //   })
  //   documentHelpers.append(doc, ['article', 'translations'], translation.id)
  // }
}

function _populateAcknowledgements(doc, jats, jatsImporter) {
  const $$ = jats.createElement.bind(jats);
  const sectionContainerConverter = new SectionContainerConverter();

  const acknowledgments = jats.findAll('article > back > ack');
  if (acknowledgments.length > 0) {
    acknowledgments.forEach(acknowledgment => {
      // Need to remove the 'title' from the child nodes, otherwise it will appear inline with the main text of the
      // acknowledgement.
      const titleEl = findChild(acknowledgment, 'title');
      if (titleEl) {
        acknowledgment.removeChild(titleEl);
      }

      // If there are no childNodes (e.g. its an empty element), then add an empty paragraph
      if (acknowledgment.getChildCount() === 0) {
        acknowledgment.append($$('p'));
      }

      const node = doc.create({
        type: 'acknowledgement',
        id: acknowledgment.id,
      });

      sectionContainerConverter.import(acknowledgment, node, jatsImporter);
      if (titleEl) {
        node.title = jatsImporter.annotatedText(titleEl, [node.id, 'title']);
      }
      documentHelpers.append(doc, ['article', 'acknowledgements'], node.id);
    });
  } else {
    // If there is no 'ack' element present, then insert an empty one into the doc.
    const node = doc.create({ type: 'acknowledgement', content: [doc.create({ type: 'paragraph' }).id] });
    documentHelpers.append(doc, ['article', 'acknowledgements'], node.id);
  }
}

function _populateBody(doc, jats, jatsImporter) {
  const $$ = jats.createElement.bind(jats);
  // ATTENTION: JATS can have multiple abstracts
  // ATM we only take the first, loosing the others
  const bodyEl = jats.find('article > body');
  if (bodyEl) {
    // add an empty paragraph if the body is empty
    if (bodyEl.getChildCount() === 0) {
      bodyEl.append($$('p'));
    }
    const body = doc.get('body');
    // ATTENTION: because there is already a body node in the document, *the* body, with id 'body'
    // we must change the id of the body element so that it does not collide with the internal one
    bodyEl.id = uuid();
    const tmp = jatsImporter.convertElement(bodyEl);
    const ids = tmp.content.slice();
    tmp.content = [];
    body.content = ids;
    doc.delete(tmp);
  }
}

function _populateFootnotes(doc, jats, jatsImporter) {
  const $$ = jats.createElement.bind(jats);
  const fnEls = jats.findAll('article > back > fn-group > fn:not([fn-type=COI-statement])');
  const article = doc.get('article');
  article.footnotes = fnEls.map(fnEl => {
    // there must be at least one paragraph
    if (!fnEl.find('p')) {
      fnEl.append($$('p'));
    }
    return jatsImporter.convertElement(fnEl).id;
  });
}

function _populateConflictOfInterests(doc, jats, jatsImporter) {
  const $$ = jats.createElement.bind(jats);
  const fnEls = [
    ...jats.findAll('article > front > article-meta > author-notes > fn[fn-type=COI-statement]'),
    ...jats.findAll('article > back > fn-group > fn[fn-type=COI-statement]'),
  ];
  const article = doc.get('article');
  article.conflictOfInterests = fnEls.map(fnEl => {
    // there must be at least one paragraph
    if (!fnEl.find('p')) {
      fnEl.append($$('p'));
    }
    return jatsImporter.convertElement(fnEl).id;
  });
}

function _populateReferences(doc, jats, jatsImporter) {
  // TODO: make sure that we only allow this place for references via restricting the TextureJATS schema
  const refListEl = jats.find('article > back > ref-list');
  if (refListEl) {
    const article = doc.get('article');
    const refEls = refListEl.findAll('ref');
    article.references = refEls.map(refEl => jatsImporter.convertElement(refEl).id);
  }
}
