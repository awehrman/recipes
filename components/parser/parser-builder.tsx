import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';


import { Button } from 'components/common';
import { useParserContext } from 'contexts/parser-context';
import useParserRules from 'hooks/use-parser-rules';
import EditIcon from 'public/icons/edit.svg';
import PlusIcon from 'public/icons/plus.svg';

import Rule from './rule';
import AddRule from './add-rule';

const DEFAULT_ROW_SIZE = 70; // TODO move

const ParserBuilder: React.FC = () => {
  const {
    state: { focusedRuleIndex, isAddButtonDisplayed, isCollapsed },
    dispatch
  } = useParserContext();

  const { loading, rules = [], updateRulesOrder } = useParserRules();
    const listRef = React.useRef();
  const sizeMap = React.useRef({});

  const resize = React.useCallback((index: number, size: number) => {
    if (sizeMap?.current && listRef?.current) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      listRef.current.resetAfterIndex(index);
    }
  }, []);

  const getSize = (index: number) => sizeMap?.current?.[index] || DEFAULT_ROW_SIZE;
  function handleAddRuleClick() {
    dispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: false });
  }

  function handleCollapseRulesOnClick() {
    dispatch({ type: 'SET_IS_COLLAPSED', payload: !isCollapsed });
  }

  // TODO fix type & move
  const Row = ({ index, dispatch, focusedRuleIndex, style }: any) => {
    // TODO hmm... bleh this gets initialized at the rule level...
    // like.... ugh, i guess i can pull that provider up to this level...
    const displayContext = 'display';
    const rowRef = React.useRef<HTMLDivElement>(null);
    console.log({ index, focusedRuleIndex });
    const isFocusedRule = true; // focusedRuleIndex !== null && index === focusedRuleIndex;
    const showEditButton = displayContext === 'display' && isFocusedRule;

    function handleEditClick() {
      dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'edit' });
    }
    
    return (
      <div ref={rowRef} style={style}>
          {/* <Draggable draggableId={rules[index].id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              <Rule key={rules[index].id} index={index} id={rules[index].id} />
            </div>
          )}
        </Draggable> */}
        <StyledRule>
          <EditWrapper>
            {showEditButton ? (
            <EditRuleButton icon={<EditIcon />} onClick={handleEditClick} />
          ) : null}
          </EditWrapper>
          <RuleWrapper>
            <Rule
              key={rules[index].id}
              index={index}
              id={rules[index].id}
              recomputeRuleSize={resize}
            />
          </RuleWrapper>
        </StyledRule>
      </div>
    );
  };

  function renderRules() {
    if (loading && !rules.length) {
      return <Loading>Loading rules...</Loading>;
    }

    if (!rules.length && !loading) {
      return <Message>No parsing rules exist.</Message>;
    }

    // return rules.map((rule: ParserRuleWithRelations, index: number) => (
    //   <Draggable key={rule.id} draggableId={rule.id} index={index}>
    //     {(provided) => (
    //       <div
    //         ref={provided.innerRef}
    //         {...provided.dragHandleProps}
    //         {...provided.draggableProps}
    //       >
    //         <Rule key={rule.id} index={index} id={rule.id} />
    //       </div>
    //     )}
    //   </Draggable>
    // ));
  }

  // function handleOnDragEnd(item: any) {
  //   if (!item.destination) return;
  //   const updatedList = [...rules];
  //   // re-order list
  //   const [reorderedItem] = updatedList.splice(item.source.index, 1);
  //   updatedList.splice(item.destination.index, 0, reorderedItem);
  //   updateRulesOrder(updatedList);
  // }

  return (
    <Wrapper>
      <RuleActions>
        {!loading && rules.length > 0 && (
          <CollapseRules
            label={!isCollapsed ? 'Collapse Rules' : 'Expand Rules'}
            onClick={handleCollapseRulesOnClick}
          />
        )}
        {isAddButtonDisplayed && (
          <AddRuleButton
            icon={<PlusIcon />}
            label="Add Rule"
            onClick={handleAddRuleClick}
          />
        )}
      </RuleActions>

      <AddRule />
      <RulesContent>
        {/* <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <DragRef {...provided.droppableProps} ref={provided.innerRef}> */}
                {renderRules()}
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      ref={listRef}
                      height={height}
                      width={width}
                      itemCount={rules.length}
                      itemSize={getSize}
                      itemData={rules}
                    >
                      {({ data, index, style }) => (
                        <Row
                          data={data}
                          dispatch={dispatch}
                          index={index}
                          focusedRuleIndex={focusedRuleIndex}
                          windowWidth={width}
                          style={style}
                        />
                      )}
                    </List>)
                  }
                </AutoSizer>
                {/* {provided.placeholder}
              </DragRef>
            )}
          </Droppable>
        </DragDropContext> */}
      </RulesContent>
    </Wrapper>
  );
};

export default ParserBuilder;

const StyledRule = styled.div`
  background: pink;
  display: flex;
  height: 100%;
`;

// TODO we actually want this entire region to display
const EditWrapper = styled.div`
  height: 100%;
  z-index: 100;
`;

const RuleWrapper = styled.div`
  background: orange;
  height: 100%;
  z-index: 90;
  width: 100%;
`;

const DragRef = styled.div`
  height: 100%;
`;

const RulesContent = styled.div`
  height: calc(100vh - 220px);
  position: relative;
  left: -30px;
`;

const RuleActions = styled.div`
  margin-bottom: 8px;
  min-height: 23px;
`;

const AddRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen}};
  padding: 4px 0px;
  font-size: 13px;
  float: left;
  
  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const Message = styled.div`
  position: relative;
  margin-left: 30px;
`;

const Wrapper = styled.div`
  font-size: 14px;
  color: #222;
  display: flex;
  flex-direction: column;
`;

const CollapseRules = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  font-size: 13px;
  color: #666;
  padding: 4px 0px;
  float: right;
  margin-left: 10px;
`;

const Loading = styled.div`
margin-left: 30px;
`;

const EditRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  font-size: 13px;
  // position: absolute;
  // left: -30px;
  // top: -2px;
  // z-index: 1;
  background: transparent;
  border: 2px solid transparent;
  display: flex;
  justify-content: flex-start;
  padding: 3px 5px 7px 7px;

  svg {
    height: 13px;
    width: 13px;
    top: 2px;
    position: relative;
    cursor: pointer;
  }
`;
