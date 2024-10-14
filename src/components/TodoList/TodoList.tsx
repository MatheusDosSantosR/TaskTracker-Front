// src/components/TodoList/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { getTodos, updateTodoStatus } from '../../api/todos'; // Importe a função para atualizar o status
import { Todo } from '../../types/todo';
import TodoModal from '../TodoModal'; // Importe o componente do modal

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

    const handleToggleComplete = async (todo: Todo) => {
        try {
            const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
            await updateTodoStatus(updatedTodo.id, updatedTodo.isCompleted);
            setTodos((prevTodos) =>
                prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t))
            );
        } catch (err) {
            setError('Erro ao atualizar o to-do');
        }
    };

    const handleAddTodo = (newTodo: { title: string; description: string }) => {
        const newTodoItem = {
            id: (todos.length + 1).toString(),
            title: newTodo.title,
            description: newTodo.description,
            isCompleted: false,
        };
        setTodos([newTodoItem, ...todos]);
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const todos = await getTodos();
                setTodos(todos);
            } catch (err) {
                setError('Erro ao buscar to-dos');
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    if (loading) {
        return <div>Carregando to-dos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Minhas Tarefas</h2>

            {/* Botão para abrir o modal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
                Novo To-Do
            </button>

            {/* Modal para cadastrar to-do */}
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTodo}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className={`bg-white rounded-lg shadow-md p-6 transition transform hover:scale-105 hover:shadow-lg ${todo.isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-semibold ${todo.isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                                {todo.title}
                            </h3>
                            <input
                                type="checkbox"
                                checked={todo.isCompleted}
                                onChange={() => handleToggleComplete(todo)}
                                className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                        </div>
                        <p className="text-gray-600 mb-4">{todo.description}</p>
                        <span
                            className={`inline-block text-sm px-3 py-1 rounded-full ${todo.isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {todo.isCompleted ? 'Concluído' : 'Pendente'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
