![Preview](https://raw.githubusercontent.com/mschuchard/linter-travis-lint/master/linter_travis_lint.png)

### Linter-Travis-Lint
[![Build Status](https://travis-ci.com/mschuchard/linter-travis-lint.svg?branch=master)](https://travis-ci.com/mschuchard/linter-travis-lint)

`Linter-Travis-Lint` aims to provide functional and robust `travis lint` linting functionality within Atom.

**Maintenance Mode**

This package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented. However, active development on this package has ceased.

### Installation
The `travis` gem is required to be installed before using this. The `Linter` and `Language-YAML` Atom packages are also required. If you have installed the `Language-Ansible` package, this package is still compatible with its identifying of `.yml` as Ansible files.

### Usage
- All files named `.travis.yml` will be linted with this linter. Some output may be redundant with YAML linters, such as the syntax checker.
