import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";
import type { Pessoa } from "../../types/Pessoa";
import { Estado } from "../../types/Endereco";
import { PessoaService } from "../../services/PessoaService";

const GerenciamentoPessoa: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Pessoa>({
    nome: "",
    cpf: "",
    email: "",
    endereco: {
      cidade: "",
      cep: "",
      rua: "",
      numero: 0,
      estado: Estado.SC,
    },
  });

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PessoaService.listarTodos();
      setPessoas(data);
    } catch (err) {
      setError("Erro ao carregar pessoas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const enderecoField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco!,
          [enderecoField]: enderecoField === "numero" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingPessoa) {
        await PessoaService.atualizar(editingPessoa.id!, formData);
        alert("Pessoa atualizada com sucesso!");
      } else {
        await PessoaService.criar(formData);
        alert("Pessoa cadastrada com sucesso!");
      }

      await carregarPessoas();
      resetForm();
    } catch (err) {
      setError("Erro ao salvar pessoa");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa);
    setFormData({ ...pessoa });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta pessoa?")) return;

    try {
      await PessoaService.deletar(id);
      alert("Pessoa excluída com sucesso!");
      await carregarPessoas();
    } catch (err) {
      alert("Erro ao excluir pessoa");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      endereco: {
        cidade: "",
        cep: "",
        rua: "",
        numero: 0,
        estado: Estado.SC,
      },
    });
    setEditingPessoa(null);
    setShowModal(false);
  };

  const filteredPessoas = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.cpf.includes(searchTerm) ||
      pessoa.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <User size={24} className="me-2" />
          Gerenciamento de Pessoas
        </h2>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Nova Pessoa
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
            placeholder="Buscar por nome, CPF ou email..."
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
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPessoas.length > 0 ? (
              filteredPessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.email}</td>
                  <td>{pessoa.endereco?.cidade || "N/A"}</td>
                  <td>{pessoa.endereco?.estado || "N/A"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(pessoa)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(pessoa.id!)}
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
                <td colSpan={6} className="text-center py-4">
                  Nenhuma pessoa encontrada
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPessoa ? "Editar Pessoa" : "Nova Pessoa"}
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
                      <label htmlFor="nome" className="form-label">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cpf" className="form-label">
                        CPF *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <h6 className="text-secondary mt-3 mb-2">Endereço</h6>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.cidade" className="form-label">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.cidade"
                        name="endereco.cidade"
                        value={formData.endereco?.cidade || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.cep" className="form-label">
                        CEP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.cep"
                        name="endereco.cep"
                        value={formData.endereco?.cep || ""}
                        onChange={handleInputChange}
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="endereco.rua" className="form-label">
                        Rua *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.rua"
                        name="endereco.rua"
                        value={formData.endereco?.rua || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.numero" className="form-label">
                        Número
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="endereco.numero"
                        name="endereco.numero"
                        value={formData.endereco?.numero || ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.estado" className="form-label">
                        Estado *
                      </label>
                      <select
                        className="form-select"
                        id="endereco.estado"
                        name="endereco.estado"
                        value={formData.endereco?.estado || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione o estado</option>
                        {Object.values(Estado).map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
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
                    ) : editingPessoa ? (
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

export default GerenciamentoPessoa;
