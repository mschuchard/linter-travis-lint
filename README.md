![Preview](https://raw.githubusercontent.com/mschuchard/linter-travis-lint/master/linter_travis_lint.png)

### Linter-Travis-Lint
[![Build Status](https://travis-ci.org/mschuchard/linter-travis-lint.svg?branch=master)](https://travis-ci.org/mschuchard/linter-travis-lint)

`Linter-Travis-Lint` aims to provide functional and robust `travis lint` linting functionality within Atom.

### Installation
The `travis` gem is required to be installed before using this. The `Linter` and `Language-YAML` Atom packages are also required. If you have installed the `Language-Ansible` package, this package is still compatible with its identifying of `.yml` as Ansible files.

### Usage
- All files named `.travis.yml` will be linted with this linter. Some output may be redundant with YAML linters, such as the syntax checker.
