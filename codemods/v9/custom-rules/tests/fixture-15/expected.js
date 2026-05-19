module.exports = {
  meta: {
    docs: {},
    schema: []
  },
 
    create(context) {
    const contextSourceCode = context.sourceCode ?? context.getSourceCode();
        return {
            // Parameterless visitors — getScope/getAncestors/markVariableAsUsed/getDeclaredVariables
            // should have "node" injected into the formal parameters list.
            Program(node) {
                const scope = contextSourceCode.getScope(node);
            },

            FunctionDeclaration(node) {
                const ancestors = (contextSourceCode.getAncestors ? contextSourceCode.getAncestors(node) : context.getAncestors());
            },

            CallExpression(node) {
                contextSourceCode.markVariableAsUsed("myVar", node);
                const vars = contextSourceCode.getDeclaredVariables(node);
            },

            // This visitor already has a param — must not be changed.
            Identifier(node) {
                const scope2 = contextSourceCode.getScope(node);
            },
        };
    }
};
