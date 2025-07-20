

import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export async function generateReleaseNotes() {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken || !githubToken.trim()) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const repoEnv = process.env.GITHUB_REPOSITORY;
  if (!repoEnv || !repoEnv.includes('/') || repoEnv.startsWith('/') || repoEnv.endsWith('/')) {
    throw new Error('GITHUB_REPOSITORY environment variable is required and must be in the format "owner/repo"');
  }
  const [owner, repo] = repoEnv.split('/');
  const octokit = new Octokit({ auth: githubToken });

  // Fetch latest release
  const latestRelease = await octokit.repos.getLatestRelease({ owner, repo }).catch(() => null);
  const since: string | undefined = latestRelease?.data?.published_at || undefined;

  // Fetch merged PRs since last release
  const prs = await octokit.pulls.list({
    owner,
    repo,
    state: 'closed',
    sort: 'updated',
    direction: 'desc',
    per_page: 100
  });
  const mergedPRs = prs.data.filter(pr => pr.merged_at && (!since || pr.merged_at > since));

  // Fetch closed issues since last release
  const issues = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'closed',
    since,
    per_page: 100
  });
  const closedIssues = issues.data.filter(issue => !issue.pull_request && (!since || (issue.closed_at && issue.closed_at > since)));

  // Fetch commits since last release
  const commits = await octokit.repos.listCommits({
    owner,
    repo,
    since,
    per_page: 100
  });

  // Load section config from YAML (fallback to default if not found)
  let sectionConfig: any = null;
  const configPath = path.join(process.cwd(), 'release-notes-config.yaml');
  if (fs.existsSync(configPath)) {
    sectionConfig = yaml.load(fs.readFileSync(configPath, 'utf8'));
  }

  // Default sections if config not found or invalid
  const defaultSections = [
    { section: 'features', header: '🚀 Features', type: 'pr' },
    { section: 'fixes', header: '🐛 Fixes', type: 'issue' },
    { section: 'commits', header: '📦 Commits', type: 'commit' }
  ];
  const sections = sectionConfig?.sections || defaultSections;

  // Format output into Markdown sections based on config
  let markdown = '';
  for (const sec of sections) {
    markdown += `## ${sec.header}\n`;
    if (sec.type === 'pr') {
      mergedPRs.forEach(pr => {
        markdown += `- ${pr.title} (#${pr.number})\n`;
      });
    } else if (sec.type === 'issue') {
      closedIssues.forEach(issue => {
        markdown += `- ${issue.title} (#${issue.number})\n`;
      });
    } else if (sec.type === 'commit') {
      commits.data.forEach(commit => {
        markdown += `- ${commit.commit.message.split('\n')[0]} (${commit.sha.substring(0,7)})\n`;
      });
    }
    markdown += '\n';
  }

  // Output to console
  console.log(markdown);


  // Save to file (output/release-notes.md)
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const outputPath = path.join(outputDir, 'release-notes.md');
  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(`Release notes saved to ${outputPath}`);

  // Post to GitHub Releases
  if (latestRelease && latestRelease.data) {
    // Update the latest release with new release notes
    await octokit.repos.updateRelease({
      owner,
      repo,
      release_id: latestRelease.data.id,
      body: markdown
    });
    console.log(`Release notes posted to latest release: ${latestRelease.data.tag_name}`);
  } else {
    // Create a new release/tag
    const newTag = `auto-release-notes-${Date.now()}`;
    const latestCommit = commits.data[0]?.sha;
    if (!latestCommit) {
      console.error('No commits found to create a new release.');
      return;
    }
    const newRelease = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: newTag,
      target_commitish: latestCommit,
      name: `Automated Release Notes (${newTag})`,
      body: markdown,
      draft: false,
      prerelease: false
    });
    console.log(`New release created: ${newRelease.data.tag_name}`);
  }
}
