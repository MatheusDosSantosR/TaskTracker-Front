import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createTodo, updateTodo, removeTodo } from '../api/todos';
import { DeleteTodo, Todo } from '../types/todo';
import * as yup from 'yup';

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (todo: Todo) => void;
    todo?: Todo; // Prop opcional para exibir um to-do existente
    onDelete?: () => void; // Função para deletar o to-do (opcional)
}

// Esquema de validação com Yup
const schema = yup.object().shape({
    title: yup.string().required('O título é obrigatório'),
    description: yup.string().optional(),
    isCompleted: yup.boolean().default(false),
});

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSubmit, todo, onDelete }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Todo>({
        //resolver: yupResolver(schema),
    });

    // Preencher o formulário com os dados do to-do, se for fornecido
    useEffect(() => {
        if (todo) {
            setValue('title', todo.title);
            setValue('description', todo.description || '');
            setValue('isCompleted', todo.isCompleted);
        }
    }, [todo, setValue]);

    const onFormSubmit = async (data: Todo) => {
        setLoading(true);
        try {
            if (todo) {
                // Se o to-do existir, atualizamos
                await updateTodo(todo.id, data);
                onSubmit({ ...todo, ...data });
            } else {
                // Caso contrário, criamos um novo to-do
                await createTodo(data);
                onSubmit(data);
            }
            // Fechar o modal após o sucesso
            onClose();
        } catch (error) {
            console.error('Erro ao processar o to-do', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (todo && onDelete) {
            setLoading(true);
            try {
                await removeTodo(todo.id); // Chama a função de deletar
                onDelete(); // Chama a função passada para atualizar a lista localmente
                onClose(); // Fecha o modal após a exclusão
            } catch (error) {
                console.error('Erro ao deletar o to-do', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">{todo ? 'Visualizar Tarefa' : 'Cadastrar Nova Tarefa'}</h2>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    {/* Campo de título */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                            Título
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register('title')}
                            className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={!!todo} // Desabilitar se for visualização
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Campo de descrição */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!!todo} // Desabilitar se for visualização
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            {todo && (
                                <span
                                    className={`inline-block text-sm px-3 py-1 rounded-full ${todo.isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {todo.isCompleted ? 'Concluído' : 'Pendente'}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2">
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Excluir
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Fechar
                            </button>
                            {!todo && (
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoModal;
