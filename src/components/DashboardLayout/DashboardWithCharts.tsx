import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getTodos } from '../../api/todos';
import { Chart, registerables } from 'chart.js';

// Registrar os elementos do Chart.js
Chart.register(...registerables);

interface Todo {
    id: string;
    title: string;
    isCompleted: boolean;
}

const DashboardWithCharts: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar os dados da API quando o componente for montado
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const todos = await getTodos();
                setTodos(todos);
            } catch (error) {
                setError('Erro ao carregar os dados das tarefas.');
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    // Calcular as quantidades de tarefas
    const totalTasks = todos.length;
    const completedTasks = todos.filter((todo) => todo.isCompleted).length;
    const openTasks = totalTasks - completedTasks;

    // Dados para o gráfico
    const data = {
        labels: ['Total de Tarefas', 'Concluídas', 'Abertas'],
        datasets: [
            {
                label: 'Tarefas',
                data: [totalTasks, completedTasks, openTasks],
                backgroundColor: ['#4F46E5', '#22C55E', '#F97316'],
                borderColor: ['#4F46E5', '#22C55E', '#F97316'],
                borderWidth: 1,
            },
        ],
    };

    // Opções do gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    if (loading) {
        return <div className="text-center mt-20 text-gray-600">Carregando os gráficos...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Estatísticas de Tarefas</h1>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                {/* Cartões com informações resumidas */}
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold">Total de Tarefas</h2>
                    <p className="text-4xl mt-2">{totalTasks}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold">Tarefas Concluídas</h2>
                    <p className="text-4xl mt-2">{completedTasks}</p>
                </div>
                <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold">Tarefas Abertas</h2>
                    <p className="text-4xl mt-2">{openTasks}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {/* Gráfico de Barras */}
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default DashboardWithCharts;
