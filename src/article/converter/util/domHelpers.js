import { DomUtils } from 'substance';

export function getText(rootEl, selector) {
  let el = rootEl.find(selector);
  if (el) {
    return el.textContent;
  } else {
    return '';
  }
}

export function getSeparatedText(rootEl, selector) {
  let el = rootEl.findAll(selector);
  if (el) {
    return el
      .map(m => {
        return m.textContent;
      })
      .join('; ');
  } else {
    return '';
  }
}

export function getAttr(rootEl, selector, attr) {
  let el = rootEl.find(selector);
  if (el) {
    return el.attr(attr);
  } else {
    return '';
  }
}

export function findChild(el, cssSelector) {
  const children = el.getChildren();
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.is(cssSelector)) return child;
  }
}

export function findAllChildren(el, cssSelector) {
  const children = el.getChildren();
  let result = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.is(cssSelector)) {
      result.push(child);
    }
  }
  return result;
}

export function printElement(el, options = {}) {
  let maxLevel = options.maxLevel || 1000;
  let res = _printElement(el, 1, maxLevel);
  return res;
}

export function retainChildren(el, ...allowedTagNames) {
  allowedTagNames = new Set(allowedTagNames);
  let childNodes = el.getChildNodes();
  for (let idx = childNodes.length - 1; idx >= 0; idx--) {
    let child = childNodes[idx];
    if (!allowedTagNames.has(child.tagName)) {
      el.removeAt(idx);
    }
  }
  return el;
}

function _printElement(el, level, maxLevel) {
  let INDENT = new Array(level - 1);
  INDENT.fill('  ');
  INDENT = INDENT.join('');

  if (el.isElementNode()) {
    if (level <= maxLevel) {
      let res = [];
      res.push(INDENT + _openTag(el));
      res = res.concat(
        el.childNodes
          .map(child => {
            return _printElement(child, level + 1, maxLevel);
          })
          .filter(Boolean),
      );
      res.push(INDENT + _closeTag(el));
      return res.join('\n');
    } else {
      return INDENT + _openTag(el) + '...' + _closeTag(el);
    }
  } else if (el.isTextNode()) {
    let textContent = el.textContent;
    if (/^\s*$/.exec(textContent)) {
      return '';
    } else {
      return INDENT + JSON.stringify(el.textContent);
    }
  } else {
    // TODO: render other node types and consider maxLevel
    return INDENT + el.serialize();
  }
}

function _openTag(el) {
  let attribStr = DomUtils.formatAttribs(el);
  if (attribStr) {
    return `<${el.tagName} ${attribStr}>`;
  } else {
    return `<${el.tagName}>`;
  }
}

function _closeTag(el) {
  return `</${el.tagName}>`;
}
