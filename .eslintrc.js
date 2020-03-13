module.exports = {
  extends: 'erb/typescript',
  plugins: ['react-hooks'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-shadow': 'off',
    'no-console': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off'
    'no-underscore-dangle': 'off'
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js')
      }
    }
  }
};
