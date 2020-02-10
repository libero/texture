/* eslint-disable @typescript-eslint/no-use-before-define */
import { forEach } from 'substance';
import createEmptyJATS from '../util/createEmptyJATS';
import SectionContainerConverter from './SectionContainerConverter';

export default function internal2jats(doc, jatsExporter) {
  // eslint-disable-line
  const jats = createEmptyJATS();
  jats.$$ = jats.createElement.bind(jats);

  // metadata
  _populateMeta(jats, doc, jatsExporter);
  _populateBody(jats, doc, jatsExporter);
  _populateBack(jats, doc, jatsExporter);

  return jats;
}

function _populateMeta(jats, doc, jatsExporter) {
  // TODO: journal-meta would go here, but is not supported yet

  // @article-type
  const articleEl = jats.find('article');
  const metadata = doc.get('metadata');
  if (metadata.articleType) {
    articleEl.attr('article-type', metadata.articleType);
  }

  _populateArticleMeta(jats, doc, jatsExporter);

  // TODO: def-list would go here, but is not supported yet
}

function _populateArticleMeta(jats, doc, jatsExporter) {
  const $$ = jats.$$;
  const articleMeta = jats.createElement('article-meta');
  const metadata = doc.get('metadata');
  const permission = doc.get(metadata.permission);

  // article-id*
  // TODO not supported yet

  // article-categories?
  articleMeta.append(_exportSubjects(jats, doc));

  // title-group?
  articleMeta.append(_exportTitleGroup(jats, doc, jatsExporter));

  // contrib-group*
  [
    ['author', ['metadata', 'authors']],
    ['editor', ['metadata', 'editors']],
  ].forEach(([type, collectionPath]) => {
    articleMeta.append(_exportContribGroup(jats, doc, jatsExporter, collectionPath, type));
  });

  // aff*
  articleMeta.append(_exportAffiliations(jats, doc));

  // author-notes? // not supported yet

  // pub-date*,
  articleMeta.append(_exportDate($$, metadata, 'publishedDate', 'pub', 'pub-date'));

  // volume?,
  if (metadata.volume) {
    articleMeta.append($$('volume').append(metadata.volume));
  }

  // issue?,
  if (metadata.issue) {
    articleMeta.append($$('issue').append(metadata.issue));
  }

  // issue-title?,
  if (metadata.issueTitle) {
    articleMeta.append($$('issue-title').append(jatsExporter.annotatedText(['metadata', 'issueTitle'])));
  }

  // isbn?, // not supported yet

  // (((fpage,lpage?)?,page-range?)|elocation-id)?,
  if (metadata.elocationId) {
    articleMeta.append($$('elocation-id').append(metadata.elocationId));
  } else if (metadata.fpage && metadata.lpage) {
    // NOTE: last argument is used to resolve insert position, as we don't have means
    // yet to ask for insert position of multiple elements
    const pageRange = metadata.pageRange || metadata.fpage + '-' + metadata.lpage;
    articleMeta.append(
      $$('fpage').append(metadata.fpage),
      $$('lpage').append(metadata.lpage),
      $$('page-range').append(pageRange),
    );
  }

  // history?,
  const historyEl = $$('history');
  historyEl.append(_exportDate($$, metadata, 'acceptedDate', 'accepted'));
  historyEl.append(_exportDate($$, metadata, 'receivedDate', 'received'));
  historyEl.append(_exportDate($$, metadata, 'revReceivedDate', 'rev-recd'));
  historyEl.append(_exportDate($$, metadata, 'revRequestedDate', 'rev-request'));
  // do not export <history> tag if there is no dates inside
  if (historyEl.getChildCount() > 0) {
    articleMeta.append(historyEl);
  }

  // permissions?,
  if (permission && !permission.isEmpty()) {
    articleMeta.append(jatsExporter.convertNode(permission));
  }

  // self-uri*,        // not supported yet

  // related-article*, // not supported yet

  // related-object*,  // not supported yet

  // abstract?,
  articleMeta.append(_exportAbstract(jats, doc, jatsExporter));

  // trans-abstract*, // not yet supported

  // kwd-group*,
  articleMeta.append(_exportKeywords(jats, doc, jatsExporter));

  // funding-group*,
  articleMeta.append(_exportFunders(jats, doc));

  // conference*,      // not supported yet

  // counts?,          // not supported yet

  // custom-meta-group?  // not supported yet

  // replace the <article-meta> element
  const front = jats.find('article > front');
  const oldArticleMeta = front.find('article-meta');
  front.replaceChild(oldArticleMeta, articleMeta);
}

