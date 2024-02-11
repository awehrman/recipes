import React from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import styled from 'styled-components';

import useParserRules from 'hooks/use-parser-rules';
import VirtualizedRule from './rule/virtualized-rule';
import { DEFAULT_GUTTER_SIZE, DEFAULT_ROW_SIZE } from './rule/constants';

// TODO move
type DisplayContext = 'add' | 'edit' | 'display';

const VirtualizedRules: React.FC = () => {
  const { loading, rules = [], updateRulesOrder } = useParserRules();
  const listRef = React.useRef();
  const sizeMap = React.useRef({});

  // TODO i hate all this naming
  const resize = React.useCallback((index: number, size: number) => {
    if (sizeMap?.current && listRef?.current) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      // TODO fix type
      (listRef.current as any).resetAfterIndex(index);
    }
  }, []);

  const getSize = (index: number) => (sizeMap?.current as any)?.[index] || DEFAULT_ROW_SIZE;
  const getListProps = ({ height, width, ref }: any) => ({
    ref,
    height,
    width: width + DEFAULT_GUTTER_SIZE, // add in edit gutter
    itemCount: rules.length,
    itemSize: getSize,
    itemData: rules,
  });

  const getVirtualizedRuleProps = ({ index, style }: any) => ({
    id: rules[index].id,
    displayContext: 'display' as DisplayContext,
    index,
    recomputeRuleSize: resize,
    rule: rules[index],
    style
  });

  // TODO i want to throw all of this drag crap into its own hook
  // function handleOnDragEnd(item: any) {
  //   if (!item.destination) return;
  //   const updatedList = [...rules];
  //   // re-order list
  //   const [reorderedItem] = updatedList.splice(item.source.index, 1);
  //   updatedList.splice(item.destination.index, 0, reorderedItem);
  //   updateRulesOrder(updatedList);
  // }

  function renderMessages() {
    if (loading && !rules.length) {
      return <Loading>Loading rules...</Loading>;
    }

    if (!rules.length && !loading) {
      return <Message>No parsing rules exist.</Message>;
    }
  }

  return (
    <RulesContent>
        {/* <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <DragRef {...provided.droppableProps} ref={provided.innerRef}> */}
                {renderMessages()}
                <AutoSizer>
                  {({ height, width }) => (
                    <StyledList {...getListProps({ height, width, ref: listRef })} >
                      {({ index, style }) => (
                        <VirtualizedRule {...getVirtualizedRuleProps({ index, style })} />
                      )}
                    </StyledList>)
                  }
                </AutoSizer>
                {/* {provided.placeholder}
              </DragRef>
            )}
          </Droppable>
        </DragDropContext> */}
      </RulesContent>
  );
};

export default VirtualizedRules;

const StyledList = styled(List)`
  position: absolute;
  left: -${DEFAULT_GUTTER_SIZE}px;
`;

const DragRef = styled.div`
  height: 100%;
`;

const RulesContent = styled.div`
  height: calc(100vh - 210px);
`;

const Message = styled.div`
  position: relative;
`;

const Loading = styled.div`
`;
