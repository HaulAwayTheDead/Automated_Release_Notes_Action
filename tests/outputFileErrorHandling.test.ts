jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      repos: {
        getLatestRelease: jest.fn().mockResolvedValue({ data: { published_at: '2025-01-01T00:00:00Z', id: 1, tag_name: 'v1.0.0' } }),
        updateRelease: jest.fn().mockResolvedValue({}),
        createRelease: jest.fn().mockResolvedValue({ data: { tag_name: 'v1.0.1' } }),
        listCommits: jest.fn().mockResolvedValue({ data: [{ sha: 'abc123', commit: { message: 'Test commit' } }] }),
      },
      pulls: {
        list: jest.fn().mockResolvedValue({ data: [] }),
      },
      issues: {
        listForRepo: jest.fn().mockResolvedValue({ data: [] }),
      },
    })),
  };
});
import * as fs from 'fs';
import * as path from 'path';
import { generateReleaseNotes } from '../src/releaseNotes';

describe('Output File Error Handling', () => {
  const outputPath = path.join(process.cwd(), 'output', 'release-notes.md');
  const outputDir = path.dirname(outputPath);
  const backupPath = outputPath + '.bak';

  beforeAll(() => {
    // Backup output file if exists
    if (fs.existsSync(outputPath)) {
      fs.copyFileSync(outputPath, backupPath);
    }
    // Make output directory read-only
    if (fs.existsSync(outputDir)) {
      fs.chmodSync(outputDir, 0o444);
    }
  });

  afterAll(() => {
    // Restore output file
    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, outputPath);
    }
    // Restore output directory permissions
    if (fs.existsSync(outputDir)) {
      fs.chmodSync(outputDir, 0o755);
    }
  });

  it('should throw if output file cannot be written (permission error)', async () => {
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    const fs = require('fs');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      const err = new Error('EACCES: permission denied, write');
      (err as any).code = 'EACCES';
      throw err;
    });
    await expect(generateReleaseNotes()).rejects.toThrow(/EACCES|permission denied/i);
    fs.writeFileSync.mockRestore();
  });
});