function _exportSubjects(jats, doc) {
  // NOTE: subjects are used to populate <article-categories>
  // - subjects are organized flat, not hierarchically
  // - `subject.category` is mapped to subject[content-type]
  // - subjects are grouped into <subj-groups> using their language property
  // group subjects by language
  // TODO: this should come from the article node
  const $$ = jats.$$;
  const subjects = doc.resolve(['metadata', 'subjects']);

  // FIXME: This is a diverange form the tool's default behaviour which may or may not be an issue. First I need to
  //        figure out if this is a problem or not, and if so then there should be a way to configure the behaviour.
  //        For now, I've left the legacy code block.

  // let byLang = subjects.reduce((byLang, subject) => {
  //   let lang = subject.language;
  //   if (!byLang[lang]) {
  //     byLang[lang] = [];
  //   }
  //   byLang[lang].push(subject);
  //   return byLang;
  // }, {});

  const byGroupType = subjects.reduce((byGroupType, subject) => {
    const groupType = subject.groupType;
    if (!byGroupType[groupType]) {
      byGroupType[groupType] = [];
    }
    byGroupType[groupType].push(subject);
    return byGroupType;
  }, {});

  const articleCategories = $$('article-categories');
  forEach(byGroupType, (subjects, groupType) => {
    const groupEl = $$('subj-group');

    // FIXME: Not needed at present, see above FIXME comment.
    // if (lang !== 'undefined') {
    //   groupEl.attr('xml:lang', lang);
    // }
    grouptEl.attr('subj-group-type', groupType);

    groupEl.append(
      subjects.map(subject => {
        return $$('subject')
          .attr({ 'content-type': subject.category })
          .text(subject.name);
      }),
    );
    articleCategories.append(groupEl);
  });
  // only return if there have been converted subjects
  if (articleCategories.getChildCount() > 0) {
    return articleCategories;
  }
}

function _exportTitleGroup(jats, doc, jatsExporter) {
  const $$ = jats.$$;
  // ATTENTION: ATM only title and subtitle is supported
  // JATS supports more titles beyond this (e.g. for special purposes)
  const TITLE_PATH = ['article', 'title'];
  const SUBTITLE_PATH = ['article', 'subTitle'];
  const titleGroupEl = $$('title-group');
  const articleTitle = $$('article-title');
  _exportAnnotatedText(jatsExporter, TITLE_PATH, articleTitle);
  titleGroupEl.append(articleTitle);

  // Export subtitle if it's not empty
  if (doc.get(SUBTITLE_PATH)) {
    const articleSubTitle = $$('subtitle');
    _exportAnnotatedText(jatsExporter, SUBTITLE_PATH, articleSubTitle);
    titleGroupEl.append(articleSubTitle);
  }

  return titleGroupEl;
}

function _exportContribGroup(jats, doc, exporter, collectionPath, type) {
  // FIXME: this should not happen if we have general support for 'person-groups'
  // ATM, we only support authors, and editors.
  const $$ = jats.$$;
  const contribs = doc.resolve(collectionPath);
  const contribGroupEl = $$('contrib-group').attr('content-type', type);
  const groupedContribs = _groupContribs(contribs);
  for (const [groupId, persons] of groupedContribs) {
    // append persons without a group first
    if (groupId === 'NOGROUP') {
      persons.forEach(person => {
        contribGroupEl.append(_exportPerson($$, exporter, person));
      });
      // persons within a group are nested into an extra <contrib> layer
    } else {
      const group = doc.get(groupId);
      contribGroupEl.append(_exportGroup($$, exporter, group, persons));
    }
  }
  if (contribGroupEl.getChildCount() > 0) {
    return contribGroupEl;
  }
}

