
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

import { generateReleaseNotes } from '../src/releaseNotes';

describe('Error Handling', () => {
  it('should throw if GITHUB_TOKEN is missing', async () => {
    process.env.GITHUB_TOKEN = '';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_TOKEN environment variable is required');
  });

  it('should throw if GITHUB_TOKEN is only whitespace', async () => {
    process.env.GITHUB_TOKEN = '   ';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_TOKEN environment variable is required');
  });

  it('should throw if GITHUB_REPOSITORY is missing', async () => {
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = '';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
  });

  it('should throw if GITHUB_REPOSITORY is not in owner/repo format', async () => {
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = 'owner';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
    process.env.GITHUB_REPOSITORY = '/repo';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
    process.env.GITHUB_REPOSITORY = 'owner/';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
  });

  it('should throw if GITHUB_REPOSITORY has empty owner or repo', async () => {
    process.env.GITHUB_TOKEN = 'dummy';
    process.env.GITHUB_REPOSITORY = '/repo';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
    process.env.GITHUB_REPOSITORY = 'owner/';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
    process.env.GITHUB_REPOSITORY = '/';
    await expect(generateReleaseNotes()).rejects.toThrow('GITHUB_REPOSITORY environment variable is required');
  });

  it('should throw if Octokit authentication fails', async () => {
    jest.resetModules();
    jest.doMock('@octokit/rest', () => {
      return {
        Octokit: jest.fn().mockImplementation(() => {
          throw new Error('Bad credentials');
        })
      };
    });
    const { generateReleaseNotes: generateReleaseNotesWithBadAuth } = require('../src/releaseNotes');
    process.env.GITHUB_TOKEN = 'invalid';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    await expect(generateReleaseNotesWithBadAuth()).rejects.toThrow('Bad credentials');
    jest.resetModules();
  });
});
