import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioItemIntegrado from "../../../components/formularios/FormularioItem";
import { ItemService } from "../../../services/ItemService";
import type { Item } from "../../../types/Item";

const EditarEletrodomestico: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        try {
          const data = await ItemService.buscarPorId(Number(id));
          if (data.data_cadastro) {
            data.data_cadastro = new Date(data.data_cadastro)
              .toISOString()
              .split("T")[0];
          }
          setItem(data);
        } catch (err) {
          console.error("Erro ao buscar eletrodoméstico:", err);
          setError("Não foi possível carregar os dados para edição.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID não fornecido.");
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (!item) return;
    if (name === "valor") {
      const numericString = value.replace(/[^\d]/g, "");
      const numericValue = Number(numericString) / 100;
      setItem((prev) => ({ ...prev!, valor: numericValue }));
    } else if (name === "caminhao") {
      setItem((prev) => ({ ...prev!, caminhao: value === "true" }));
    } else if (type === "number" || name === "quantidade") {
      setItem((prev) => ({ ...prev!, [name]: Number(value) }));
    } else {
      setItem((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, itemAtualizado?: Item) => {
    e.preventDefault();
    const finalItem = itemAtualizado || item
    setIsSubmitting(true);
    setError(null);

    if (!finalItem || !finalItem.id) {
      setError("Item inválido.");
      setIsSubmitting(false);
      return;
    }

    if (
      !finalItem.descricao ||
      finalItem.quantidade <= 0 ||
      !finalItem.estadoConservacao ||
      !finalItem.situacao
    ) {
      setError("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    if (!finalItem.pessoadoador) {
      setError("Por favor, selecione uma pessoa.");
      setIsSubmitting(false);
      return;
    }

    try {
      await ItemService.atualizar(finalItem.id, finalItem);
      alert("Eletrodoméstico atualizado com sucesso!");
      navigate("/categorias/eletrodomesticos");
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setError("Erro ao atualizar. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-4">Carregando...</div>;

  return item ? (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-primary">Editar Eletrodoméstico</h1>
      <FormularioItemIntegrado
        item={item}
        onChange={handleChange}
        onSubmit={handleSubmit}
        modo="edicao"
        error={error}
        isSubmitting={isSubmitting}
        disableCategoria
        disableDataCadastro
      />
    </div>
  ) : (
    <div className="alert alert-danger m-4">{error || "Item não encontrado."}</div>
  );
};

export default EditarEletrodomestico;
