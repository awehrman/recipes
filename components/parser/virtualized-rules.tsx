import React, { useEffect } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import styled from 'styled-components';

import useParserRules from 'hooks/use-parser-rules';
import VirtualizedRule from './rule/virtualized-rule';
import { DEFAULT_GUTTER_SIZE, DEFAULT_ROW_SIZE } from './rule/constants';

// TODO move
type DisplayContext = 'add' | 'edit' | 'display';
type ListProps = {
  height: number;
  width: number;
  ref: React.MutableRefObject<List | null>;
};
type VirtualizedRuleProps = {
  index: number;
  style: React.CSSProperties;
};

const VirtualizedRules: React.FC = () => {
  const { loading, rules = [], updateRulesOrder } = useParserRules();
  const listRef = React.useRef<List | null>(null);
  const sizeMap = React.useRef<{ [index: number]: number }>({});

  // TODO i hate all this naming
  const resize = React.useCallback(
    (index: number, size: number, force: boolean = false) => {
      const allMounted = sizeMap?.current && listRef?.current;

      if (allMounted) {
        sizeMap.current = { ...sizeMap.current, [index]: size };
        if (listRef.current !== null) {
          listRef.current.resetAfterIndex(index);
        }
      }
    },
    [loading]
  );

  const getSize = (index: number) =>
    sizeMap?.current?.[index] || DEFAULT_ROW_SIZE;

  const getListProps = ({ height, width, ref }: ListProps) => ({
    ref,
    height,
    width: width + DEFAULT_GUTTER_SIZE,
    itemCount: rules.length,
    itemSize: getSize,
    itemData: rules
  });

  const getVirtualizedRuleProps = ({ index, style }: VirtualizedRuleProps) => ({
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

  if (loading) {
    return null;
  }

  return (
    <RulesContent>
      {/* <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <DragRef {...provided.droppableProps} ref={provided.innerRef}> */}
      {renderMessages()}
      <Wrapper>
        <AutoSizer>
          {({ height, width }) => (
            <StyledList {...getListProps({ height, width, ref: listRef })}>
              {({ index, style }) => (
                <VirtualizedRule
                  {...getVirtualizedRuleProps({ index, style })}
                />
              )}
            </StyledList>
          )}
        </AutoSizer>
      </Wrapper>
      {/* {provided.placeholder}
              </DragRef>
            )}
          </Droppable>
        </DragDropContext> */}
    </RulesContent>
  );
};

export default VirtualizedRules;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
`;

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

const Loading = styled.div``;
