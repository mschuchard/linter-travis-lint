'use babel';

export default {
  config: {
    travisExecutablePath: {
      title: 'Travis Lint Executable Path',
      type: 'string',
      description: 'Path to Travis executable (e.g. /usr/local/bin/travis) if not in shell env path.',
      default: 'travis',
    },
    apiEndpoint: {
      title: 'API Endpoint',
      type: 'string',
      description: 'Travis API server to talk to.',
      default: '',
    },
    accessToken: {
      title: 'Access Token',
      type: 'string',
      description: 'Access Token to use.',
      default: '',
    },
  },

  deactivate() {
    this.idleCallbacks.forEach((callbackID) => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Travis-Lint',
      // if language-ansible is installed, then .yml are marked as ansible
      grammarScopes: ['source.yaml', 'source.ansible'],
      scope: 'file',
      lintsOnChange: false,
      lint: async (textEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const file = textEditor.getPath();
        const content = textEditor.getText();

        // bail out if this is not a travis ci config
        if (!(/\.travis\.yml/.exec(file)))
          return [];

        let args = ['lint', '--no-interactive', '--skip-version-check', '--skip-completion-check'];

        if (atom.config.get('linter-travis-lint.apiEndpoint') !== '')
          args.push(...['-e', atom.config.get('linter-travis-lint.apiEndpoint')]);

        if (atom.config.get('linter-travis-lint.accessToken') !== '')
          args.push(...['-t', atom.config.get('linter-travis-lint.accessToken')]);

        // initialize return outside of scope
        let toReturn = [];

        return helpers.exec(atom.config.get('linter-travis-lint.travisExecutablePath'), args, { stdin: content }).then(output => {
          output.split(/\r?\n/).forEach((line) => {
            // matcher for output parsing and capturing
            const matchesTravis = /\[x\] \[(\w+)\] (.*)/.exec(line);

            // check for travis errors in current file
            if (matchesTravis != null) {
              toReturn.push({
                severity: matchesTravis[1] === 'error' ? 'error' : 'warning',
                excerpt: matchesTravis[2],
                location: {
                  file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        })
        .catch(error => {
          // check for yaml syntax in stderr
          const matchesYaml = /STDIN is not valid YAML: (.*) at line (\d+) column (\d+)/.exec(error);

          if (matchesYaml != null) {
            toReturn.push({
              severity: 'error',
              excerpt: matchesYaml[1],
              location: {
                file: file,
                position: [[Number.parseInt(matchesYaml[2]) - 1, Number.parseInt(matchesYaml[3]) - 1], [Number.parseInt(matchesYaml[2]) - 1, Number.parseInt(matchesYaml[3])]],
              },
            });
          }
          // notify on other errors
          else {
            atom.notifications.addError(
              'An error occurred with the package linter-travis.',
              { detail: error.message }
            );
          }
          return toReturn;
        });
      }
    };
  }
};
