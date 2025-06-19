import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, Item } from "../../../services/ItemService";
import { ArrowLeft, Package } from "lucide-react";

const DetalhesMovel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      if (id) {
        try {
          const data = await getItemById(Number(id));
          setItem(data);
        } catch (err) {
          console.error("Erro ao buscar móvel:", err);
          setError("Não foi possível carregar os detalhes do móvel. Tente novamente mais tarde.");
          setItem(null);
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID do móvel não fornecido.");
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "Não informada";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number | undefined): string =>
    (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error || "Móvel não encontrado."}</p>
        <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/categorias/moveis")}>
          Voltar para a Lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary mb-0">Detalhes do Móvel</h1>
        <button className="btn btn-outline" onClick={() => navigate("/categorias/moveis")}>
          <ArrowLeft size={16} className="me-2" />
          Voltar para Lista
        </button>
      </div>

      <div className="card">
        <div className="card-content p-4">
          <div className="card-header d-flex align-items-center mb-4">
            <Package size={20} className="me-2 text-primary" />
            <h5 className="card-title mb-0">Informações Completas do Item</h5>
          </div>

          <div className="row g-3">
            <div className="col-md-6"><p><strong>ID:</strong> {item.id}</p></div>
            <div className="col-md-6"><p><strong>Descrição:</strong> {item.descricao}</p></div>
            <div className="col-md-6"><p><strong>Data de Cadastro:</strong> {formatDate(item.data_cadastro)}</p></div>
            <div className="col-md-6"><p><strong>Quantidade:</strong> {item.quantidade}</p></div>
            <div className="col-md-6"><p><strong>Valor:</strong> {formatCurrency(item.valor)}</p></div>
            <div className="col-md-6"><p><strong>Caminhão:</strong> {item.caminhao || "Não informado"}</p></div>
            <div className="col-md-6"><p><strong>Categoria:</strong> {item.categoria}</p></div>
            <div className="col-md-6"><p><strong>Estado de Conservação:</strong> {item.estadoConservacao}</p></div>
            <div className="col-md-6"><p><strong>Situação:</strong> {item.situacao}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesMovel;
