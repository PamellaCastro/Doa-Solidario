import type React from "react";
import { useState, useEffect } from "react";
import { X, PlusCircle, Edit } from "lucide-react";

// --- Interfaces para tipagem ---
interface Pessoa {
  id?: number;
  nome: string;
  cpf: string; 
  email: string;
}

// URL base da sua API para PESSOA
const API_BASE_URL = "http://localhost:8080/api/pessoa";

function GerenciamentoPessoa() { 
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [novaPessoa, setNovaPessoa] = useState<Pessoa>({
    nome: "",
    cpf: "",
    email: "",
  });
  const [mostrarFormularioPessoa, setMostrarFormularioPessoa] = useState(false);
  const [pessoaEmEdicao, setPessoaEmEdicao] = useState<Pessoa | null>(null);

  // --- Efeitos para Carregar Pessoas ---
  useEffect(() => {
    fetchPessoas();
  }, []);

  const fetchPessoas = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Erro ao buscar pessoas");
      }
      const data: Pessoa[] = await response.json();
      const adjustedData = data.map(p => ({
          ...p,
          cpf: String(p.cpf).padStart(11, '0'), 
      }));
      setPessoas(adjustedData);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
      alert("Erro ao carregar lista de pessoas.");
    }
  };

  // --- Funções de Manipulação para Pessoa ---

  const handleChangePessoa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (pessoaEmEdicao) {
      setPessoaEmEdicao((prev: Pessoa | null) => {
        if (!prev) return null;
        if (name === "cpf") {
          const cleanedValue = value.replace(/\D/g, '').substring(0, 11);
          return { ...prev, [name]: cleanedValue };
        } else {
          return { ...prev, [name]: value };
        }
      });
    } else {
      setNovaPessoa((prev: Pessoa) => {
        if (name === "cpf") {
          const cleanedValue = value.replace(/\D/g, '').substring(0, 11);
          return { ...prev, [name]: cleanedValue };
        } else {
          return { ...prev, [name]: value };
        }
      });
    }
  };


  const handleSubmitPessoa = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentPessoa = pessoaEmEdicao || novaPessoa;

    if (!currentPessoa.nome || !currentPessoa.cpf || !currentPessoa.email) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (currentPessoa.cpf.length !== 11) {
        alert("O CPF deve conter exatamente 11 dígitos.");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(currentPessoa.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    const pessoaToSend = {
      ...currentPessoa,
      cpf: parseInt(currentPessoa.cpf, 10),
    };

    try {
      let response;
      if (pessoaEmEdicao) {
        response = await fetch(`${API_BASE_URL}/${pessoaEmEdicao.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pessoaToSend),
        });
        if (!response.ok) throw new Error("Erro ao atualizar pessoa");
        alert("Pessoa atualizada com sucesso!");
      } else {
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pessoaToSend),
        });
        if (!response.ok) throw new Error("Erro ao cadastrar pessoa");
        alert("Pessoa cadastrada com sucesso!");
      }

      await fetchPessoas(); 
      handleCancelarEdicaoPessoa();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
      alert(`Erro ao salvar pessoa: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEditarPessoa = (pessoa: Pessoa) => {
    setPessoaEmEdicao({ ...pessoa });
    setNovaPessoa({ ...pessoa }); 
    setMostrarFormularioPessoa(true);
  };

  const handleCancelarEdicaoPessoa = () => {
    setPessoaEmEdicao(null);
    setNovaPessoa({
      nome: "",
      cpf: "",
      email: "",
    });
    setMostrarFormularioPessoa(false);
  };

  const handleRemoverPessoa = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta pessoa?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao remover pessoa");

        alert("Pessoa removida com sucesso!");
        await fetchPessoas(); 
      } catch (error) {
        console.error("Erro ao remover pessoa:", error);
        alert(`Erro ao remover pessoa: ${error instanceof Error ? error.message : String(error)}`);
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
        <h2 className="text-2xl font-bold text-primary">Gerenciamento de Pessoas</h2>
        <button className="form-button success" onClick={() => {
          if (mostrarFormularioPessoa) {
      handleCancelarEdicaoPessoa();
    } else {
      setMostrarFormularioPessoa(true);
    }
        }}>
          {mostrarFormularioPessoa ? "Cancelar" : "Nova Pessoa"}
        </button>
      </div>

      {mostrarFormularioPessoa && (
        <div className="form-container mb-6">
          <h3 className="form-title">{pessoaEmEdicao ? "Editar Pessoa" : "Cadastrar Nova Pessoa"}</h3>
          <form onSubmit={handleSubmitPessoa}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="nome"
                  className="form-input"
                  value={pessoaEmEdicao ? pessoaEmEdicao.nome : novaPessoa.nome}
                  onChange={handleChangePessoa}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">CPF (Somente números)</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-input"
                  value={pessoaEmEdicao ? pessoaEmEdicao.cpf : novaPessoa.cpf}
                  onChange={handleChangePessoa}
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
                  value={pessoaEmEdicao ? pessoaEmEdicao.email : novaPessoa.email}
                  onChange={handleChangePessoa}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="form-button secondary" onClick={handleCancelarEdicaoPessoa}>
                Cancelar
              </button>
              <button type="submit" className="form-button success">
                {pessoaEmEdicao ? "Atualizar Pessoa" : "Cadastrar Pessoa"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        {pessoas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma pessoa cadastrada.</p>
        ) : (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.map((pessoa) => (
                        <tr key={pessoa.id}>
                            <td>{pessoa.id}</td>
                            <td>{pessoa.nome}</td>
                            <td>{formatCpf(pessoa.cpf)}</td>
                            <td>{pessoa.email}</td>
                            <td>
                                <div className="actions">
                                    <button className="action-button edit" title="Editar" onClick={() => handleEditarPessoa(pessoa)}>
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="action-button delete"
                                        title="Remover"
                                        onClick={() => pessoa.id && handleRemoverPessoa(pessoa.id)}
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

export default GerenciamentoPessoa;