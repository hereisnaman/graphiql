import CharacterStream from '../CharacterStream';

describe('CharacterStream', () => {
  describe('getStartOfToken', () => {
    it('returns start postition', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.getStartOfToken()).toEqual(0);

      stream.advance();
      stream.advance();

      expect(stream.getStartOfToken()).toEqual(7);
    });
  });

  describe('getCurrentPosition', () => {
    it('returns current postition', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.getCurrentPosition()).toEqual(0);

      stream.advance();

      expect(stream.getCurrentPosition()).toEqual(6);
    });
  });

  describe('sol', () => {
    it('returns true if at start of the source string', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.sol()).toEqual(true);

      stream.advance();

      expect(stream.sol()).toEqual(false);
    });
  });

  describe('eol', () => {
    it('returns true if end of source string is reached', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.eol()).toEqual(false);

      stream.advance();
      stream.advance();

      expect(stream.eol()).toEqual(true);
    });
  });

  describe('column', () => {
    it('returns current position', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      stream.advance();

      expect(stream.column()).toEqual(6);
    });
  });

  describe('current', () => {
    it('returns the current parsed portion of the source string', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      stream.advance();

      expect(stream.current()).toEqual('scalar');
    });
  });

  describe('indentation', () => {
    it('returns 0 for no indendation', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.indentation()).toEqual(0);
    });

    it('returns correct indentation', () => {
      const source = '  scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.indentation()).toEqual(2);
    });

    it('counts tab as 2 spaces in indentation', () => {
      const source = '\tscalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.indentation()).toEqual(2);
    });
  });

  describe('advance', () => {
    it('returns correct matches', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      expect(stream.advance()).toEqual({ kind: 'Name', value: 'scalar' });
      expect(stream.advance()).toEqual({ kind: 'Name', value: 'Foo' });
    });

    it('returns null when at eol', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      stream.advance();
      stream.advance();

      expect(stream.advance()).toEqual(null);
    });

    it('updates start position', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      stream.advance();
      stream.advance();

      expect(stream.getStartOfToken()).toEqual(7);
    });

    it('updates current position', () => {
      const source = 'scalar Foo';
      const stream = new CharacterStream(source);

      stream.advance();
      stream.advance();

      expect(stream.getCurrentPosition()).toEqual(10);
    });
  });
});
