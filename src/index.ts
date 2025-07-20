// Entry point for the Automated Release Notes GitHub Action

import { generateReleaseNotes } from './releaseNotes';

async function run() {
  try {
    await generateReleaseNotes();
  } catch (error) {
    console.error('Error generating release notes:', error);
    process.exit(1);
  }
}

run();
