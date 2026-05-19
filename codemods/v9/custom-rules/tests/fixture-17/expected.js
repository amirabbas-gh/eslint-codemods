// A TypeScript-ESLint createRule({...}) pattern where the rule config object
// is the first argument (NOT a function).  Before the fix, findCommonJSWrappedCallAssignment
// would incorrectly match this and produce:
//   module.exports = { meta: {...}, create: createRule({...}) }
// After the fix the object is detected by getRuleWithCreateNoMeta and meta is
// inserted into the config object instead.
import { ESLintUtils } from "@typescript-eslint/utils";
const createRule = ESLintUtils.RuleCreator(noDocUrl);

export default createRule({
  meta: {
    docs: {},
    schema: []
  },
 
    create(context) {
        return {
            Program(node) {
                context.report({ node, message: "test" });
            },
        };
    },
});
