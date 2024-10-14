// src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { getTodos } from '../../api/todos';
import { Todo } from '../../types/todo';
import TodoModal from '../TodoModal';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTodo = (newTodo: Todo) => {
        setTodos([newTodo, ...todos]); // Adiciona o novo to-do no início da lista
    };

    const handleDeleteTodo = (todoId: string) => {
        setTodos(todos.filter((todo) => todo.id !== todoId)); // Remove o to-do da lista
        setIsModalOpen(false); // Fecha o modal após a exclusão
    };

    const openTodoModal = (todo: Todo) => {
        setSelectedTodo(todo); // Define o to-do selecionado
        setIsModalOpen(true); // Abre o modal
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

            {/* Botão para abrir o modal de novo to-do */}
            <button
                onClick={() => { setSelectedTodo(null); setIsModalOpen(true); }}
                className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
                Nova Tarefa
            </button>

            {/* Modal de criação ou visualização de to-do */}
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTodo}
                todo={selectedTodo || undefined} // Se existir um to-do selecionado, exibirá no modal
                onDelete={selectedTodo ? () => handleDeleteTodo(selectedTodo.id) : undefined}
            />

            {/* Grid de to-dos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        onClick={() => openTodoModal(todo)} // Abre o modal com o to-do
                        className={`cursor-pointer bg-white rounded-lg shadow-md p-6 transition transform hover:scale-105 hover:shadow-lg ${todo.isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500 max-w-96'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-semibold ${todo.isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                                {todo.title}
                            </h3>
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
