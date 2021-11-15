import React from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from 'react-beautiful-dnd'
import { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form'

import { ICollectionForm } from '@collections/types/form.type'

type ActionType = 'remove'

/**
 * These are necessary to work with drag & drop
 */
export type DragDropItemProps = {
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  field: FieldArrayWithId<ICollectionForm, 'elements', 'id'>
  onEvent: (type: ActionType, ...args: string[]) => void
}

type Props<T extends DragDropItemProps = DragDropItemProps> = {
  /**
   * A unique ID around the whole applicaiton
   */
  dragDropId: string
  fieldArray: UseFieldArrayReturn<ICollectionForm, 'elements', 'id'>
  /**
   * This is the child component that will render for each item in fields
   */
  Component: React.FC<T>
  /**
   * Additional props into your component
   */
  componentProps?: Omit<T, keyof DragDropItemProps>
}

/**
 * This component will setup everything you need to have a drag & drop
 * with fieldArrays
 *
 * @param fieldArray
 * @param dragDropId
 * @param Component
 * @param componentProps
 * @constructor
 */
export const FieldArrayDragDropWrapper: React.FC<Props> = ({
  fieldArray,
  dragDropId,
  Component,
  componentProps = {},
}) => {
  /**
   * When dragging is ending we reorganise the items
   * @param updatedItems
   */
  const onDragEnd = (updatedItems: any) => {
    if (!updatedItems.destination) return

    fieldArray.move(updatedItems.source.index, updatedItems.destination.index)
  }

  const handleEvent = (
    itemIndex: number,
    type: ActionType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...args: string[]
  ) => {
    switch (type) {
      case 'remove':
        fieldArray.remove(itemIndex)
        break
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={dragDropId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {fieldArray.fields.map((item, index: number) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(draggableProvider, draggableSnapshot) => (
                  <Component
                    onEvent={(type, ...args) =>
                      handleEvent(index, type, ...args)
                    }
                    field={item}
                    provided={draggableProvider}
                    snapshot={draggableSnapshot}
                    {...componentProps}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
