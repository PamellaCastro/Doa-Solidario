import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioItem from "../../../components/formularios/FormularioItem";
import { ItemService } from "../../../services/ItemService";
import type {
  Item,
  Categoria,
  EstadoConservacao,
  Situacao,
} from "../../../types/Item";

const CadastroTexteis: React.FC = () => {
  const navigate = useNavigate();

  const [item, setItem] = useState<Item>({
    descricao: "",
    quantidade: 0,
    valor: 0,
    caminhao: false,
    categoria: "TEXTIL" as Categoria,
    estadoConservacao: "" as EstadoConservacao,
    situacao: "ABERTO" as Situacao,
    data_cadastro: new Date().toISOString().split("T")[0],
    subCategoria: undefined,
    pessoadoador: undefined,
    pessoabeneficiario: undefined,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setItem((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else if (name === "caminhao") {
      setItem((prev) => ({
        ...prev,
        [name]: value === "true" || value === true,
      }));
    } else if (name === "quantidade" || name === "valor") {
      setItem((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, itemAtualizado?: Item) => {
    const finalItem = itemAtualizado || item;
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // DAVA ERRO, INVESTIGAR NO FUTURO (NÃO APAGAR)(corrigido)
    if (!finalItem.pessoadoador || !finalItem.pessoadoador.id) {
      setError("Por favor, selecione uma pessoa doadora válida.");
      setIsSubmitting(false);
      return;
    }

    try {
      await ItemService.criar(finalItem);
      alert("Têxtil cadastrado com sucesso!");

      setItem({
        descricao: "",
        quantidade: 0,
       // valor: 0,
        caminhao: false,
        categoria: "TEXTIL" as Categoria,
        estadoConservacao: "" as EstadoConservacao,
        situacao: "ABERTO" as Situacao,
        data_cadastro: new Date().toISOString().split("T")[0],
        subCategoria: undefined,
        pessoadoador: undefined,
        pessoabeneficiario: undefined,
      });

      navigate("/categorias/texteis");
    } catch (err) {
      console.error("Erro ao cadastrar têxtil:", err);
      setError(
        "Erro ao cadastrar têxtil. Verifique os dados e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Cadastrar Novo Têxtil</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/categorias/texteis")}
        >
          Voltar para Lista
        </button>
      </div>

      <FormularioItem
        item={item}
        onChange={handleChange}
        onSubmit={handleSubmit}
        modo="cadastro"
        error={error}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CadastroTexteis;
