import { type Edit, type SgRoot } from "codemod:ast-grep";
import type JS from "codemod:ast-grep/langs/javascript";

export default async function transform(root: SgRoot<JS>): Promise<string> {
  const rootNode = root.root();
  const edits: Edit[] = [];

  const createRule = rootNode.find({
    rule: {
      kind: "statement_block",
      inside: {
        kind: "method_definition",
        has: {
          kind: "formal_parameters",
          has: {
            kind: "identifier",
            regex: "context",
          },
          follows: {
            kind: "property_identifier",
            regex: "create",
          },
        },
      },
    },
  });

  if (createRule) {
    let text = createRule.text();
    let newText = `{
        const sourceCode = context.sourceCode ?? context.getSourceCode();${text.substring(
          1,
          text.length
        )}}`;
    edits.push(createRule.replace(newText));
  }

  let newSource = rootNode.commitEdits(edits);

  return newSource;
}
