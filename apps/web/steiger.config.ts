// @ts-nocheck
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: [
      'src/app/**',
      'src/components/**',
      'src/constants/**',
      'src/contexts/**',
      'src/hooks/**',
      'src/lib/**',
      'src/services/**',
      'src/test/**',
      'src/types/**',
      'src/validators/**',
      'src/middleware.ts',
      'src/middleware.test.ts',
    ],
  },
  {
    // The app/ layer (Next.js pages) references all slices but is excluded from
    // the Steiger scan since it doesn't follow FSD segment conventions. This
    // causes false-positive "insignificant slice" warnings for everything it
    // imports, so the rule is disabled.
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
]);
