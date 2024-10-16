import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';
import { createTodo, updateTodo, removeTodo } from '../api/todos';
import { Todo } from '../types/todo';
//import * as yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importando os estilos do Quill

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (todo: Todo) => void;
    todo?: Todo; // Prop opcional para exibir um to-do existente
    onDelete?: () => void;
    isUpdating?: boolean;
}

// Esquema de validação com Yup
/* const schema = yup.object().shape({
    id: yup.string(),
    title: yup.string().required('O título é obrigatório'),
    description: yup.string().optional(),
    isCompleted: yup.boolean(),
    updatedAt: yup.string(),
    createdAt: yup.string(),
}); */

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSubmit, todo, onDelete }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Todo>({
        //resolver: yupResolver(schema),
    });

    const [description, setDescription] = useState<string>(todo?.description || '');

    // Preencher o formulário com os dados do to-do, se for fornecido
    useEffect(() => {
        if (todo) {
            setValue('title', todo.title);
            setDescription(todo.description || '');
            setValue('isCompleted', todo.isCompleted);
        }
    }, [todo, setValue]);

    const onFormSubmit = async (data: Todo) => {
        setLoading(true);
        const todoData = { ...data, description };
        try {
            if (todo) {
                // Se o to-do existir, atualiza
                await updateTodo(todo.id, todoData);
                onSubmit({ ...todo, ...todoData });
            } else {
                // Caso contrário, cria um novo to-do
                const response = await createTodo(todoData);

                //Adiciona o ID
                const data = {...todoData, id: response.data.id}

                onSubmit(data);
            }
            // Fechar o modal após o sucesso
            onClose();
        } catch (error) {
            console.error('Erro ao processar a tarefas.', error);
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
                console.error('Erro ao deletar tarefa.', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl"> {/* Aumentando o tamanho do modal */}
                <h2 className="text-2xl font-bold mb-6">{todo ? 'Editar Tarefa' : 'Cadastrar Nova Tarefa'}</h2>
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
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Editor de descrição usando React-Quill */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            className="h-70" // Define a altura do editor
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike'],        // negrito, itálico, sublinhado, tachado
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],      // listas ordenadas e não ordenadas
                                    [{ 'header': [1, 2, 3, false] }],                 // cabeçalhos de diferentes tamanhos
                                    ['link'],                                          // links
                                ],
                            }}
                        />
                    </div>

                    {/* Checkbox para marcar como concluído */}
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="isCompleted"
                            {...register('isCompleted')}
                            className="mr-2"
                        />
                        <label htmlFor="isCompleted" className="text-gray-700 font-medium">Tarefa Concluída</label>
                    </div>

                    <div className="flex justify-between items-center">
                        {/* Exibir status de Concluído ou Pendente */}
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
                                    disabled={loading}
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
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoModal;
