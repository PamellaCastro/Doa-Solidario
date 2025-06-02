import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { getItens, deleteItem, Item } from "../../../services/ItemService";

function Moveis() {
  const [moveis, setMoveis] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoveis();
  }, []);

  const fetchMoveis = async () => {
    try {
      // Busca os itens filtrados pela categoria "MOVEIS"
      const data = await getItens("MOVEL");
      setMoveis(data);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar móveis:", error);
      setError("Erro ao buscar móveis. Tente novamente mais tarde.");
    }
  };

  const handleNovoCadastro = () => {
    navigate("/categorias/moveis/novo");
  };

  const handleEditar = (id: number) => {
    navigate(`/categorias/moveis/editar/${id}`);
  };

  const handleDetalhes = (id: number) => {
    navigate(`/categorias/moveis/detalhes/${id}`);
  };

  const handleExcluir = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await deleteItem(id);
        alert("Item excluído com sucesso!");
        // Atualiza a lista após a exclusão
        fetchMoveis();
      } catch (error) {
        console.error("Erro ao excluir item:", error);
        alert("Erro ao excluir o item. Tente novamente.");
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
        <h1 className="text-2xl font-bold text-primary">Lista de Móveis</h1>
        <button
          className="form-button success flex items-center gap-2"
          onClick={handleNovoCadastro}
        >
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
            {moveis.length > 0 ? (
              moveis.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.descricao}</td>
                  <td>{item.data_cadastro}</td>
                  <td>{item.quantidade}</td>
                  <td>{formatCurrency(item.valor)}</td>
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
                  Nenhum móvel encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Moveis;
