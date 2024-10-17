import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createTodo, updateTodo, removeTodo } from '../api/todos';
import { Todo } from '../types/todo';
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

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSubmit, todo, onDelete }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(todo?.description || '');
  const [subtaskTitle, setSubtaskTitle] = useState<string>('');
  const [subtasks, setSubtasks] = useState<{ id: number; title: string; isCompleted: boolean }[]>(
    todo?.subtasks || []
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Todo>({
    defaultValues: {
      priority: todo?.priority || 'medium',
      dueDate: todo?.dueDate || '',
    },
  });

  // Preencher o formulário com os dados do to-do, se for fornecido
  useEffect(() => {
    if (todo) {
      setValue('title', todo.title);
      setDescription(todo.description || '');
      setValue('isCompleted', todo.isCompleted);
      setValue('priority', todo.priority);
      setValue('dueDate', todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
      setSubtasks(todo.subtasks || []);
    }
  }, [todo, setValue]);

  const onFormSubmit = async (data: Todo) => {
    setLoading(true);
    const todoData = { ...data, description, subtasks };
    try {
      if (todo) {
        // Se o to-do existir, atualiza
        await updateTodo(todo.id, todoData);
        onSubmit({ ...todo, ...todoData });
      } else {
        // Caso contrário, cria um novo to-do
        const response = await createTodo(todoData);
        onSubmit({ ...todoData, id: response.data.id });
      }
      // Fechar o modal após o sucesso
      onClose();
    } catch (error) {
      console.error('Erro ao processar a tarefa.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = () => {
    if (subtaskTitle.trim()) {
      const newSubtask = {
        id: Date.now(),
        title: subtaskTitle,
        isCompleted: false,
      };
      setSubtasks([...subtasks, newSubtask]);
      setSubtaskTitle('');
    }
  };

  const handleSubtaskChange = (id: number, isCompleted: boolean) => {
    setSubtasks(subtasks.map(subtask => subtask.id === id ? { ...subtask, isCompleted } : subtask));
  };

  const handleDeleteSubtask = (id: number) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">{todo ? 'Editar Tarefa' : 'Cadastrar Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* Campo de título */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Título</label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'O título é obrigatório' })}
              className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* Editor de descrição usando React-Quill */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Descrição</label>
            <ReactQuill value={description} onChange={setDescription} className="h-40" />
          </div>

          {/* Campo de Prioridade */}
          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-700 font-medium mb-2">Prioridade</label>
            <select
              id="priority"
              {...register('priority')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Campo de Data de Vencimento */}
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-2">Data de Vencimento</label>
            <input
              type="date"
              id="dueDate"
              {...register('dueDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Gerenciamento de Subtarefas */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Subtarefas</label>
            <div className="space-y-2">
              {subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={e => handleSubtaskChange(subtask.id, e.target.checked)}
                    className="mr-2"
                  />
                  <span className={`flex-1 ${subtask.isCompleted ? 'line-through text-gray-500' : ''}`}>{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Excluir
                  </button>
                </div>
              ))}
              {/* Adicionar Nova Subtarefa */}
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  placeholder="Nova subtarefa"
                  className="flex-1 border border-gray-300 rounded-md p-2"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Checkbox para marcar como concluído */}
          <div className="mb-6 flex items-center">
            <input type="checkbox" id="isCompleted" {...register('isCompleted')} className="mr-2" />
            <label htmlFor="isCompleted" className="text-gray-700 font-medium">Tarefa Concluída</label>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {todo && (
                <span className={`inline-block text-sm px-3 py-1 rounded-full ${todo.isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
