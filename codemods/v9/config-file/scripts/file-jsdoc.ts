import { type Edit, type SgNode, type SgRoot } from "codemod:ast-grep";
import type JS from "codemod:ast-grep/langs/javascript";
import { acquireLock, getState, setState } from "codemod:workflow";

export default async function transform(root: SgRoot<JS>): Promise<string | null> {
  const rootNode = root.root();
  const edits: Edit[] = [];

  const fileJsdocs: SgNode<JS>[] = rootNode.findAll({
    rule: {
      kind: "comment",
      any: [
        {
          kind: "comment",
          regex: String.raw`^/\*\s*eslint\s+["']?require-jsdoc["']?\s*:\s*(?:\[[^\]]*\]|["'](?:error|warn)["'])\s*\*/`,
        },
        {
          kind: "comment",
          regex: String.raw`^/\*\s*eslint\s+["']?valid-jsdoc["']?\s*:\s*(?:\[[^\]]*\]|["'](?:error|warn)["'])\s*\*/`,
        },
      ],
    },
  });

  let doesJsDocCommentExist = false;

  for (let fileJsdoc of fileJsdocs) {
    doesJsDocCommentExist = true;
    edits.push(fileJsdoc.replace(""));
  }

  const release = acquireLock("doesJsDocCommentExist");
  try {
    const prev = getState<boolean>("doesJsDocCommentExist") ?? false;
    setState("doesJsDocCommentExist", prev || doesJsDocCommentExist);
  } finally {
    release();
  }

  let newSource = rootNode.commitEdits(edits);

  // if not changes return null
  if (newSource === rootNode.text()) {
    return null;
  }
  return newSource;
}
