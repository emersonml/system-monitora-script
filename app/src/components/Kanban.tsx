import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { darken, lighten } from 'polished';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { FiPlus } from 'react-icons/fi';
import styled from 'styled-components';

export type Props<T> = {
    className?: string;
    columns: {
        label: string;
        value: string;
    }[];
    items: T[];
    keyExtractor: (item: T) => string;
    filterItems: (value: string, item: T) => boolean;
    renderItem: (item: T) => ReactNode;
    draggableItem?: (item: T) => boolean;
    onDragEnd(result: DropResult): void;
    kabanType?: string;
    addTask?: (status: string) => void;
    addProjectPlan?: (status: string) => void;
};

export default function Kanban<T>({
    className,
    columns,
    items,
    keyExtractor,
    filterItems,
    renderItem,
    draggableItem,
    onDragEnd,
    kabanType,
    addTask,
    addProjectPlan
}: Props<T>) {
    const router = useRouter();
    function handleDragEnd(dropResult: DropResult) {
        const { source, destination } = dropResult;

        if (!destination || source.droppableId == destination.droppableId) return;

        onDragEnd(dropResult);
    }

    function handleNew(kabanType: string, status: string) {
        if (kabanType === 'project') {
            router.push(`/projects/new?status=${status}`);
        } else if (kabanType === 'planProject') {
            addProjectPlan(status);
        } else if (kabanType === 'plan') {
            router.push(`/plans/new?status=${status}`);
        } else {
            addTask(status);
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <BoardContainer className={className}>
                {columns.map(column => {
                    const filteredItems = items.filter(item => filterItems(column.value, item));

                    return (
                        <Droppable key={column.value} droppableId={column.value}>
                            {(dropProvided, dropSnapshot) => (
                                <ColumnContainer $isDraggingOver={dropSnapshot.isDraggingOver}>
                                    <header>
                                        <strong>{`${column.label} (${filteredItems.length})`}</strong>
                                        <FiPlus size={18} onClick={() => handleNew(kabanType, column.value)} />
                                    </header>

                                    <ul ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                                        {filteredItems.map((item, index) => {
                                            if (draggableItem && !draggableItem(item)) {
                                                return <li key={keyExtractor(item)}>{renderItem(item)}</li>;
                                            }

                                            return (
                                                <Draggable
                                                    key={keyExtractor(item)}
                                                    draggableId={keyExtractor(item)}
                                                    index={index}>
                                                    {(dragProvided, dragSnapshot) => (
                                                        <li
                                                            ref={dragProvided.innerRef}
                                                            {...dragProvided.draggableProps}
                                                            {...dragProvided.dragHandleProps}
                                                            style={
                                                                dragSnapshot.isDragging
                                                                    ? dragProvided.draggableProps.style
                                                                    : {}
                                                            }>
                                                            {renderItem(item)}
                                                        </li>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {dropProvided.placeholder}
                                    </ul>
                                </ColumnContainer>
                            )}
                        </Droppable>
                    );
                })}
            </BoardContainer>
        </DragDropContext>
    );
}

const BoardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    overflow: auto;
    height: 100%;
    gap: 16px;
`;

const ColumnContainer = styled.div<{ $isDraggingOver: boolean }>`
    display: flex;
    overflow: auto;
    flex-direction: column;
    flex-shrink: 0;
    min-width: 200px;
    border-radius: 4px;
    background: ${props => darken(props.$isDraggingOver ? 0.1 : 0, '#ebecf0')};

    > header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        line-height: 0;

        display: flex;
        align-items: center;
        gap: 6px;

        strong {
            font-size: 15px;
        }

        svg {
            cursor: pointer;
            color: #575757;
            border-radius: 50%;
            transition: all 0.2s;

            :hover {
                background: ${lighten(0.5, '#575757')};
                box-shadow: 0 0 0 4px ${lighten(0.5, '#575757')};
            }
        }
    }

    > ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 0 8px 8px 8px;
        height: 100%;
        overflow: auto;

        li {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            background: #ffffff;
            box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
        }

        li[data-rbd-placeholder-context-id] {
            display: none !important;
        }
    }
`;
