import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemById, Item } from "../../../services/ItemService";

const DetalhesMoveis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        try {
          const data = await getItemById(Number(id));
          setItem(data);
        } catch (error) {
          console.error("Erro ao buscar móvel:", error);
        }
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <p>Carregando...</p>;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detalhes do Móvel</h1>

      <p>
        <strong>ID:</strong> {item.id}
      </p>
      <p>
        <strong>Descrição:</strong> {item.descricao}
      </p>
      <p>
        <strong>Data de Cadastro:</strong>{" "}
        {item.data_cadastro ? formatDate(item.data_cadastro) : "Não informada"}
      </p>
      <p>
        <strong>Quantidade:</strong> {item.quantidade}
      </p>
      <p>
        <strong>Valor:</strong> {formatCurrency(item.valor)}
      </p>
      <p>
        <strong>Caminhão:</strong> {item.caminhao}
      </p>
      <p>
        <strong>Categoria:</strong> {item.categoria}
      </p>
      <p>
        <strong>Estado de Conservação:</strong> {item.estadoConservacao}
      </p>
      <p>
        <strong>Situação:</strong> {item.situacao}
      </p>
      <p>
        <strong>Anexo:</strong>{" "}
        {item.anexo ? (
          <a href={item.anexo} target="_blank" rel="noopener noreferrer">
            Ver Anexo
          </a>
        ) : (
          "Sem anexo"
        )}
      </p>
    </div>
  );
};

export default DetalhesMoveis;
