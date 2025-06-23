import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getItens, Categoria, Item } from "../../services/ItemService"; // ajuste o caminho se necessário

const cores = ["#007BFF", "#28A745", "#FFC107", "#DC3545"];

const nomesCategoria: Record<Categoria, string> = {
  ELETRONICO: "Eletrônicos",
  ELETRODOMESTICO: "Eletrodomésticos",
  MOVEL: "Móveis",
  TEXTIL: "Têxteis",
};

const Dashboard: React.FC = () => {
  const [dadosGrafico, setDadosGrafico] = useState<
    { name: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const categorias: Categoria[] = [
          "ELETRONICO",
          "ELETRODOMESTICO",
          "MOVEL",
          "TEXTIL",
        ];

        const resultados = await Promise.all(
          categorias.map(async (categoria) => {
            const itens: Item[] = await getItens(categoria);
            const quantidade = itens.reduce(
              (acc, item) => acc + item.quantidade,
              0
            );
            return { name: nomesCategoria[categoria], value: quantidade };
          })
        );

        setDadosGrafico(resultados);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar dados do gráfico.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) return <p className="text-center mt-5">Carregando gráfico...</p>;
  if (erro) return <p className="text-center text-danger">{erro}</p>;

  return (
    <div className="main-content-inner">
      <h1 className="page-title mb-4">Visão Geral do Inventário</h1>

      <div className="card p-4">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={dadosGrafico}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {dadosGrafico.map((_, index) => (
                <Cell key={index} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
