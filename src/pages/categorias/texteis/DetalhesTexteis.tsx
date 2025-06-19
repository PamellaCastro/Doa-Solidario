import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, Item } from "../../../services/ItemService";

const DetalhesTextil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await getItemById(Number(id));
        setItem(data);
      } catch {
        setError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const formatCurrency = (v: number | undefined) => (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) return <p>Carregando...</p>;
  if (!item) return <p>{error || "Item não encontrado"}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Detalhes do Têxtil</h1>
      <div className="card p-4">
        <p><strong>ID:</strong> {item.id}</p>
        <p><strong>Descrição:</strong> {item.descricao}</p>
        <p><strong>Data de Cadastro:</strong> {item.data_cadastro}</p>
        <p><strong>Quantidade:</strong> {item.quantidade}</p>
        <p><strong>Valor:</strong> {formatCurrency(item.valor)}</p>
        <p><strong>Caminhão:</strong> {item.caminhao}</p>
        <p><strong>Categoria:</strong> {item.categoria}</p>
        <p><strong>Estado de Conservação:</strong> {item.estadoConservacao}</p>
        <p><strong>Situação:</strong> {item.situacao}</p>
        <button className="btn btn-outline mt-3" onClick={() => navigate("/categorias/texteis")}>Voltar</button>
      </div>
    </div>
  );
};

export default DetalhesTextil;