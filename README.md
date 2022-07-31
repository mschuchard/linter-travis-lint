![Preview](https://raw.githubusercontent.com/mschuchard/linter-travis-lint/master/linter_travis_lint.png)

### Linter-Travis-Lint
[![Build Status](https://travis-ci.com/mschuchard/linter-travis-lint.svg?branch=master)](https://travis-ci.com/mschuchard/linter-travis-lint)

`Linter-Travis-Lint` aims to provide functional and robust `travis lint` linting functionality within Atom.

### Atom Editor Sunset Updates

`apm` was discontinued prior to the sunset by the Atom Editor team. Therefore, the installation instructions are now as follows:

- Locate the Atom packages directory on your filesystem (normally at `<home>/.atom/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom packages directory.
- Execute `npm install` in the package directory.

Additionally, this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented. However, active development on this package has ceased.

### Installation
The `travis` gem is required to be installed before using this. The `Linter` and `Language-YAML` Atom packages are also required. If you have installed the `Language-Ansible` package, this package is still compatible with its identifying of `.yml` as Ansible files.

### Usage
- All files named `.travis.yml` will be linted with this linter. Some output may be redundant with YAML linters, such as the syntax checker.
