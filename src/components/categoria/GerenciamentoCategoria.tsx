import type React from "react";
import { useState, useEffect } from "react";
import { X, PlusCircle, Edit } from "lucide-react";


const CATEGORIAS_ENUM = [
  "ELETRONICO",
  "ELETRODOMESTICO",
  "TEXIL", 
  "MOVEL",
];

// --- Interfaces para tipagem (AJUSTADAS para o enum Categoria) ---
interface Subcategoria {
  id?: number; 
  descricao: string; 
  categoria: string; 
}

const API_SUBCATEGORIA_BASE_URL = "http://localhost:8080/api/sub";


function GerenciamentoCategoria() { 
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]); 

  const [novaSubcategoria, setNovaSubcategoria] = useState<Subcategoria>({
    descricao: "",
    categoria: "", 
  });
  const [mostrarFormularioSubcategoria, setMostrarFormularioSubcategoria] = useState(false);
  const [subcategoriaEmEdicao, setSubcategoriaEmEdicao] = useState<Subcategoria | null>(null);

  // --- Efeitos para Carregar Subcategorias ---
  useEffect(() => {
    fetchSubcategorias();
  }, []);

  const fetchSubcategorias = async () => {
    try {
      const response = await fetch(API_SUBCATEGORIA_BASE_URL);
      if (!response.ok) {
        throw new Error("Erro ao buscar subcategorias");
      }
      const data: Subcategoria[] = await response.json();
      setSubcategorias(data);
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      alert("Erro ao carregar lista de subcategorias.");
    }
  };

  // --- Funções de Manipulação para Subcategoria ---

  const handleChangeSubcategoria = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (subcategoriaEmEdicao) {
      setSubcategoriaEmEdicao((prev: Subcategoria | null) => {
        if (!prev) return null;
        return { ...prev, [name]: value };
      });
    } else {
      setNovaSubcategoria((prev: Subcategoria) => {
        return { ...prev, [name]: value };
      });
    }
  };


  const handleSubmitSubcategoria = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentSubcategoria = subcategoriaEmEdicao || novaSubcategoria;

    if (!currentSubcategoria.descricao || !currentSubcategoria.categoria) {
      alert("Por favor, preencha a descrição e selecione uma categoria principal.");
      return;
    }

    try {
      let response;
      const dataToSend = {
          descricao: currentSubcategoria.descricao,
          categoria: currentSubcategoria.categoria
      };

      if (subcategoriaEmEdicao) {
        response = await fetch(`${API_SUBCATEGORIA_BASE_URL}/${subcategoriaEmEdicao.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) throw new Error("Erro ao atualizar subcategoria");
        alert("Subcategoria atualizada com sucesso!");
      } else {
        response = await fetch(API_SUBCATEGORIA_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) throw new Error("Erro ao cadastrar subcategoria");
        alert("Subcategoria cadastrada com sucesso!");
      }

      await fetchSubcategorias(); 
      handleCancelarEdicaoSubcategoria(); 
    } catch (error) {
      console.error("Erro ao salvar subcategoria:", error);
      alert(`Erro ao salvar subcategoria: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEditarSubcategoria = (sub: Subcategoria) => {
    setSubcategoriaEmEdicao({ ...sub });
    setNovaSubcategoria({ ...sub }); 
    setMostrarFormularioSubcategoria(true);
  };

  const handleCancelarEdicaoSubcategoria = () => {
    setSubcategoriaEmEdicao(null);
    setNovaSubcategoria({
      descricao: "",
      categoria: "",
    });
    setMostrarFormularioSubcategoria(false);
  };

  const handleRemoverSubcategoria = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta subcategoria?")) {
      try {
        const response = await fetch(`${API_SUBCATEGORIA_BASE_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao remover subcategoria");

        alert("Subcategoria removida com sucesso!");
        await fetchSubcategorias(); 
      } catch (error) {
        console.error("Erro ao remover subcategoria:", error);
        alert(`Erro ao remover subcategoria: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  const groupedSubcategories = CATEGORIAS_ENUM.reduce((acc, categoriaNome) => {
    acc[categoriaNome] = {
      nome: categoriaNome,
      subcategorias: subcategorias.filter(sub => sub.categoria === categoriaNome)
    };
    return acc;
  }, {} as Record<string, { nome: string, subcategorias: Subcategoria[] }>);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Gerenciamento de Categorias e Subcategorias</h2>
        <button className="form-button success" onClick={() => {
           if (mostrarFormularioSubcategoria) {
      handleCancelarEdicaoSubcategoria();
    } else {
      setMostrarFormularioSubcategoria(true);
    }
        }}>
          {mostrarFormularioSubcategoria ? "Cancelar" : "Nova Subcategoria"}
        </button>
      </div>

      {mostrarFormularioSubcategoria && (
        <div className="form-container mb-6">
          <h3 className="form-title">{subcategoriaEmEdicao ? "Editar Subcategoria" : "Cadastrar Nova Subcategoria"}</h3>
          <form onSubmit={handleSubmitSubcategoria}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Categoria Principal</label>
                <select
                  name="categoria"
                  className="form-select"
                  value={subcategoriaEmEdicao ? subcategoriaEmEdicao.categoria : novaSubcategoria.categoria}
                  onChange={handleChangeSubcategoria}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIAS_ENUM.map((catName) => (
                    <option key={catName} value={catName}>
                      {catName.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nome da Subcategoria</label>
                <input
                  type="text"
                  name="descricao"
                  className="form-input"
                  value={subcategoriaEmEdicao ? subcategoriaEmEdicao.descricao : novaSubcategoria.descricao}
                  onChange={handleChangeSubcategoria}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="form-button secondary" onClick={handleCancelarEdicaoSubcategoria}>
                Cancelar
              </button>
              <button type="submit" className="form-button success">
                {subcategoriaEmEdicao ? "Atualizar Subcategoria" : "Cadastrar Subcategoria"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {Object.values(groupedSubcategories).every(cat => cat.subcategorias.length === 0) && CATEGORIAS_ENUM.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma categoria ou subcategoria encontrada.</p>
        ) : (
            CATEGORIAS_ENUM.map((catName) => {
                const categoriaComSub = groupedSubcategories[catName];

                return (
                    <div key={categoriaComSub.nome} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">{categoriaComSub.nome.replace(/_/g, ' ')}</h3>
                        {categoriaComSub.subcategorias.length > 0 ? (
                            <table className="data-table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome da Subcategoria</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriaComSub.subcategorias.map((sub) => (
                                        <tr key={sub.id}>
                                            <td>{sub.id}</td>
                                            <td>{sub.descricao}</td>
                                            <td>
                                                <div className="actions">
                                                    <button className="action-button edit" title="Editar" onClick={() => handleEditarSubcategoria(sub)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="action-button delete"
                                                        title="Remover"
                                                        onClick={() => sub.id && handleRemoverSubcategoria(sub.id)}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">Nenhuma subcategoria cadastrada para {categoriaComSub.nome.replace(/_/g, ' ')}.</p>
                        )}
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}

export default GerenciamentoCategoria;