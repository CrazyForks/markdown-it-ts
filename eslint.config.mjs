import simon from '@antfu/eslint-config'

export default simon(
  {
    ignores: [
      '**/**/*.d.ts',
      // Don't lint Markdown files — they are docs, not source
      '**/*.md',
      'test',
      'benchmark',
      // demo templates use a lot of non-standard code and globals
      'support/demo_template/**',
      'scripts',
      'docs',
    ],
  },
  {
    rules: {
      'no-console': 'off',
      'ts/ban-types': 'off',
      'jsdoc/require-returns-description': 'off',
      'no-new-func': 'off',
      'unicorn/no-new-array': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/check-param-names': 'off',
      'no-cond-assign': 'off',
      'no-eval': 'off',
      'antfu/no-import-dist': 'off',
      'vue/require-toggle-inside-transition': 'off',
    },
    // keep other ignores in sync
    ignores: ['**/fixtures', 'test', 'docs', '**/*.md', 'support/demo_template/**'],
  },
  {},
)
