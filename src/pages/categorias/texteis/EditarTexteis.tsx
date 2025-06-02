import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, updateItem, Item } from "../../../services/ItemService";
import axios from "axios";

const EditarTextil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item>({
    descricao: "",
    data_cadastro: "",
    quantidade: 0,
    valor: 0,
    caminhao: "",
    categoria: "TEXTIL",
    estadoConservacao: "",
    situacao: "",
    anexo: "",
  });

  const [categorias, setCategorias] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) buscarItem(parseInt(id));
    // buscarCategorias();
  }, [id]);

  const buscarItem = async (itemId: number) => {
    try {
      const data = await getItemById(itemId);
      setItem(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar o item:", err);
      setError("Erro ao buscar o item. Tente novamente mais tarde.");
    }
  };

  // const buscarCategorias = async () => {
  //   try {
  //     const response = await axios.get("/api/categorias");
  //     setCategorias(response.data);
  //   } catch (error) {
  //     console.error("Erro ao buscar categorias:", error);
  //   }
  // };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await updateItem(parseInt(id), item);
        alert("Item atualizado com sucesso!");
        navigate("/categorias/textil");
      } catch (err) {
        console.error("Erro ao atualizar o item:", err);
        setError("Erro ao atualizar o item. Tente novamente mais tarde.");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Têxtil</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="descricao">Descrição:</label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            value={item.descricao}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="data_cadastro">Data de Cadastro:</label>
          <input
            type="date"
            id="data_cadastro"
            name="data_cadastro"
            value={item.data_cadastro ? item.data_cadastro.split("T")[0] : ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={item.quantidade}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="valor">Valor:</label>
          <input
            type="number"
            id="valor"
            name="valor"
            step="0.01"
            value={item.valor}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="caminhao">Caminhão:</label>
          <input
            type="text"
            id="caminhao"
            name="caminhao"
            value={item.caminhao}
            onChange={handleChange}
            className="input"
            
          />
        </div>

        <div>
          <label htmlFor="estadoConservacao">Estado de Conservação:</label>
          <select
            id="estadoConservacao"
            name="estadoConservacao"
            value={item.estadoConservacao}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Selecione</option>
            <option value="BOM">Bom</option>
            <option value="REGULAR">Regular</option>
            <option value="RUIM">Ruim</option>
          </select>
        </div>

        <div>
          <label htmlFor="situacao">Situação:</label>
          <select
            id="situacao"
            name="situacao"
            value={item.situacao}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Selecione</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="DEPOSITADO">Depositado</option>
            <option value="VENDIDO">Vendido</option>
            <option value="SOLICITADO">Solicitado</option>
            <option value="DOADO">Doado</option>
            
          </select>
        </div>

        <div>
          <label htmlFor="categoria">Categoria:</label>
          <select
            id="categoria"
            name="categoria"
            value={item.categoria}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="ELETRONICO">Eletrônico</option>
            <option value="ELETRODOMESTICO">Eletrodoméstico</option>
            <option value="MOVEL">Móvel</option>
            <option value="TEXTIL">Têxtil</option>
          </select>
        </div>

        <div>
          <label htmlFor="anexo">Anexo (URL):</label>
          <input
            type="text"
            id="anexo"
            name="anexo"
            value={item.anexo || ""}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <button type="submit" className="form-button primary">
            Atualizar Têxtil
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarTextil
