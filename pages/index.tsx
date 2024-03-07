import { gql, useQuery } from '@apollo/client';
import React from 'react';

import Page from '../components/page';

const GET_ALL_USERS_QUERY = gql`
  query GET_ALL_USERS_QUERY {
    users {
      id
      email
      role
    }
  }
`;

const Dashboard: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS_QUERY);
  return <Page title="Dashboard">There&apos;s nothing here yet!</Page>;
};

export default Dashboard;
