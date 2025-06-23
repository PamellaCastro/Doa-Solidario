import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioItem from "../../../components/formularios/FormularioItem";
import { getItemById, updateItem, Item } from "../../../services/ItemService";

const EditarTextil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        try {
          const data = await getItemById(Number(id));

          // Verifica se data_cadastro existe e é uma string antes de formatar
          if (data.data_cadastro && typeof data.data_cadastro === "string") {
            data.data_cadastro = new Date(data.data_cadastro)
              .toISOString()
              .split("T")[0];
          }

          setItem(data);
          setError(null);
        } catch (err) {
          console.error("Erro ao buscar têxtil:", err);
          setError("Não foi possível carregar os dados do item para edição.");
          setItem(null);
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID do item não fornecido.");
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (!item) return;

    if (name === "valor") {
      const numericString = value.replace(/[^\d]/g, "");
      const numericValue = Number(numericString) / 100;
      setItem((prev) => ({ ...prev!, valor: numericValue }));
    } else if (type === "number" || name === "quantidade") {
      setItem((prev) => ({ ...prev!, [name]: parseFloat(value) || 0 }));
    } else {
      setItem((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!item || !item.id) {
      setError("Item inválido para atualização.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (
        !item.descricao ||
        item.quantidade <= 0 ||
        item.valor <= 0 ||
        !item.estadoConservacao ||
        !item.situacao
      ) {
        setError(
          "Preencha todos os campos obrigatórios. Quantidade e valor devem ser maiores que zero."
        );
        return;
      }

      await updateItem(item.id, item);
      alert("Têxtil atualizado com sucesso!");
      navigate("/categorias/textil");
    } catch (err) {
      console.error("Erro ao atualizar têxtil:", err);
      setError("Erro ao atualizar item. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error || "Item não encontrado."}</p>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate("/categorias/textil")}
        >
          Voltar para a Lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Editar Têxtil</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/categorias/textil")}
        >
          Voltar para Lista
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <FormularioItem
            item={item}
            onChange={handleChange}
            onSubmit={handleSubmit}
            modo="edicao"
            error={error}
            isSubmitting={isSubmitting}
            disableCategoria={true}
            disableDataCadastro={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditarTextil;
