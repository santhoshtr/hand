import eslint from 'mocha-eslint'

// Run the eslint tests
eslint([
  'src/**/*.js',
  'ui/**/*.js',
  'test/**/*.js'
])
