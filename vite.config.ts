import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      include: ['src/**/*.ts']
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts']
        }
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/**/*.e2e.ts'],
          environment: 'prisma'
        }
      }
    ]
  }
});