/*
  Uses group association of person nodes to create groups

  [p1,p2g1,p3g2,p4g1] => {p1: p1, g1: [p2,p4], g2: [p3] }
*/
function _groupContribs(contribs) {
  const groups = new Map();
  groups.set('NOGROUP', []);
  for (const contrib of contribs) {
    const groupId = contrib.group;
    if (groupId) {
      if (!groups.has(groupId)) {
        groups.set(groupId, []);
      }
      groups.get(groupId).push(contrib);
    } else {
      groups.get('NOGROUP').push(contrib);
    }
  }
  return groups;
}

function _exportPerson($$, exporter, node) {
  const el = $$('contrib').attr({
    id: node.id,
    'contrib-type': 'person',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    corresp: node.corresp ? 'yes' : 'no',
    deceased: node.deceased ? 'yes' : 'no',
  });
  el.append(
    $$('name').append(
      _createTextElement($$, node.surname, 'surname'),
      _createTextElement($$, node.givenNames, 'given-names'),
      _createTextElement($$, node.prefix, 'prefix'),
      _createTextElement($$, node.suffix, 'suffix'),
    ),
    _createTextElement($$, node.email, 'email'),
    _createTextElement($$, node.alias, 'string-name', { 'content-type': 'alias' }),
    _createBioElement($$, exporter, node),
  );
  node.affiliations.forEach(affiliationId => {
    el.append(
      $$('xref')
        .attr('ref-type', 'aff')
        .attr('rid', affiliationId),
    );
  });
  node.funders.forEach(funderId => {
    el.append(
      $$('xref')
        .attr('ref-type', 'award')
        .attr('rid', funderId),
    );
  });
  return el;
}

function _createBioElement($$, exporter, node) {
  const content = node.resolve('bio');
  if (content.length > 0) {
    // NOTE: we don't want to export empty containers
    // e.g. if there is only one empty paragraph we are not exporting anything
    const first = content[0];
    if (content.length === 1 && first.isText() && first.isEmpty()) {
      return;
    }
    const bioEl = $$('bio').append(content.map(p => exporter.convertNode(p)));
    return bioEl;
  }
}

function _exportGroup($$, exporter, node, groupMembers) {
  /*
    <contrib id="${node.id}" contrib-type="group" equal-contrib="yes|no" corresp="yes|no">
      <collab>
        <named-content content-type="name">${node.name}</named-content>
        <email>${node.email}</email>
        <$ for (let affId of node.affiliations) {$>
          <xref ref-type="aff" rid=${affId} />
        <$ } $>
        <$ for (let awardId of node.awards) {$>
          <xref ref-type="award" rid=${awardId} />
        <$ } $>
        <contrib-group contrib-type="group-member">
          <$ for (let person of groupMembers) {$>
            <Person node=${person} />
          <$ } $>
        </contrib-group>
        </collab>
    </contrib>
  */
  const contribEl = $$('contrib').attr({
    id: node.id,
    'contrib-type': 'group',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    corresp: node.corresp ? 'yes' : 'no',
  });
  const collab = $$('collab');
  collab.append(
    $$('named-content')
      .attr('content-type', 'name')
      .append(node.name),
    $$('email').append(node.email),
  );
  // Adds affiliations to group
  node.affiliations.forEach(affiliationId => {
    collab.append(
      $$('xref')
        .attr('ref-type', 'aff')
        .attr('rid', affiliationId),
    );
  });
  // Add funders to group
  node.funders.forEach(funderId => {
    collab.append(
      $$('xref')
        .attr('ref-type', 'award')
        .attr('rid', funderId),
    );
  });
  // Add group members
  // <contrib-group contrib-type="group-member">
  const contribGroup = $$('contrib-group').attr('contrib-type', 'group-member');
  groupMembers.forEach(person => {
    const contribEl = _exportPerson($$, exporter, person);
    contribGroup.append(contribEl);
  });
  collab.append(contribGroup);
  contribEl.append(collab);
  return contribEl;
}

