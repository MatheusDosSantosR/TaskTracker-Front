import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import TodoList from '../../components/TodoList/TodoList';
import KanbanBoard from '../../components/TodoList/KanbanBoard';
import { Todo } from '../../types/todo';
import { getTodos } from '../../api/todos';

const Dashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<'cards' | 'kanban'>('cards');
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            const fetchedTodos = await getTodos();
            setTodos(fetchedTodos);
        };

        fetchTodos();
    }, []);

    const updateTodos = (updatedTodos: Todo[]) => {
        setTodos(updatedTodos);
    };

    const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setViewMode(event.target.value as 'cards' | 'kanban');
    };

    return (
        <DashboardLayout>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Gerenciamento de Tarefas</h2>
                
                <select
                    value={viewMode}
                    onChange={handleViewChange}
                    className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                >
                    <option value="cards">Visualização em Cards</option>
                    <option value="kanban">Visualização em Kanban</option>
                </select>
            </div>

            {viewMode === 'cards' ? (
                <TodoList todos={todos} updateTodos={updateTodos} />
            ) : (
                <KanbanBoard todos={todos} updateTodos={updateTodos} />
            )}
        </DashboardLayout>
    );
};

export default Dashboard;
