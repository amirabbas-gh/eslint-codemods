module.exports = {
  meta: {
    docs: {},
    schema: []
  },
 
    create(context) {
        // Chained off context.getFilename() — needs parens around the ?? expression.
        if ((context.filename ?? context.getFilename()).endsWith(".ts")) {
            return;
        }

        // Chained off context.getCwd()
        const dir = (context.cwd ?? context.getCwd()).replace("/home", "~");

        // NOT chained — no parens needed.
        const filename = context.filename ?? context.getFilename();

        return {
            Program(node) {
                context.report({ node, message: "test" });
            },
        };
    }
};