function _exportAffiliations(jats, doc) {
  const $$ = jats.$$;
  const affiliations = doc.resolve(['metadata', 'affiliations']);
  const orgEls = affiliations.map(node => {
    const el = $$('aff').attr('id', node.id);
    el.append(_createTextElement($$, node.institution, 'institution', { 'content-type': 'orgname' }));
    el.append(_createTextElement($$, node.division1, 'institution', { 'content-type': 'orgdiv1' }));
    el.append(_createTextElement($$, node.division2, 'institution', { 'content-type': 'orgdiv2' }));
    el.append(_createTextElement($$, node.division3, 'institution', { 'content-type': 'orgdiv3' }));
    el.append(_createTextElement($$, node.street, 'addr-line', { 'content-type': 'street-address' }));
    el.append(_createTextElement($$, node.addressComplements, 'addr-line', { 'content-type': 'complements' }));
    el.append(_createTextElement($$, node.city, 'city'));
    el.append(_createTextElement($$, node.county, 'state'));
    el.append(_createTextElement($$, node.postalCode, 'postal-code'));
    el.append(_createTextElement($$, node.country, 'country'));
    el.append(_createTextElement($$, node.phone, 'phone'));
    el.append(_createTextElement($$, node.fax, 'fax'));
    el.append(_createTextElement($$, node.email, 'email'));
    el.append(_createTextElement($$, node.uri, 'uri', { 'content-type': 'link' }));
    return el;
  });
  return orgEls;
}

function _exportDate($$, node, prop, dateType, tag) {
  const date = node[prop];
  // Do not export a date without value
  if (!date) return;

  const tagName = tag || 'date';
  const el = $$(tagName)
    .attr('date-type', dateType)
    .attr('iso-8601-date', date);

  const year = date.split('-')[0];
  const month = date.split('-')[1];
  const day = date.split('-')[2];
  if (_isDateValid(date)) {
    el.append($$('day').append(day), $$('month').append(month), $$('year').append(year));
  } else if (_isYearMonthDateValid(date)) {
    el.append($$('month').append(month), $$('year').append(year));
  } else if (_isYearDateValid(date)) {
    el.append($$('year').append(year));
  }
  return el;
}

function _isDateValid(str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (!regexp.test(str)) return false;
  return true;
}

function _isYearMonthDateValid(str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])$/;
  if (!regexp.test(str)) return false;
  return true;
}

function _isYearDateValid(str) {
  const regexp = /^[0-9]{4}$/;
  if (!regexp.test(str)) return false;
  return true;
}

function _createTextElement($$, text, tagName, attrs) {
  if (text) {
    const el = $$(tagName).append(text);
    forEach(attrs, (value, key) => {
      el.attr(key, value);
    });
    return el;
  }
}

/**
 * @param {DOMElement} jats the JATS DOM to export into
 * @param {Document} doc the document to convert from
 * @param {XMLExporter} jatsExporter an exporter instance used to export nested nodes
 */
