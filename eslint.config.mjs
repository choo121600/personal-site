import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import * as mdx from 'eslint-plugin-mdx'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ...mdx.flat,
    files: ['**/*.mdx'],
    rules: {
      // MDX 컴포넌트(예: <Cover />)는 mdx-components.tsx에서 전역 주입된다.
      'react/jsx-no-undef': 'off',
    },
  },
  eslintPluginPrettierRecommended,
]

export default eslintConfig
