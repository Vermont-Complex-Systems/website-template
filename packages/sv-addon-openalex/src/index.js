import { defineAddon, defineAddonOptions } from 'sv/core';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read templates from files (testable, lintable)
const POPULATE_SCRIPT = readFileSync(join(__dirname, 'templates/populate-openalex-db.js'), 'utf8');
const SCHEMA_ADDITION = readFileSync(join(__dirname, 'templates/schema-addition.ts'), 'utf8');

const SCHEMA_IMPORTS = `import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
`;

const options = defineAddonOptions()
  .add('email', {
    question: 'Contact email for OpenAlex API (polite pool):',
    type: 'string'
  })
  .build();

export default defineAddon({
  id: '@vcsi/openalex',
  options,

  setup: ({ dependsOn }) => {
    dependsOn('drizzle');
  },

  run: ({ sv, options: opts }) => {
    // Create the populate script with user's email
    const populateScript = POPULATE_SCRIPT.replace(/__CONTACT_EMAIL__/g, opts.email || 'your-email@example.com');
    sv.file('scripts/populate-openalex-db.js', () => populateScript);

    // Append OpenAlex tables to existing schema
    sv.file('src/lib/server/db/schema.ts', (content) => {
      // Check if already has OpenAlex tables
      if (content && content.includes('openalex_authors')) {
        return content;
      }

      // If file exists, check if it has the imports we need
      if (content) {
        if (!content.includes('real')) {
          // Add real to imports - insert before closing brace
          content = content.replace(
            /\}\s*from\s*['"]drizzle-orm\/sqlite-core['"]/,
            ", real } from 'drizzle-orm/sqlite-core'"
          );
        }
        return content + '\n' + SCHEMA_ADDITION;
      }

      // File doesn't exist - create with imports
      return SCHEMA_IMPORTS + '\n' + SCHEMA_ADDITION;
    });

    // Add npm script and d3-dsv dependency
    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['db:populate-openalex'] = 'node scripts/populate-openalex-db.js';

      // Add d3-dsv for CSV parsing
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['d3-dsv'] = '^3.0.0';

      return JSON.stringify(pkg, null, 2);
    });

    console.log('\n  OpenAlex integration added!');
    console.log('  1. Ensure drizzle is set up with better-sqlite3');
    console.log('  2. Add openAlexId column to your members.csv');
    console.log('  3. Run: npm run db:push (to create tables)');
    console.log('  4. Run: npm run db:populate-openalex');
  }
});
