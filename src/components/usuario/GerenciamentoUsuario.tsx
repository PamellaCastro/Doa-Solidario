// GerenciamentoUsuario.tsx
import type React from "react";
import { useState, useEffect } from "react";
import { X, PlusCircle, Edit } from "lucide-react";

// --- Interfaces para tipagem ---
interface Usuario {
  id?: number;
  nome: string;
  cpf: string; 
  dataNascimento: string; 
  email: string;
  senha?: string; 
  perfilAcesso: string; 
}

const API_BASE_URL = "http://localhost:8080/api/usuario"; 

// Opções de perfil de acesso (você pode buscar isso do backend se houver um endpoint)
const mockPerfisAcesso = ["ADMIN", "COORDENADOR", "OPERADOR", "VISUALIZADOR"]; // <<< AJUSTE SE TIVER UM ENUM OU LISTA DIFERENTE NO BACKEND

function GerenciamentoUsuario() { 
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [novoUsuario, setNovoUsuario] = useState<Usuario>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    senha: "",
    perfilAcesso: "",
  });
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<Usuario | null>(null);

  // --- Efeitos para Carregar Usuários ---
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }
      const data: Usuario[] = await response.json();
      
      const adjustedData = data.map(u => ({
          ...u,
          cpf: String(u.cpf).padStart(11, '0'), 
          dataNascimento: u.dataNascimento ? new Date(u.dataNascimento).toISOString().split('T')[0] : '' 

      }));
      setUsuarios(adjustedData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro ao carregar lista de usuários.");
    }
  };

  // --- Funções de Manipulação para Usuário ---

  const handleChangeUsuario = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (usuarioEmEdicao) {
      setUsuarioEmEdicao((prev: Usuario | null) => {
        if (!prev) return null;
        if (name === "cpf") {
          const cleanedValue = value.replace(/\D/g, '').substring(0, 11);
          return { ...prev, [name]: cleanedValue };
        } else {
          return { ...prev, [name]: value };
        }
      });
    } else {
      setNovoUsuario((prev: Usuario) => {
        if (name === "cpf") {
          const cleanedValue = value.replace(/\D/g, '').substring(0, 11);
          return { ...prev, [name]: cleanedValue };
        } else {
          return { ...prev, [name]: value };
        }
      });
    }
  };


  const handleSubmitUsuario = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUsuario = usuarioEmEdicao || novoUsuario;

    if (!currentUsuario.nome || !currentUsuario.cpf || !currentUsuario.email || !currentUsuario.dataNascimento || !currentUsuario.perfilAcesso) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (currentUsuario.cpf.length !== 11) {
        alert("O CPF deve conter exatamente 11 dígitos.");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(currentUsuario.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }
    if (!usuarioEmEdicao && !currentUsuario.senha) {
        alert("A senha é obrigatória para novos usuários.");
        return;
    }

    const usuarioToSend = {
      ...currentUsuario,
      cpf: parseInt(currentUsuario.cpf, 10), 
      dataNascimento: currentUsuario.dataNascimento, 
    };

    if (usuarioEmEdicao && !usuarioToSend.senha) {
        delete usuarioToSend.senha;
    }

    try {
      let response;
      if (usuarioEmEdicao) {
        response = await fetch(`${API_BASE_URL}/${usuarioEmEdicao.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioToSend),
        });
        if (!response.ok) throw new Error("Erro ao atualizar usuário");
        alert("Usuário atualizado com sucesso!");
      } else {
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioToSend),
        });
        if (!response.ok) throw new Error("Erro ao cadastrar usuário");
        alert("Usuário cadastrado com sucesso!");
      }

      await fetchUsuarios(); 
      handleCancelarEdicaoUsuario(); 
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert(`Erro ao salvar usuário: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioEmEdicao({ ...usuario });
    setNovoUsuario({ ...usuario, senha: "" });
    setMostrarFormularioUsuario(true);
  };

  const handleCancelarEdicaoUsuario = () => {
    setUsuarioEmEdicao(null);
    setNovoUsuario({
      nome: "",
      cpf: "",
      dataNascimento: "",
      email: "",
      senha: "",
      perfilAcesso: "",
    });
    setMostrarFormularioUsuario(false);
  };

  const handleRemoverUsuario = async (id: number) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao remover usuário");

        alert("Usuário removido com sucesso!");
        await fetchUsuarios();
      } catch (error) {
        console.error("Erro ao remover usuário:", error);
        alert(`Erro ao remover usuário: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  const formatCpf = (cpf: string | number) => {
    const cpfStr = String(cpf).padStart(11, '0');
    if (cpfStr.length !== 11) return cpfStr;
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Gerenciamento de Usuários</h2>
        <button className="form-button success" onClick={() => {
           if (mostrarFormularioUsuario) {
      handleCancelarEdicaoUsuario();
    } else {
      setMostrarFormularioUsuario(true);
    }
        }}>
          {mostrarFormularioUsuario ? "Cancelar" : "Novo Usuário"}
        </button>
      </div>

      {mostrarFormularioUsuario && (
        <div className="form-container mb-6">
          <h3 className="form-title">{usuarioEmEdicao ? "Editar Usuário" : "Cadastrar Novo Usuário"}</h3>
          <form onSubmit={handleSubmitUsuario}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="nome"
                  className="form-input"
                  value={usuarioEmEdicao ? usuarioEmEdicao.nome : novoUsuario.nome}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">CPF (Somente números)</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-input"
                  value={usuarioEmEdicao ? usuarioEmEdicao.cpf : novoUsuario.cpf}
                  onChange={handleChangeUsuario}
                  maxLength={11}
                  pattern="\d{11}"
                  title="O CPF deve conter exatamente 11 dígitos numéricos."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={usuarioEmEdicao ? usuarioEmEdicao.email : novoUsuario.email}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  className="form-input"
                  value={usuarioEmEdicao ? usuarioEmEdicao.dataNascimento : novoUsuario.dataNascimento}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha {usuarioEmEdicao ? "(deixe em branco para manter a atual)" : "*"}</label>
                <input
                  type="password"
                  name="senha"
                  className="form-input"
                  value={usuarioEmEdicao ? usuarioEmEdicao.senha || "" : novoUsuario.senha}
                  onChange={handleChangeUsuario}
                  required={!usuarioEmEdicao}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Perfil de Acesso</label>
                <select
                  name="perfilAcesso"
                  className="form-select"
                  value={usuarioEmEdicao ? usuarioEmEdicao.perfilAcesso : novoUsuario.perfilAcesso}
                  onChange={handleChangeUsuario}
                  required
                >
                  <option value="">Selecione um perfil</option>
                  {mockPerfisAcesso.map((perfil) => (
                    <option key={perfil} value={perfil}>
                      {perfil}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="form-button secondary" onClick={handleCancelarEdicaoUsuario}>
                Cancelar
              </button>
              <button type="submit" className="form-button success">
                {usuarioEmEdicao ? "Atualizar Usuário" : "Cadastrar Usuário"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        {usuarios.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum usuário cadastrado.</p>
        ) : (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Data Nasc.</th>
                        <th>E-mail</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nome}</td>
                            <td>{formatCpf(usuario.cpf)}</td>
                            <td>{usuario.dataNascimento}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.perfilAcesso}</td>
                            <td>
                                <div className="actions">
                                    <button className="action-button edit" title="Editar" onClick={() => handleEditarUsuario(usuario)}>
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="action-button delete"
                                        title="Remover"
                                        onClick={() => usuario.id && handleRemoverUsuario(usuario.id)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}

export default GerenciamentoUsuario; 