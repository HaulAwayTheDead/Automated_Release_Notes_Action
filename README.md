# Automated Release Notes GitHub Action

Automate the generation of clean, well-structured release notes for every GitHub release. This action fetches merged pull requests, closed issues, and commits since the last release, formats them into Markdown, and posts them to the GitHub Releases page or saves to a file.

## Features
- Automated release notes generation from PRs, issues, and commits
- Customizable sections and formatting via YAML config
- Posts notes to GitHub Releases or outputs to file
- Robust error handling for environment variables, config, output, and API failures
- High test coverage and CI integration

## Quick Start
1. **Install dependencies:**
   ```powershell
   npm install
   ```
2. **Run tests:**
   ```powershell
   npm test
   ```
3. **Set environment variables:**
   ```powershell
   $env:GITHUB_TOKEN="your_token_here"
   $env:GITHUB_REPOSITORY="owner/repo"
   ```
4. **Run the action locally:**
   ```powershell
   npx ts-node src/index.ts
   ```

## Configuration
- Edit `release-notes-config.yaml` to customize sections, headers, and formatting.
- Example:
  ```yaml
  sections:
    - section: features
      header: "🚀 Features"
      type: pr
    - section: fixes
      header: "🐛 Fixes"
      type: issue
    - section: commits
      header: "📦 Commits"
      type: commit
  ```

## Error Handling
- Missing or invalid environment variables will halt execution with a clear error.
- Invalid or missing config file falls back to defaults or throws if unreadable.
- Output file write errors and API authentication failures are caught and reported.
- All major error cases are covered by automated tests.

## Documentation
- [Development Guide](docs/DEVELOPMENT.md)
- [Project Goals](docs/GOALS.md)
- [Testing Strategy](docs/TESTING.md)
- [Usage Scenarios](docs/USAGE_SCENARIOS.md)

## Example Output
```
## 🚀 Features
- Add user authentication (#42)

## 🐛 Fixes
- Fix login redirect issue (#48)

## 📦 Commits
- Update README.md (9af1781)
```

## Contributing
See [DEVELOPMENT.md](docs/DEVELOPMENT.md) and [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
MIT
