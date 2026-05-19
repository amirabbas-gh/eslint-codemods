"use strict";

// Indirectly exported rule: the rule function is defined separately and then
// assigned to module.exports.  The codemod should inline the function and
// wrap it in the { meta, create } object format.

module.exports = {
  meta: {
    docs: {},
    schema: []
  },
  create: function rule(context) {
    const contextSourceCode = context.sourceCode ?? context.getSourceCode();
    return {
        Program(node) {
            const scope = contextSourceCode.getScope(node);
            context.report({ node, message: "Violation." });
        },
    };
}
};
