declare namespace DSLint {
  // Used for tracking `any` type
  type AnyType = any;

  interface LintOptions {
    client: Figma.Client.Client;
    file: Figma.File;
    localStyles: Figma.LocalStyles;
    rules: DSLint.Rules.NameAndConstructor[];
  }

  namespace Rules {
    interface Failure {
      ruleName: string;
      message: string;
      // Optional description used for recommendations, links, etc.
      description?: string;
      // Optional since some rules can be applied at the global level
      node?: AnyType;
      // Optional thumbnail
      thumbnail?: string;
      // Additional rule-specific metadata
      ruleData?: AnyType;
    }
    interface Metadata {
      ruleName: string;
    }

    interface AbstractRule {
      metadata: Metadata;
      getRuleName(): string;
      apply(
        node: Figma.Node,
        file?: Figma.File,
        localStyles?: Figma.LocalStyles
      ): Failure[];
    }

    interface Constructor {
      new (metadata: Metadata): AbstractRule;
    }

    // Tuple hold the name of the rule and it's constructor
    type NameAndConstructor = [string, Constructor];
  }

  interface WalkerOptions {}

  interface Walker {
    node: Figma.Node;
    options: WalkerOptions;
    getNode(): Figma.Node;
    visit(node: Figma.Node): void;
    visitDocument(node: Figma.Nodes.Document): void;
    visitCanvas(node: Figma.Nodes.Canvas): void;
    visitFrame(node: Figma.Nodes.Frame): void;
    visitGroup(node: Figma.Nodes.Group): void;
    visitBooleanOperation(node: Figma.Nodes.BooleanOperation): void;
    visitStar(node: Figma.Nodes.Star): void;
    visitLine(node: Figma.Nodes.Line): void;
    visitEllipse(node: Figma.Nodes.Ellipse): void;
    visitRegularPolygon(node: Figma.Nodes.RegularPolygon): void;
    visitRectangle(node: Figma.Nodes.Rectangle): void;
    visitText(node: Figma.Nodes.Text): void;
    visitSlice(node: Figma.Nodes.Slice): void;
    visitComponent(node: Figma.Nodes.Component): void;
    visitInstance(node: Figma.Nodes.Instance): void;
    walk(node: Figma.Node): void;
    walkChildren(node: Figma.Node & Figma.Mixins.Children): void;
  }

  interface RuleWalkerOptions extends WalkerOptions {
    ruleName: string;
  }

  interface DocumentRuleWalkerOptions extends WalkerOptions {
    rules: DSLint.Rules.AbstractRule[];
    file: Figma.File;
    localStyles: Figma.LocalStyles;
  }

  interface DocumentWalker extends Walker {
    failures: DSLint.Rules.Failure[];
    addFailure(failure: DSLint.Rules.Failure): void;
    getAllFailures(): DSLint.Rules.Failure[];
  }

  interface RuleWalker extends Walker {
    failures: DSLint.Rules.Failure[];
    addFailure(failure: DSLint.Rules.Failure): void;
    getAllFailures(): DSLint.Rules.Failure[];
  }
}

declare module 'dslint' {
  export function dslint(
    fileKey: string,
    personalAccessToken: string,
    // A list of paths to load rules from
    rulesPath: string
  ): Promise<DSLint.Rules.Failure[]>;

  /**
   * Returns the path to the core rules
   */
  export function getCoreRulesPath(): string[];
}
