![Preview](https://raw.githubusercontent.com/mschuchard/linter-travis-lint/master/linter_travis_lint.png)

### Linter-Travis-Lint
Linter-Travis-Lint aims to provide functional and robust `travis lint` linting functionality within Pulsar.

This package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented (especially bug fixes). However, active development on this package has ceased.

### Installation
The `travis` gem is required to be installed before using this. The Atom-IDE-UI and Language-YAML packages are also required. If you have installed the Language-Ansible package, this package is still compatible with its identifying of `.yml` as Ansible files.

All testing is performed with the latest stable version of Pulsar. Any version of Atom or any pre-release version of Pulsar is not supported.

### Usage
- All files named `.travis.yml` will be linted with this linter. Some output may be redundant with YAML linters, such as the syntax checker.
