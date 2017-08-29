'use babel';

import * as path from 'path';

describe('The Travis Lint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-travis-lint');
      return atom.packages.activatePackage('language-yaml').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures/clean', '.travis.yml'))
      );
    });
  });

  describe('checks a file with a travis syntax issue', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/travis_syntax', '.travis.yml');
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
          expect(messages[0].excerpt).toEqual('unexpected key fake, dropping');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+travis_syntax\/\.travis\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
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
          expect(messages[0].excerpt).toEqual("syntax error: (<unknown>): could not find expected ':' while scanning a simple key");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+yaml_syntax\/\.travis\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 0], [1, 1]]);
        });
      });
    });
  });

  it('ignores a non-Travis yaml file', (done) => {
    const goodFile = path.join(__dirname, 'fixtures', 'not_travis.yml');
    return atom.workspace.open(goodFile).then(editor =>
      lint(editor).then(messages => {
      }, (reason) => {
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
