import path from 'path';
import {PRIVATE_MARKER} from './constants';
import {
  RuleConstructor,
  RuleFailure,
  RuleMetadata,
  RuleNameAndConstructor,
} from './utils/abstractRule';

export function isParentNode(node: Figma.ParentNode) {
  return !!node.children;
}

export async function lint<T extends Figma.Node>(
  node: T,
  rules: RuleNameAndConstructor[]
): Promise<RuleFailure[]> {
  const allFailures: RuleFailure[] = [];

  // Iterate through all rules and apply it to the given node.
  rules.forEach(async ([ruleName, ctor]) => {
    const metadata: RuleMetadata = {ruleName};
    const r = new ctor(metadata, node);
    // Ignore `@private` nodes
    if (!node.name.includes(PRIVATE_MARKER)) {
      const ruleFailures = await r.apply();
      ruleFailures.forEach(failure => {
        allFailures.push(failure);
      });
    }
  });

  if (isParentNode(node)) {
    (<Figma.ParentNode>node).children.forEach(async child => {
      const childFailures = await lint(child, rules);
      childFailures.forEach(failure => {
        allFailures.push(failure);
      });
    });
  }

  return allFailures;
}
