# Development Guide: Automated Release Notes Action

This document provides guidelines for contributing to and developing the Automated Release Notes GitHub Action.

## Directory Structure

- `src/` — Main source code for the action
- `tests/` — Test files (Jest + TypeScript)
- `docs/` — Documentation
- `releases/` — Release artifacts
- `.github/workflows/` — GitHub Actions workflow files


## Development Workflow

1. Clone the repository and install dependencies:
    npm install
2. Write code in `src/` and tests in `tests/`
3. Run tests:
    npm test
4. Document new features or changes in `docs/`
5. Submit pull requests with clear descriptions




## Current Status & Coverage

- Core logic for generating release notes is fully implemented and tested.
- Authenticates with GitHub using a token and fetches:
  - Merged pull requests since last release
  - Closed issues since last release
  - Commits since last release
- Formats results into Markdown sections and outputs to console and file (`output/release-notes.md`).
- Posts release notes to the latest GitHub Release, or creates a new release/tag if none exists.
- Supports customizable sections and formatting via human-readable YAML config (`release-notes-config.yaml`).
- Robust error handling for:
  - Missing or invalid environment variables (`GITHUB_TOKEN`, `GITHUB_REPOSITORY`)
  - Invalid or missing config file
  - Output file write errors
  - API authentication failures
- Edge case tests for all major failure modes (see `tests/` and `docs/TESTING.md`).
- CI integration and high test coverage confirmed.

## Documentation

- See `docs/GOALS.md` for project objectives and roadmap
- See `docs/TESTING.md` for test strategy and coverage
- See `docs/USAGE_SCENARIOS.md` for setup, config, and error handling examples

## Progress vs. Goals

- [x] Automated fetching and formatting of release notes
- [x] Console and file output of Markdown-formatted release notes
- [x] Posting release notes to GitHub Releases (update latest or create new)
- [x] Customizable sections and formatting via YAML config
- [x] Full documentation and usage examples
- [x] High test coverage and CI integration

## Coding Standards

- Use TypeScript for all source and test files
- Follow best practices for modularity and readability
- Write tests for all new features and bug fixes

## Useful Commands

- `npm install` — Install dependencies
- `npm test` — Run all tests

## Contributing

See `CONTRIBUTING.md` for more details on submitting issues and pull requests.

## Coding Standards

- Use TypeScript for all source and test files
- Follow best practices for modularity and readability
- Write tests for all new features and bug fixes

## Useful Commands

- `npm install` — Install dependencies
- `npm test` — Run all tests

## Contributing

See `CONTRIBUTING.md` for more details on submitting issues and pull requests.
