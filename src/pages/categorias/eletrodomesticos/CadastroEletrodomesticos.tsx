import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioItem from "../../../components/FormularioItem";
import { createItem, Item } from "../../../services/ItemService";

const initialItemState: Item = {
  descricao: "",
  quantidade: 0,
  valor: 0 ,
  caminhao: "",
  categoria: "ELETRODOMESTICO", 
  estadoConservacao: "",
  situacao: "",
  data_cadastro: "",
};

const CadastroEletrodomestico: React.FC = () => {
  const [item, setItem] = useState<Item>(initialItemState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    const newValue = (type === 'number' || name === 'quantidade' || name === 'valor')
      ? parseFloat(value) || 0 
      : value;

    setItem((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSubmitting(true); 
    setError(null); 

    try {
      if (!item.descricao || item.quantidade === 0 || item.valor === 0 || !item.estadoConservacao || !item.situacao) {
        setError("Por favor, preencha todos os campos obrigatórios e garanta que quantidade e valor sejam maiores que zero.");
        return; 
      }

      await createItem(item);

      alert("Eletrodoméstico cadastrado com sucesso!");
      navigate("/categorias/eletrodomesticos"); 
    } catch (err) {
      console.error("Erro ao cadastrar eletrodoméstico:", err);
      setError("Erro ao cadastrar eletrodoméstico. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Cadastrar Novo Eletrodoméstico</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/categorias/eletrodomesticos")}
        >
          Voltar para Lista
        </button>
      </div>
      <div className="row justify-content-center">

        <div className="col-12">
          <FormularioItem
            item={item} 
            onChange={handleChange} 
            onSubmit={handleSubmit} 
            modo="cadastro" 
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

export default CadastroEletrodomestico;