export type TestWrapperProps = {
  isLoading: boolean;
  parsed: boolean;
};

export type TestComponentProps = {
  test: ClientGrammarTestProps;
  loading: boolean;
};

export type ClientGrammarTestProps = {
  reference: string;
  parsed: boolean;
  expected: GrammarExpectedProps[];
  passed?: boolean;
  details?: GrammarDetailsProps;
  error?: {
    message?: string;
  };
};

export type GrammarExpectedProps = {
  type: string;
  value: string;
};

export type GrammarDetailsProps = {
  rule?: string;
  type?: string;
  values?: GrammarDetailsProps[];
};
