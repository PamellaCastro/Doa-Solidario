import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Tag } from "lucide-react";
import type { SubCategoria } from "../../types/SubCategoria";
import { Categoria } from "../../types/Item";
import { SubCategoriaService } from "../../services/SubCategoriaService";

const GerenciamentoCategoria: React.FC = () => {
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSubCategoria, setEditingSubCategoria] =
    useState<SubCategoria | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SubCategoria>({
    descricao: "",
    categoria: Categoria.ELETRONICO,
  });

  useEffect(() => {
    carregarSubCategorias();
  }, []);

  const carregarSubCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SubCategoriaService.listarTodos();
      setSubCategorias(data);
    } catch (err) {
      setError("Erro ao carregar subcategorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingSubCategoria) {
        await SubCategoriaService.atualizar(editingSubCategoria.id!, formData);
        alert("Subcategoria atualizada com sucesso!");
      } else {
        await SubCategoriaService.criar(formData);
        alert("Subcategoria cadastrada com sucesso!");
      }

      await carregarSubCategorias();
      resetForm();
    } catch (err) {
      setError("Erro ao salvar subcategoria");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subCategoria: SubCategoria) => {
    setEditingSubCategoria(subCategoria);
    setFormData({ ...subCategoria });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta subcategoria?")) return;

    try {
      await SubCategoriaService.deletar(id);
      alert("Subcategoria excluída com sucesso!");
      await carregarSubCategorias();
    } catch (err) {
      alert("Erro ao excluir subcategoria");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: "",
      categoria: Categoria.ELETRONICO,
    });
    setEditingSubCategoria(null);
    setShowModal(false);
  };

  const filteredSubCategorias = subCategorias.filter(
    (subCategoria) =>
      subCategoria.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subCategoria.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCategoria = (categoria: Categoria): string => {
    const categorias: Record<Categoria, string> = {
      [Categoria.ELETRONICO]: "Eletrônico",
      [Categoria.ELETRODOMESTICO]: "Eletrodoméstico",
      [Categoria.MOVEL]: "Móvel",
      [Categoria.TEXTIL]: "Têxtil",
    };
    return categorias[categoria] || categoria;
  };

  const getCategoriaColor = (categoria: Categoria): string => {
    const cores: Record<Categoria, string> = {
      [Categoria.ELETRONICO]: "bg-primary",
      [Categoria.ELETRODOMESTICO]: "bg-success",
      [Categoria.MOVEL]: "bg-warning",
      [Categoria.TEXTIL]: "bg-danger",
    };
    return cores[categoria] || "bg-secondary";
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-xl font-bold text-primary mb-0">
          <Tag size={24} className="me-2" />
          Gerenciamento de Subcategorias
        </h2>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Nova Subcategoria
        </button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Busca */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubCategorias.length > 0 ? (
              filteredSubCategorias.map((subCategoria) => (
                <tr key={subCategoria.id}>
                  <td>{subCategoria.descricao}</td>
                  <td>
                    <span
                      className={`badge ${getCategoriaColor(
                        subCategoria.categoria
                      )} text-white`}
                    >
                      {formatCategoria(subCategoria.categoria)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(subCategoria)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(subCategoria.id!)}
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
                <td colSpan={3} className="text-center py-4">
                  Nenhuma subcategoria encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingSubCategoria
                    ? "Editar Subcategoria"
                    : "Nova Subcategoria"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="descricao" className="form-label">
                        Descrição *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleInputChange}
                        placeholder="Ex: Smartphones, Geladeiras, Sofás..."
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="categoria" className="form-label">
                        Categoria *
                      </label>
                      <select
                        className="form-select"
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                      >
                        {Object.values(Categoria).map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {formatCategoria(categoria)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Salvando...
                      </>
                    ) : editingSubCategoria ? (
                      "Atualizar"
                    ) : (
                      "Cadastrar"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciamentoCategoria;
