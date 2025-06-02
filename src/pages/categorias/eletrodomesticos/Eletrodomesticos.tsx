import React, { useEffect, useState } from "react";
import { getItens, deleteItem, Item } from "../../../services/ItemService";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";

function Eletrodomesticos() {
  const [itens, setItens] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItens();
  }, []);

  const fetchItens = async () => {
    try {
      // Utiliza o service para obter itens da categoria "ELETRODOMESTICO"
      const data = await getItens("ELETRODOMESTICO");
      if (Array.isArray(data)) {
        setItens(data);
        setError(null);
      } else {
        setError("Dados retornados não são um array válido.");
      }
    } catch (error) {
      console.error("Erro ao buscar eletrodomésticos:", error);
      setError("Erro ao buscar eletrodomésticos. Tente novamente mais tarde.");
    }
  };

  const handleNovoCadastro = () => {
    navigate("/categorias/eletrodomesticos/novo");
  };

  const handleEditar = (id: number) => {
    navigate(`/categorias/eletrodomesticos/editar/${id}`);
  };

  const handleDetalhes = (id: number) => {
    navigate(`/categorias/eletrodomesticos/detalhes/${id}`);
  };

  const handleExcluir = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      try {
        // Utiliza o método genérico de deleção
        await deleteItem(id);
        alert("Item excluído com sucesso!");
        fetchItens(); // Atualiza a lista após a exclusão
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o item. Tente novamente mais tarde.");
      }
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Lista de Eletrodomésticos</h1>
        <button className="form-button success flex items-center gap-2" onClick={handleNovoCadastro}>
          <Plus size={18} />
          Novo Cadastro
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Data Cadastro</th>
              <th>Quantidade</th>
              <th>Valor</th>
              <th>Caminhão</th>
              <th>Estado de Conservação</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length > 0 ? (
              itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.descricao}</td>
                  <td>{item.data_cadastro}</td>
                  <td>{item.quantidade}</td>
                  <td>{formatCurrency(Number(item.valor))}</td>
                  <td>{item.caminhao}</td>
                  <td>{item.estadoConservacao}</td>
                  <td>{item.situacao}</td>
                  <td>
                    <div className="actions flex gap-2">
                      <button
                        className="action-button edit"
                        onClick={() => handleEditar(item.id!)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-button view"
                        onClick={() => handleDetalhes(item.id!)}
                        title="Detalhes"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleExcluir(item.id!)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  Nenhum item encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Eletrodomesticos;
