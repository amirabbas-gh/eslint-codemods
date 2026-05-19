module.exports = {
    create(context) {
        return {
            // Parameterless visitors — getScope/getAncestors/markVariableAsUsed/getDeclaredVariables
            // should have "node" injected into the formal parameters list.
            Program() {
                const scope = context.getScope();
            },

            FunctionDeclaration() {
                const ancestors = context.getAncestors();
            },

            CallExpression() {
                context.markVariableAsUsed("myVar");
                const vars = context.getDeclaredVariables();
            },

            // This visitor already has a param — must not be changed.
            Identifier(node) {
                const scope2 = context.getScope();
            },
        };
    }
};
