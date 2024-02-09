import styled from 'styled-components';

import AddRule from './add-rule';
import RuleActions from './rule-actions';
import VirtualizedRules from './virtualized-rules'; 

const ParserBuilder: React.FC = () => {
  return (
    <Wrapper>
      <RuleActions />
      <AddRule />
      <VirtualizedRules />
    </Wrapper>
  );
};

export default ParserBuilder;

const Wrapper = styled.div`
  font-size: 14px;
  color: #222;
  display: flex;
  flex-direction: column;
`;
