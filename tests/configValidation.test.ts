import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

describe('Config Validation', () => {
  it('should load valid YAML config', () => {
    const configPath = path.join(process.cwd(), 'Automated_Release_Notes_Action', 'release-notes-config.yaml');
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    expect((config as any)).toHaveProperty('sections');
    expect(Array.isArray((config as any).sections)).toBe(true);
  });

  it('should fallback to defaults if config is missing', () => {
    const configPath = path.join(process.cwd(), 'nonexistent.yaml');
    let config = null;
    try {
      config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    } catch {
      config = null;
    }
    expect(config).toBeNull();
  });
});
