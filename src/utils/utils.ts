import path from 'path';
import fs from 'fs';
import * as Figma from 'figma-js';
import {
  AbstractRule,
  RuleConstructor,
  RuleNameAndConstructor,
} from './abstractRule';

export function getAllRules(
  rulesPaths: Array<string>
): Array<RuleNameAndConstructor> {
  const rules: Array<RuleNameAndConstructor> = [];
  rulesPaths.forEach(p => {
    const st = fs.statSync(p);

    if (st.isDirectory) {
      const rulesFiles = fs.readdirSync(p);
      rulesFiles.forEach(file => {
        const f = path.resolve(p, file);
        const rule = (require(f) as { Rule: RuleConstructor }).Rule;
        rules.push([path.parse(file).name, rule]);
      });
    }
  });

  return rules;
}
