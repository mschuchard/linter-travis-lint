'use babel';

import * as path from 'path';

describe('The Travis Lint provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-travis-lint');
      return atom.packages.activatePackage('language-yaml').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures/clean', '.travis.yml'))
      );
    });
  });

  describe('checks a file with travis syntax issues', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/travis_syntax', '.travis.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('on root: unknown key fake (key)');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+travis_syntax\/\.travis\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('warning');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('on root: deprecated key: sudo (The key `sudo` has no effect anymore.)');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+travis_syntax\/\.travis\.yml$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with a yaml syntax issue', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/yaml_syntax', '.travis.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("(<unknown>): could not find expected ':' while scanning a simple key");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+yaml_syntax\/\.travis\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 0], [1, 1]]);
        });
      });
    });
  });

  it('ignores a non-Travis yaml file', (done) => {
    const otherFile = path.join(__dirname, 'fixtures', 'not_travis.yml');
    return atom.workspace.open(otherFile).then(editor =>
      lint(editor).then(messages => {
      }, () => {
        done();
      })
    );
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures/clean', '.travis.yml');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
