/**
 *  Copyright (c) 2020 GraphQL Contributors
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

/**
 * CharacterStream implements a stream of character tokens given a source text.
 * The API design follows that of CodeMirror.StringStream.
 *
 * Required:
 *
 *      sourceText: (string), A raw GraphQL source text. Works best if a line
 *        is supplied.
 *
 */
import { CharacterStreamInterface, Token, LexerToken } from './types';
import { Lexer, Source } from 'graphql';
import * as LexerUtils from 'graphql/language/lexer';

const { isPunctuatorTokenKind } = LexerUtils as any;

export default class CharacterStream implements CharacterStreamInterface {
  _start: number;
  _pos: number;
  _lexer: Lexer;

  constructor(sourceText: string) {
    this._start = 0;
    this._pos = 0;
    this._lexer = new Lexer(new Source(sourceText));
  }

  getStartOfToken = (): number => this._start;

  getCurrentPosition = (): number => this._pos;

  eol = (): boolean => !this.lookAhead();

  sol = (): boolean => this._pos === 0;

  column = (): number => this._pos;

  indentation = (): number => {
    const match = this._lexer.source.body.match(/\s*/);
    let indent = 0;
    if (match && match.length !== 0) {
      const whitespaces = match[0];
      let pos = 0;
      while (whitespaces.length > pos) {
        if (whitespaces.charCodeAt(pos) === 9) {
          indent += 2;
        } else {
          indent++;
        }
        pos++;
      }
    }

    return indent;
  };

  current = (): string => this._lexer.source.body.slice(this._start, this._pos);

  _transformLexerToken = (token: LexerToken): Token | null => {
    const { kind, value } = token;
    if (kind === '<EOF>') {
      return null;
    }

    if (['Int', 'Float'].includes(kind)) {
      return { kind: 'Number', value };
    }

    if (kind === 'BlockString') {
      return { kind: 'String', value: `"${value}"` };
    }

    if (isPunctuatorTokenKind(kind)) {
      return { kind: 'Punctuation', value: kind };
    }

    if (kind === 'String') {
      return { kind, value: `"${value}"` };
    }

    if (value === undefined) {
      throw new Error('Invalid token returned from lexer');
    }

    return { kind, value };
  };

  advance = (): Token | null => {
    try {
      const lexerToken = this._lexer.advance();
      const token = this._transformLexerToken(lexerToken);
      if (!token) {
        return token;
      }

      this._start += lexerToken.column - 1;
      this._pos = this._start + token.value.length;

      return token;
    } catch (err) {
      return null;
    }
  };

  lookAhead = (): Token | null => {
    try {
      return this._transformLexerToken(this._lexer.lookahead());
    } catch (err) {
      return null;
    }
  };
}
