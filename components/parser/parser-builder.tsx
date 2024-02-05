import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useParserContext } from 'contexts/parser-context';
import useParserRules from 'hooks/use-parser-rules';
import PlusIcon from 'public/icons/plus.svg';

import Rule from './rule';
import AddRule from './add-rule';

const ParserBuilder: React.FC = () => {
  const {
    state: { isAddButtonDisplayed, isCollapsed },
    dispatch
  } = useParserContext();

  const { loading, rules = [], updateRulesOrder } = useParserRules();
    const listRef = React.useRef();
  const sizeMap = React.useRef({});
  const setSize = React.useCallback((index: number, size: number) => {
    console.log('setting size!', index, size)
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

  const DEFAULT_ROW_SIZE = 81; // TODO move
  // TODO move and dry 
  function getRuleHeight(element: HTMLDivElement | null): number {
    if (!element) {
      return 0;
    }
    return element.getBoundingClientRect()?.height ?? 0;
  }

  // TODO fix type
  const Row = ({ index, setSize }: any) => {
    const rowRef = React.useRef<HTMLDivElement>(null);
  
    // TODO fuck sending just setSize, we need this whole ass function including the height lookup
    // that way i don't have to build it up from the formatter
    // the formatter component should just holla at every render
    const recomputeRuleHeight = React.useCallback(() => {
      console.log('recomputeRuleHeight');
      const height = getRuleHeight(rowRef.current);
      setSize(index, height + 8);
    }, [rowRef, setSize, index]);
  
    return (
      <div ref={rowRef}>
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
       <Rule key={rules[index].id} index={index} id={rules[index].id} setSize={recomputeRuleHeight} />
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
                        <div style={style}>
                          <Row
                            data={data}
                            index={index}
                            setSize={setSize}
                            windowWidth={width}
                          />
                        </div>
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

const DragRef = styled.div`
  height: 100%;
`;

const RulesContent = styled.div`
  background: yellow;
  height: calc(100vh - 220px);
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

const Loading = styled.div``;
