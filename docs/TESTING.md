# Testing Automated Release Notes Action

This document describes the testing strategy and test cases for the Automated Release Notes GitHub Action.

## Test Structure

- **releaseNotes.test.ts**: Core logic for generating release notes
- **githubApi.test.ts**: Interactions with the GitHub API (fetching PRs, issues, commits)
- **markdownFormat.test.ts**: Markdown formatting for release notes sections
- **errorHandling.test.ts**: Environment variable and API error handling
- **configFileErrorHandling.test.ts**: Config file errors (missing, invalid YAML)
- **outputFileErrorHandling.test.ts**: Output file write errors (permission denied)

## Running Tests

To run all tests:

    npm test

## Adding Tests

- Place new test files in the `tests/` directory
- Use Jest and TypeScript for all tests
- Mock GitHub API responses for integration tests

## Example Test Case

```typescript
describe('Error Handling', () => {
  it('should throw if GITHUB_TOKEN is missing', async () => {
    process.env.GITHUB_TOKEN = '';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_TOKEN environment variable is required');
  });
  // ...other edge cases...
});
```




## Coverage


- [x] Fetching merged PRs, closed issues, and commit messages (tested)
- [x] Formatting output into Markdown sections (tested)
- [x] Posting release notes to GitHub Releases page (tested)
- [x] Saving release notes to file (`output/release-notes.md`) (tested)
- [x] Customizable sections and formatting via YAML config (`release-notes-config.yaml`) (tested)
- [x] Error handling for missing/invalid environment variables (tested)
- [x] Error handling for invalid/missing config file (tested)
- [x] Error handling for output file write errors (tested)
- [x] Error handling for API authentication failures (tested)

All tests pass and coverage is high. See individual test files for details.
