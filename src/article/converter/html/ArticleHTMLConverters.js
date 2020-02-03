import TableConverter from '../jats/TableConverter';

import BoldConverter from './BoldConverter';
import ExtLinkConverter from './ExtLinkConverter';
import PreformatConverter from './PreformatConverter';
import HeadingConverter from './HeadingConverter';
import ItalicConverter from './ItalicConverter';
import ListConverter from './ListConverter';
import ListItemConverter from './ListItemConverter';
import ParagraphConverter from './ParagraphConverter';
import StrikeConverter from './StrikeConverter';
import SubConverter from './SubConverter';
import SupConverter from './SupConverter';
import UnderlineConverter from './UnderlineConverter';

export default [
  BoldConverter,
  PreformatConverter,
  ExtLinkConverter,
  HeadingConverter,
  ItalicConverter,
  ListConverter,
  ListItemConverter,
  ParagraphConverter,
  StrikeConverter,
  SubConverter,
  SupConverter,
  new TableConverter(),
  UnderlineConverter,
];
