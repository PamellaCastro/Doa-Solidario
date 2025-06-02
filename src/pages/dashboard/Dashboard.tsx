import React, { useState, useEffect } from "react";
import { getItens, Item } from "../../services/ItemService";

const Dashboard: React.FC = () => {
  const [eletronicos, setEletronicos] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca os itens da categoria "ELETRONICO" usando a função getItens
        const data = await getItens("ELETRONICO");
        setEletronicos(data);
      } catch (error) {
        console.error("Erro ao buscar eletrônicos no Dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total de Eletrônicos: {eletronicos.length}</p>
      {/* Aqui você pode adicionar mais informações, gráficos ou resumos conforme necessário */}
    </div>
  );
};

export default Dashboard;
