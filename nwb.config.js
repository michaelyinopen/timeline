module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Timeline',
      externals: {
        react: 'React'
      }
    }
  }
}
