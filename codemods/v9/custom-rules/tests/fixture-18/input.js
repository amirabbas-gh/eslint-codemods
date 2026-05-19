"use strict";

// Indirectly exported rule: the rule function is defined separately and then
// assigned to module.exports.  The codemod should inline the function and
// wrap it in the { meta, create } object format.
function rule(context) {
    return {
        Program(node) {
            const scope = context.getScope();
            context.report({ node, message: "Violation." });
        },
    };
}

module.exports = rule;
