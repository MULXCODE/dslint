declare namespace DSLint {
  // Used for tracking `any` type
  type AnyType = any;

  namespace Rules {
    interface Failure {
      ruleName: string;
      message: string;
      // Optional since some rules can be applied at the global level
      node?: AnyType;
    }
    interface Metadata {
      ruleName: string;
    }

    interface AbstractRule {
      metadata: Metadata;
      failures: Failure[];
      getRuleName(): string;
      getAllFailures(): Failure[];
      addFailure(failure: Failure): void;
      init(client: Figma.Client.Client, file: Figma.File): void;
      apply(node: Figma.Node, file?: Figma.File): Failure[];
    }

    interface Constructor {
      new (metadata: Metadata): AbstractRule;
    }

    // Tuple hold the name of the rule and it's constructor
    type NameAndConstructor = [string, Constructor];
  }
}
