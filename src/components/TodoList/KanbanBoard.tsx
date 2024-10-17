import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Todo } from '../../types/todo';

interface KanbanBoardProps {
    todos: Todo[];
    updateTodos: (updatedTodos: Todo[]) => void;
}

// Define o tipo das colunas, com chaves fixas
type Columns = {
    pending: Todo[];
    inProgress: Todo[];
    completed: Todo[];
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, updateTodos }) => {
    const [columns, setColumns] = useState<Columns>({
        pending: todos.filter((todo) => !todo.isCompleted && !todo.status),
        inProgress: todos.filter((todo) => todo.status === 'inProgress'),
        completed: todos.filter((todo) => todo.isCompleted),
    });

    // Função chamada quando o drag-and-drop é finalizado
    const handleOnDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceColumnId = source.droppableId as keyof Columns;
        const destinationColumnId = destination.droppableId as keyof Columns;

        const sourceColumn = [...columns[sourceColumnId]];
        const destinationColumn = [...columns[destinationColumnId]];

        // Remove o item da coluna de origem
        const [movedItem] = sourceColumn.splice(source.index, 1);

        // Adiciona o item na coluna de destino
        destinationColumn.splice(destination.index, 0, movedItem);

        // Atualiza as colunas com o novo estado
        setColumns({
            ...columns,
            [sourceColumnId]: sourceColumn,
            [destinationColumnId]: destinationColumn,
        });

        const updatedTodos = [...columns.pending, ...columns.inProgress, ...columns.completed];
        updateTodos(updatedTodos);
    };

    return (
        <div className="kanban-board">
            <h2 className="text-3xl font-bold mb-4">Kanban Board</h2>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className="flex justify-between space-x-4">
                    {/* Coluna de Pendente */}
                    <Droppable droppableId="pending">
                        {(provided, snapshot) => (
                            <div
                                className="w-1/3"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : 'transparent' }}
                            >
                                <h3 className="text-lg font-semibold mb-4 text-red-600">Pendente</h3>
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4 min-h-[200px]">
                                    {columns.pending.map((todo, index) => (
                                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition transform hover:scale-105"
                                                >
                                                    <h4 className="text-md font-semibold">{todo.title}</h4>
                                                    <p className="text-gray-600 text-sm">{todo.description}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    {/* Coluna de Em Progresso */}
                    <Droppable droppableId="inProgress">
                        {(provided, snapshot) => (
                            <div
                                className="w-1/3"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : 'transparent' }}
                            >
                                <h3 className="text-lg font-semibold mb-4 text-yellow-600">Em Progresso</h3>
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4 min-h-[200px]">
                                    {columns.inProgress.map((todo, index) => (
                                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition transform hover:scale-105"
                                                >
                                                    <h4 className="text-md font-semibold">{todo.title}</h4>
                                                    <p className="text-gray-600 text-sm">{todo.description}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    {/* Coluna de Concluído */}
                    <Droppable droppableId="completed">
                        {(provided, snapshot) => (
                            <div
                                className="w-1/3"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : 'transparent' }}
                            >
                                <h3 className="text-lg font-semibold mb-4 text-green-600">Concluído</h3>
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4 min-h-[200px]">
                                    {columns.completed.map((todo, index) => (
                                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition transform hover:scale-105"
                                                >
                                                    <h4 className="text-md font-semibold">{todo.title}</h4>
                                                    <p className="text-gray-600 text-sm">{todo.description}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
