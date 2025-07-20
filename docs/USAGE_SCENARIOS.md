# Usage Scenarios for Automated Release Notes Action

## 1. Default Usage
Automatically generates release notes from merged PRs, closed issues, and commits since the last release/tag. No config required.

## 2. Custom Sections via YAML
Define your own sections, headers, and order in `release-notes-config.yaml`:
```yaml

## 5. Error Handling & Edge Cases
- If config is missing or invalid, defaults are used.
- API errors are logged to the console.
- Missing or invalid token/repo variables will halt execution with a clear error message.
- Output file write errors (e.g., permission denied) are caught and reported.
- All major error cases are covered by automated tests (see `docs/TESTING.md`).

### Example: Missing Environment Variable
```powershell
npx ts-node src/index.ts
```


### Example: Invalid Config File
```powershell
## 4. Workflow Input Override
Override config sections via workflow input (future feature):
```yaml
with:

### Example: Output File Permission Error
```powershell
  sections: '[{"section":"features","header":"🚀 Features","type":"pr"}]'
```

## 6. Running Tests & Interpreting Results
Run all tests to verify error handling and core features:
```powershell

## 5. Error Handling
All tests should pass. See `docs/TESTING.md` for coverage details.

## 7. Example Output
```
## 🚀 Features
- Add user authentication (#42)

## 🐛 Fixes
- Fix login redirect issue (#48)

## 📦 Commits
- Update README.md (9af1781)
```
- If config is missing or invalid, defaults are used.
- API errors are logged to the console.
- Missing token or repo variables will halt execution.

## 6. Example Output
```
## 🚀 Features
- Add user authentication (#42)

## 🐛 Fixes
- Fix login redirect issue (#48)

## 📦 Commits
- Update README.md (9af1781)
```


## 7. Advanced Customization
- Add comments in YAML for documentation.
- Reorder or add new sections (e.g., Documentation, Refactoring).
- Change headers to match your team's style.

## 8. Multi-Project Monorepo Support
If your repository contains multiple projects, you can run the release notes generator for each subproject by specifying the repository and config file per run.

## 9. Output to Custom File Location
Set the `output_file` input or environment variable to save release notes to a custom path:
```yaml
with:
  output_file: 'docs/releases/latest.md'
```

## 10. Integration with CI/CD Pipelines
Use the generated release notes as part of your deployment or release pipeline, uploading them as artifacts or including them in release emails.

## 11. Filtering by Labels or Milestones
Extend the config to filter PRs/issues by label or milestone for more targeted release notes (future feature):
```yaml
sections:
  - section: features
    header: "🚀 Features"
    type: pr
    labels: ["feature", "enhancement"]
```

## 12. Localization and Custom Language
Change section headers and comments to any language to match your team's needs:
```yaml
sections:
  - section: features
    header: "Nouveautés"
    type: pr
    comment: "Pull requests fusionnés depuis la dernière version"
```

## 13. Minimalist Output
Configure the tool to only show commit messages, or only PRs, for a concise changelog:
```yaml
sections:
  - section: commits
    header: "Commits"
    type: commit
```

## 14. Release Notes for Private/Internal Projects
Works with private repositories as long as the GitHub token has the correct permissions.

## 15. Scheduled Automated Release Notes
Set up a scheduled workflow to generate release notes at regular intervals (e.g., weekly):
```yaml
on:
  schedule:
    - cron: '0 0 * * 0' # Every Sunday at midnight
```
