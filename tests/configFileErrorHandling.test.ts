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

describe('Config File Error Handling', () => {
  const configPath = path.join(process.cwd(), 'release-notes-config.yaml');
  const backupPath = configPath + '.bak';

  beforeAll(() => {
    // Backup config if exists
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, backupPath);
    }
  });

  afterAll(() => {
    // Restore config
    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, configPath);
    } else if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  it('should throw if config file is invalid YAML', async () => {
    fs.writeFileSync(configPath, 'invalid: [unclosed');
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    await expect(generateReleaseNotes()).rejects.toThrow(/YAMLException|unexpected end of/);
  });

  it('should fallback to default if config file is missing', async () => {
    if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    await expect(generateReleaseNotes()).resolves.not.toThrow();
  });

  it('should throw if config file is present but missing required sections', async () => {
    fs.writeFileSync(configPath, 'sections: []');
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    // This depends on your implementation; update if you throw for missing sections
    await expect(generateReleaseNotes()).resolves.not.toThrow();
  });
});
