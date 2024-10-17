import React, { useState, useEffect } from 'react';
import { getTodos } from '../../api/todos';
import { Todo } from '../../types/todo';
import TodoModal from '../TodoModal';
import DOMPurify from 'dompurify';
interface TodoListBoardProps {
    todos: Todo[];
    updateTodos: (updatedTodos: Todo[]) => void; // Função para atualizar os todos
}

const TodoList: React.FC<TodoListBoardProps> = ({ todos, updateTodos }) => {
    //const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    // Filtros adicionados
    const [filterPriority, setFilterPriority] = useState<string>(''); // Estado para o filtro de prioridade
    const [filterStatus, setFilterStatus] = useState<string>(''); // Estado para o filtro de status (pendente ou concluído)

    const handleAddTodo = (newTodo: Todo) => {
        const idExists = todos.some((todo) => todo.id === newTodo.id);

        if (idExists) {
            const updatedTodos = todos.map((todo) =>
                todo.id === newTodo.id ? newTodo : todo
            );
            updateTodos(updatedTodos);
            setIsUpdating(false);
        } else {
            updateTodos([newTodo, ...todos]);
        }

        setIsModalOpen(false);
    };

    const handleDeleteTodo = (todoId: number) => {
        updateTodos(todos.filter((todo) => todo.id !== todoId));
        setIsModalOpen(false);
    };

    const openTodoModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsUpdating(true);
        setIsModalOpen(true);
    };

    // Atualiza a função fetchTodos para aceitar os filtros
    const fetchTodos = async (priority: string, status: string) => {
        // Ativa o estado de carregamento
        setLoading(true);
        try {
            // Passa os filtros para a API
            const todos = await getTodos(priority, status);
            updateTodos(todos);
        } catch (err) {
            setError('Erro ao buscar to-dos');
        } finally {
            // Desativa o estado de carregamento
            setLoading(false);
        }
    };

    // Dispara a busca de to-dos toda vez que os filtros mudarem
    useEffect(() => {
        fetchTodos(filterPriority, filterStatus);
    }, [filterPriority, filterStatus]); // Efeito disparado ao alterar os filtros

    if (loading) {
        return <div>Carregando to-dos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Minhas Tarefas</h2>

            {/* Filtros de prioridade e status */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                {/* Filtro de prioridade */}
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-medium" htmlFor="filterPriority">
                        Prioridade:
                    </label>
                    <select
                        id="filterPriority"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                        <option value="">Todas</option>
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
                    </select>
                </div>

                {/* Filtro de status */}
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-medium" htmlFor="filterStatus">
                        Status:
                    </label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                        <option value="">Todos</option>
                        <option value="pendente">Pendente</option>
                        <option value="concluido">Concluído</option>
                    </select>
                </div>
            </div>

            {/* Botão para abrir o modal de novo to-do */}
            <button
                onClick={() => { setSelectedTodo(null); setIsUpdating(false); setIsModalOpen(true); }}
                className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
                Nova Tarefa
            </button>

            {/* Modal de criação ou visualização de to-do */}
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTodo}
                todo={selectedTodo || undefined}
                onDelete={selectedTodo ? () => handleDeleteTodo(selectedTodo.id) : undefined}
                isUpdating={isUpdating}
            />

            {/* Grid de to-dos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        onClick={() => openTodoModal(todo)}
                        className={`cursor-pointer bg-white rounded-lg shadow-md p-6 transition transform hover:scale-105 hover:shadow-lg 
                            ${todo.isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'} max-w-96 h-48`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-semibold truncate ${todo.isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                                {todo.title}
                            </h3>
                        </div>

                        <p
                            className="text-gray-600 mb-4 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(todo.description) }}
                        />

                        <span
                            className={`inline-block text-sm px-3 py-1 rounded-full 
                                ${todo.isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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
