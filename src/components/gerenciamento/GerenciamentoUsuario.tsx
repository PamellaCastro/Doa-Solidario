import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Users } from "lucide-react";
import type { Usuario } from "../../types/Usuario";
import { PerfilAcesso } from "../../types/Usuario";
import { UsuarioService } from "../../services/UsuarioService";

const GerenciamentoUsuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Usuario>({
    nome: "",
    cpf: 0,
    dataNascimento: "",
    email: "",
    senha: "",
    perfilAcesso: PerfilAcesso.MD_SOCIAL,
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UsuarioService.listarTodos();
      setUsuarios(data);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value.replace(/\D/g, "")),
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
      if (editingUsuario) {
        await UsuarioService.atualizar(editingUsuario.id!, formData);
        alert("Usuário atualizado com sucesso!");
      } else {
        await UsuarioService.criar(formData);
        alert("Usuário cadastrado com sucesso!");
      }

      await carregarUsuarios();
      resetForm();
    } catch (err) {
      setError("Erro ao salvar usuário");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({ ...usuario });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await UsuarioService.deletar(id);
      alert("Usuário excluído com sucesso!");
      await carregarUsuarios();
    } catch (err) {
      alert("Erro ao excluir usuário");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf: 0,
      dataNascimento: "",
      email: "",
      senha: "",
      perfilAcesso: PerfilAcesso.MD_SOCIAL,
    });
    setEditingUsuario(null);
    setShowModal(false);
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cpf.toString().includes(searchTerm)
  );

  const formatCpf = (cpf: number): string => {
    const cpfStr = cpf.toString().padStart(11, "0");
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPerfilAcesso = (perfil: PerfilAcesso): string => {
    const perfis: Record<PerfilAcesso, string> = {
      [PerfilAcesso.ADMIN]: "Administrador",
      [PerfilAcesso.MD_ELETRONICO]: "Moderador Eletrônico",
      [PerfilAcesso.MD_ELETRODOMESTICO]: "Moderador Eletrodoméstico",
      [PerfilAcesso.MD_TEXIL]: "Moderador Têxtil",
      [PerfilAcesso.MD_MOVEL]: "Moderador Móvel",
      [PerfilAcesso.MD_SOCIAL]: "Moderador Social",
    };
    return perfis[perfil] || perfil;
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
          <Users size={24} className="me-2" />
          Gerenciamento de Usuários
        </h2>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Novo Usuário
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
            placeholder="Buscar por nome, email ou CPF..."
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
              <th>Data Nascimento</th>
              <th>Perfil de Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{formatCpf(usuario.cpf)}</td>
                  <td>{usuario.email}</td>
                  <td>
                    {new Date(usuario.dataNascimento).toLocaleDateString(
                      "pt-BR"
                    )}
                  </td>
                  <td>
                    <span className="badge bg-primary">
                      {formatPerfilAcesso(usuario.perfilAcesso)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(usuario)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(usuario.id!)}
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
                  Nenhum usuário encontrado
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
                  {editingUsuario ? "Editar Usuário" : "Novo Usuário"}
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
                        value={
                          formData.cpf === 0 ? "" : formData.cpf.toString()
                        }
                        onChange={handleInputChange}
                        placeholder="00000000000"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="dataNascimento" className="form-label">
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
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

                    <div className="col-md-6">
                      <label htmlFor="senha" className="form-label">
                        Senha *
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        required={!editingUsuario}
                        placeholder={
                          editingUsuario
                            ? "Deixe em branco para manter a senha atual"
                            : ""
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="perfilAcesso" className="form-label">
                        Perfil de Acesso *
                      </label>
                      <select
                        className="form-select"
                        id="perfilAcesso"
                        name="perfilAcesso"
                        value={formData.perfilAcesso}
                        onChange={handleInputChange}
                        required
                      >
                        {Object.values(PerfilAcesso).map((perfil) => (
                          <option key={perfil} value={perfil}>
                            {formatPerfilAcesso(perfil)}
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
                    ) : editingUsuario ? (
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

export default GerenciamentoUsuario;
