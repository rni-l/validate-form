import 'es6-promise/auto'

const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
