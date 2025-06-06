import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['dist', 'generated/prisma']
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettier
);
