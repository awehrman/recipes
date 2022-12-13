import React from 'react';
import { useRouter, NextRouter } from 'next/router';

import Page from '../../components/page';

const Ingredients: React.FC = () => {
  const router: NextRouter = useRouter();
  const {
    query: { group = 'name', view = 'all' }
  } = router;
  const context = { group: `${group}`, view: `${view}` };

  return (
    <Page title="Ingredients">
      {/* <ViewContext.Provider value={context}>
        <Filters />
        <Containers />
        <AddNew />
      </ViewContext.Provider> */}
    </Page>
  );
};

export default Ingredients;
