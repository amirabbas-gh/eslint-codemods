'use strict'

const { wrapRule } = require('../utils')

// The rule function is the first (and only) argument to the wrapper call.
// Unlike fixture-19 where the rule config is the second argument, this
// pattern should be migrated to the { meta, create } object format.
module.exports = wrapRule(function rule(context) {
  return {
    Program(node) {
      context.report({ node, message: "violation" });
    }
  }
})
