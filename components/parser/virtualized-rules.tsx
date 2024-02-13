import React from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import styled from 'styled-components';

import useParserRules from 'hooks/use-parser-rules';
import VirtualizedRule from './rule/virtualized-rule';
import {
  DEFAULT_GUTTER_SIZE,
  DEFAULT_ROW_SIZE,
  RULE_BOTTOM_MARGIN
} from './rule/constants';

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
  const resize = React.useCallback((index: number, size: number) => {
    if (sizeMap?.current && listRef?.current) {
      const borderSize = 8; // index === 0 || index === rules.length - 1 ? 4 : 8;
      const height = size + borderSize; // + RULE_BOTTOM_MARGIN;
      console.log({
        index,
        height,
        current: sizeMap.current?.[index],
        willSave: !sizeMap.current?.[index] || height > sizeMap.current?.[index]
      });
      if (!sizeMap.current?.[index] || height > sizeMap.current?.[index]) {
        if (index === 1) {
          // TODO should we add in borders and bottom margins here?
          console.log(index, size, height, {
            current: sizeMap.current?.[index],
            height
          });
          // debugger;
        }
        sizeMap.current = { ...sizeMap.current, [index]: height };
        listRef.current.resetAfterIndex(index);
      }
    }
  }, []);

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

  // const getVirtualizedRuleProps = ({ index, style }: VirtualizedRuleProps) => ({
  //   id: rules[index].id,
  //   displayContext: 'display' as DisplayContext,
  //   index,
  //   recomputeRuleSize: resize,
  //   rule: rules[index],
  //   style
  // });

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
      <Wrapper>
        <AutoSizer>
          {({ height, width }) => (
            <StyledList
              // {...getListProps({ height, width, ref: listRef })
              ref={listRef}
              height={height}
              width={width + DEFAULT_GUTTER_SIZE}
              itemCount={rules.length}
              itemSize={getSize}
              itemData={rules}
            >
              {({ index, style }) => (
                <VirtualizedRule
                  // {...getVirtualizedRuleProps({ index, style })}
                  id={rules[index].id}
                  displayContext={'display' as DisplayContext}
                  index={index}
                  recomputeRuleSize={resize}
                  rule={rules[index]}
                  style={style}
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
  background: orange;
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
  background: purple;
  // min-height: 500px;
`;

const Message = styled.div`
  position: relative;
`;

const Loading = styled.div``;
