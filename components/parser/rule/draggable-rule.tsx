import React, { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { areEqual, VariableSizeList as List } from 'react-window';

import VirtualizedRule from '../rule/virtualized-rule';
import { getDraggableStyle } from '../utils';
import { DraggableRuleProps } from '../types';

const DraggableRule = memo(
  ({ data: rules, index, style, resize, isCollapsed }: DraggableRuleProps) => {
    const rule = rules[index];

    return (
      <Draggable
        draggableId={rule.id}
        index={index}
        key={rule.id}
        isDragDisabled={!isCollapsed}
      >
        {(provided, snapshot) => (
          <VirtualizedRule
            displayContext="display"
            id={rule.id}
            index={index}
            provided={provided}
            recomputeRuleSize={resize}
            ref={provided.innerRef}
            rule={rule}
            style={getDraggableStyle({
              index,
              provided,
              style,
              isDragging: snapshot.isDragging
            })}
          />
        )}
      </Draggable>
    );
  },
  areEqual
);

export default DraggableRule;
