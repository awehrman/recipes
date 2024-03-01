import React, { CSSProperties, memo, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, VariableSizeList as List } from 'react-window';
import styled from 'styled-components';

import useParserRules from 'hooks/use-parser-rules';
import VirtualizedRule from './rule/virtualized-rule';
import {
  DEFAULT_GUTTER_SIZE,
  DEFAULT_ROW_SIZE,
  RULE_BOTTOM_MARGIN
} from './rule/constants';

// NOTE: getting a warning about react-beautiful-dnd not supporting
// nested scroll containers
// i think react window might be putting their fingers in overflow settings
// and that might cause this error

const VirtualizedRules: React.FC = () => {
  const { loading, rules = [], updateRulesOrder } = useParserRules();
  const listRef = useRef<List | null>(null);
  const sizeMap = useRef<{ [index: number]: number }>({});

  // TODO i hate all this naming
  const resize = useCallback((index: number, size: number) => {
    const allMounted = sizeMap?.current && listRef?.current;

    if (allMounted) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      if (listRef.current !== null) {
        listRef.current.resetAfterIndex(index);
      }
    }
  }, []);

  const getSize = (index: number) =>
    sizeMap?.current?.[index] || DEFAULT_ROW_SIZE;

  // TODO i want to throw all of this drag crap into its own hook
  function handleOnDragEnd(item: any) {
    if (!item.destination) return;
    const updatedList = [...rules];
    // re-order list
    const [reorderedItem] = updatedList.splice(item.source.index, 1);
    updatedList.splice(item.destination.index, 0, reorderedItem);
    // TODO this also needs to be called on rule removal
    updateRulesOrder(updatedList);
  }

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
      {renderMessages()}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Wrapper>
          <AutoSizer>
            {({ height, width }) => (
              <Droppable
                droppableId="droppable"
                mode="virtual"
                renderClone={(provided, snapshot, rubric) => (
                  <Item
                    index={rubric.source.index}
                    isDragging={snapshot.isDragging}
                    item={rules[rubric.source.index]}
                    provided={provided}
                    resize={resize}
                    style={getStyle({
                      index: rubric.source.index,
                      provided,
                      style: provided.draggableProps.style,
                      isDragging: snapshot.isDragging
                    })}
                  />
                )}
              >
                {(provided) => (
                  <StyledList
                    ref={listRef}
                    height={height}
                    itemCount={rules.length}
                    itemData={rules}
                    itemSize={getSize}
                    outerRef={provided.innerRef}
                    width={width + DEFAULT_GUTTER_SIZE}
                  >
                    {(props) => <Row {...props} resize={resize} />}
                  </StyledList>
                )}
              </Droppable>
            )}
          </AutoSizer>
        </Wrapper>
      </DragDropContext>
    </RulesContent>
  );
};

function getStyle({ index, provided, style, isDragging }: any) {
  const combined = {
    ...style,
    ...provided.draggableProps.style
  };

  const marginBottom = RULE_BOTTOM_MARGIN;
  const withSpacing = {
    ...combined,
    marginBottom,
    background: isDragging ? 'rgba(248, 248, 248, 1)' : 'white'
  };

  return withSpacing;
}

type ItemProps = {
  index: number;
  isDragging: boolean;
  item: any;
  provided: any;
  resize: (index: number, size: number) => void;
  style: CSSProperties;
};

function Item({ index, isDragging, item, provided, resize, style }: ItemProps) {
  return (
    <VirtualizedRule
      displayContext="display"
      id={item.id}
      index={index}
      provided={provided}
      recomputeRuleSize={resize}
      ref={provided.innerRef}
      rule={item}
      style={getStyle({ index, provided, style, isDragging })}
    />
  );
}

const Row = memo(function Row(props: any) {
  const { data: rules, index, style, resize } = props;
  const item = rules[index];

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided, snapshot) => (
        <Item
          index={index}
          isDragging={snapshot.isDragging}
          item={item}
          provided={provided}
          resize={resize}
          style={style}
        />
      )}
    </Draggable>
  );
}, areEqual);

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

const RulesContent = styled.div`
  height: calc(100vh - 210px);
`;

const Message = styled.div`
  position: relative;
`;

const Loading = styled.div``;