function _exportAbstract(jats, doc, jatsExporter) {
  const $$ = jats.$$;
  const sectionContainerConverter = new SectionContainerConverter();
  const abstract = doc.get('abstract');
  const els = [];
  // Main abstract
  const abstractEl = $$('abstract');
  // the abstract element itself is required
  // but we skip empty content
  if (!_isContainerEmpty(abstract, 'content')) {
    sectionContainerConverter.export(abstract, abstractEl, jatsExporter);
  }
  els.push(abstractEl);
  // Custom abstracts
  doc.resolve(['article', 'customAbstracts']).forEach(customAbstract => {
    const customAbstractEl = $$('abstract');
    if (customAbstract.abstractType) {
      customAbstractEl.attr('abstract-type', customAbstract.abstractType);
    }
    if (customAbstract.title) {
      const titleEl = $$('title');
      _exportAnnotatedText(jatsExporter, [customAbstract.id, 'title'], titleEl);
      customAbstractEl.append(titleEl);
    }
    if (!_isContainerEmpty(customAbstract, 'content')) {
      sectionContainerConverter.export(customAbstract, customAbstractEl, jatsExporter);
    }
    els.push(customAbstractEl);
  });

  return els;
}

function _exportKeywords(jats, doc, jatsExporter) {
  const $$ = jats.$$;
  // TODO: remove or rework tranlations of keywords
  const keywords = doc.resolve(['metadata', 'keywords']);
  const byLang = keywords.reduce((byLang, keyword) => {
    const lang = keyword.language;
    if (!byLang[lang]) {
      byLang[lang] = [];
    }
    byLang[lang].push(keyword);
    return byLang;
  }, {});
  const keywordGroups = [];
  forEach(byLang, (keywords, lang) => {
    const groupEl = $$('kwd-group');
    if (lang !== 'undefined') {
      groupEl.attr('xml:lang', lang);
    }
    groupEl.append(
      keywords.map(keyword => {
        return $$('kwd')
          .attr({ 'content-type': keyword.category })
          .append(jatsExporter.annotatedText([keyword.id, 'name']));
      }),
    );
    keywordGroups.push(groupEl);
  });
  return keywordGroups;
}

function _exportFunders(jats, doc) {
  const $$ = jats.$$;
  const funders = doc.resolve(['metadata', 'funders']);
  if (funders.length > 0) {
    const fundingGroupEl = $$('funding-group');
    funders.forEach(funder => {
      const el = $$('award-group').attr('id', funder.id);
      const institutionWrapEl = $$('institution-wrap');
      institutionWrapEl.append(
        _createTextElement($$, funder.fundRefId, 'institution-id', { 'institution-id-type': 'FundRef' }),
      );
      institutionWrapEl.append(_createTextElement($$, funder.institution, 'institution'));
      el.append($$('funding-source').append(institutionWrapEl), _createTextElement($$, funder.awardId, 'award-id'));
      fundingGroupEl.append(el);
    });
    return fundingGroupEl;
  }
}

function _populateBody(jats, doc, jatsExporter) {
  const body = doc.get('body');
  if (!_isContainerEmpty(body, 'content')) {
    const bodyEl = jatsExporter.convertNode(body);
    const oldBody = jats.find('article > body');
    oldBody.parentNode.replaceChild(oldBody, bodyEl);
  }
}

function _populateBack(jats, doc, jatsExporter) {
  const $$ = jats.$$;
  const backEl = jats.find('article > back');
  /*
    back:
    (
      fn-group?,
      ref-list?,
    )
  */
  const footnotes = doc.resolve(['article', 'footnotes']);
  if (footnotes.length > 0) {
    backEl.append(
      $$('fn-group').append(
        footnotes.map(footnote => {
          return jatsExporter.convertNode(footnote);
        }),
      ),
    );
  }

  const references = doc.resolve(['article', 'references']);
  if (references.length > 0) {
    backEl.append(
      $$('ref-list').append(
        references.map(ref => {
          return jatsExporter.convertNode(ref);
        }),
      ),
    );
  }
}

function _exportAnnotatedText(jatsExporter, path, el) {
  el.append(jatsExporter.annotatedText(path));
}

function _isContainerEmpty(node, propertyName) {
  const ids = node[propertyName];
  if (ids.length === 0) return true;
  if (ids.length > 1) return false;
  const doc = node.getDocument();
  const first = doc.get(ids[0]);
  return first && first.isText() && !first.getText();
}
