'use babel';

export default {
  config: {
    travisExecutablePath: {
      title: 'Travis Lint Executable Path',
      type: 'string',
      description: 'Path to Travis executable (e.g. /usr/local/bin/travis) if not in shell env path.',
      default: 'travis',
    }
  },

  provideLinter() {
    return {
      name: 'Travis-Lint',
      // if language-ansible is installed, then .yml are marked as ansible
      grammarScopes: ['source.yaml', 'source.ansible'],
      scope: 'file',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const file = activeEditor.getPath();

        // bail out if this is not a travis ci config
        if (!(/\.travis\.yml/.exec(file)))
          return [];

        // regexps for matching on output
        const regex_travis = /\[x\] (.*)/;
        const regex_yaml = /\[x\] (.*) at line (\d+) column (\d+)/;

        return helpers.exec(atom.config.get('linter-travis-lint.travisExecutablePath'), ['lint'], {cwd: require('path').dirname(file)}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            // matchers for output parsing and capturing
            const matches_travis = regex_travis.exec(line);
            const matches_yaml = regex_yaml.exec(line);

            // check for yaml errors in current file; this has to happen first since this regexp is a subset of the travis error regexp
            if (matches_yaml != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_yaml[1],
                location: {
                  file: file,
                  position: [[Number.parseInt(matches_yaml[2]) - 1, Number.parseInt(matches_yaml[3]) - 1], [Number.parseInt(matches_yaml[2]) - 1, Number.parseInt(matches_yaml[3])]],
                },
              });
            }
            // check for travis errors in current file
            else if (matches_travis != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_travis[1],
                location: {
                  file: file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
