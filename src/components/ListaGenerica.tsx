import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItens, deleteItem, Item, Categoria } from "../services/ItemService";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";

interface ListaGenericaProps {
  categoriaApi: Categoria; 
  titulo: string;
  rotaBase: string;
}

const ListaGenerica: React.FC<ListaGenericaProps> = ({ categoriaApi, titulo, rotaBase }) => {
  const [itens, setItens] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItens();
  }, [categoriaApi]);

  const fetchItens = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItens(categoriaApi);
      setItens(data);
    } catch (err) {
      console.error(`Erro ao buscar itens da categoria ${categoriaApi}:`, err);
      setError("Erro ao buscar itens. Por favor, tente novamente mais tarde.");
      setItens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoCadastro = () => navigate(`${rotaBase}/novo`);
  const handleEditar = (id: number) => navigate(`${rotaBase}/editar/${id}`);
  const handleDetalhes = (id: number) => navigate(`${rotaBase}/detalhes/${id}`);

  const handleExcluir = async (id?: number) => {
    if (!id) return;
    if (confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await deleteItem(id);
        alert("Item excluído com sucesso!");
        fetchItens();
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir o item. Tente novamente mais tarde.");
      }
    }
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number | undefined): string =>
    (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Lista de {titulo}</h1>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
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

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table data-table">
            <thead>
              <tr>
                <th className="text-center">Ações</th>
                {/* <th>ID</th> */}
                <th>Descrição</th>
                <th>Data Cadastro</th>
                <th>Quantidade do Item</th>
                <th>Valor</th>
                <th>Caminhão</th>
                <th>Categoria</th>
                <th>Estado de Conservação</th>
                <th>Situação</th>
                
              </tr>
            </thead>
            <tbody>
              {itens.length > 0 ? (
                itens.map((item) => (
                  <tr key={item.id}>
                    <div className="actions d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEditar(item.id!)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleDetalhes(item.id!)}
                          title="Detalhes"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleExcluir(item.id)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    {/* <td>{item.id}</td> */}
                    <td>{item.descricao}</td>
                    <td>{formatDate(item.data_cadastro)}</td>
                    <td>{item.quantidade}</td>
                    <td>{formatCurrency(item.valor)}</td>
                    <td>{item.caminhao}</td>
                    <td>{item.categoria}</td>
                    <td>{item.estadoConservacao}</td>
                    <td>{item.situacao}</td>
                    <td className="text-center">
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    Nenhum item encontrado. Clique em "Novo Cadastro" para adicionar um.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaGenerica;
