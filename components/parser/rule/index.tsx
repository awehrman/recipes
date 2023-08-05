import { ParserRuleWithRelations } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import useClickOutside from 'hooks/use-click-outside';
import RuleContext from 'contexts/rule-context';
import RuleBody from './body';
import RuleHeader from './header';

type RuleComponentProps = {
  rule: ParserRuleWithRelations;
  violations: string[];
};

const Rule: React.FC<RuleComponentProps> = ({ rule, violations }) => {
  const ruleForm = useForm<ParserRuleWithRelations>({ defaultValues: rule });
  const { reset } = ruleForm;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const contextValues = {
    isEditMode,
    setIsEditMode,
    isHovered,
    setIsHovered,
    isExpanded,
    setIsExpanded,
    violations,
    rule,
    ruleForm
  };

  const handleClickOutside = () => {
    // setIsEditMode(false);
    // reset();
  };

  const ruleRef = useClickOutside(handleClickOutside);

  // TODO expand this to support keyboard focus
  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  const containerHeight = useCallback(
    () => `${ruleRef.current?.clientHeight}px`,
    [ruleRef]
  );

  return (
    <RuleContext.Provider value={{ ...contextValues }}>
      <Wrapper
        ref={ruleRef}
        className={isEditMode ? 'edit' : ''}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <RuleHeader containerHeight={containerHeight()} id={rule.id} />
        {isExpanded ? <RuleBody /> : null}
      </Wrapper>
    </RuleContext.Provider>
  );
};

export default Rule;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 600px;
  position: relative;

  &.edit {
    left: -40px;
    padding: 10px 0 10px 40px;
    width: 640px;
    background: ${({ theme }) => theme.colors.lightBlue};
    margin-bottom: 10px;
  }
`;
