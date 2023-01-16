import pluralize from 'pluralize';

type Names = {
  name: string;
  plural?: string;
};

export const determinePluralization = (value: string): Names => {
  const isSingular = pluralize.isSingular(value);
  let plural: string | null = isSingular ? null : value;
  const name = isSingular ? value : pluralize.singular(value);
  if (plural === name) {
    plural = null;
  }
  const result: Names = { name };

  if (plural) {
    result.plural = value;
  }

  return result;
};
