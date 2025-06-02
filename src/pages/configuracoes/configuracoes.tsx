import type React from "react"

import { useState } from "react"
import { User, Shield, Bell, Database, Save, X } from "lucide-react"

// Simulação de dados de usuários
const mockUsuarios = [
  {
    id: 1,
    nome: "Admin",
    email: "admin@bairrodajuventude.org",
    cargo: "Administrador",
    permissoes: ["eletronicos", "eletrodomesticos", "moveis", "texteis", "social", "configuracoes"],
  },
  {
    id: 2,
    nome: "João Silva",
    email: "joao@bairrodajuventude.org",
    cargo: "Coordenador de Eletrônicos",
    permissoes: ["eletronicos"],
  },
  {
    id: 3,
    nome: "Maria Santos",
    email: "maria@bairrodajuventude.org",
    cargo: "Coordenadora de Têxteis",
    permissoes: ["texteis"],
  },
]

function Configuracoes() {
  const [activeTab, setActiveTab] = useState("usuarios")
  const [usuarios, setUsuarios] = useState(mockUsuarios)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    permissoes: [] as string[],
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  
  const [configuracoes, setConfiguracoes] = useState({
    nomeInstituicao: "Bairro da Juventude",
    emailContato: "contato@bairrodajuventude.org",
    telefoneContato: "(48) 3333-4444",
    enderecoInstituicao: "Rua Exemplo, 123 - Criciúma, SC",
    notificacoesEmail: true,
    backupAutomatico: true,
    intervaloBackup: "diario",
  })

  const handleChangeUsuario = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNovoUsuario({
      ...novoUsuario,
      [name]: value,
    })
  }

  const handleChangePermissao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    if (checked) {
      setNovoUsuario({
        ...novoUsuario,
        permissoes: [...novoUsuario.permissoes, value],
      })
    } else {
      setNovoUsuario({
        ...novoUsuario,
        permissoes: novoUsuario.permissoes.filter((p) => p !== value),
      })
    }
  }

  const handleSubmitUsuario = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulando envio para API
    const novoUsuarioCompleto = {
      ...novoUsuario,
      id: usuarios.length + 1,
    }

    setUsuarios([...usuarios, novoUsuarioCompleto])
    setNovoUsuario({
      nome: "",
      email: "",
      senha: "",
      cargo: "",
      permissoes: [],
    })
    setMostrarFormulario(false)
    alert("Usuário cadastrado com sucesso!")
  }

  const handleChangeConfiguracao = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setConfiguracoes({
      ...configuracoes,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmitConfiguracoes = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulando envio para API
    alert("Configurações salvas com sucesso!")
  }

  const handleRemoverUsuario = (id: number) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      setUsuarios(usuarios.filter((user) => user.id !== id))
      alert("Usuário removido com sucesso!")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Configurações do Sistema</h1>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "usuarios" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
          onClick={() => setActiveTab("usuarios")}
        >
          <User size={16} className="inline mr-2" />
          Usuários
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "sistema" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
          onClick={() => setActiveTab("sistema")}
        >
          <Shield size={16} className="inline mr-2" />
          Sistema
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "notificacoes" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
          onClick={() => setActiveTab("notificacoes")}
        >
          <Bell size={16} className="inline mr-2" />
          Notificações
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "backup" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
          onClick={() => setActiveTab("backup")}
        >
          <Database size={16} className="inline mr-2" />
          Backup
        </button>
      </div>

      {activeTab === "usuarios" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
            <button className="form-button success" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
              {mostrarFormulario ? "Cancelar" : "Novo Usuário"}
            </button>
          </div>

          {mostrarFormulario && (
            <div className="form-container mb-6">
              <h3 className="form-title">Cadastrar Novo Usuário</h3>
              <form onSubmit={handleSubmitUsuario}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      className="form-input"
                      value={novoUsuario.nome}
                      onChange={handleChangeUsuario}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={novoUsuario.email}
                      onChange={handleChangeUsuario}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      name="senha"
                      className="form-input"
                      value={novoUsuario.senha}
                      onChange={handleChangeUsuario}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cargo</label>
                    <input
                      type="text"
                      name="cargo"
                      className="form-input"
                      value={novoUsuario.cargo}
                      onChange={handleChangeUsuario}
                      required
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <label className="form-label">Permissões</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value="eletronicos"
                          checked={novoUsuario.permissoes.includes("eletronicos")}
                          onChange={handleChangePermissao}
                        />
                        Eletrônicos
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value="eletrodomesticos"
                          checked={novoUsuario.permissoes.includes("eletrodomesticos")}
                          onChange={handleChangePermissao}
                        />
                        Eletrodomésticos
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value="moveis"
                          checked={novoUsuario.permissoes.includes("moveis")}
                          onChange={handleChangePermissao}
                        />
                        Móveis
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value="texteis"
                          checked={novoUsuario.permissoes.includes("texteis")}
                          onChange={handleChangePermissao}
                        />
                        Têxteis
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value="social"
                          checked={novoUsuario.permissoes.includes("social")}
                          onChange={handleChangePermissao}
                        />
                        Social
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value="configuracoes"
                          checked={novoUsuario.permissoes.includes("configuracoes")}
                          onChange={handleChangePermissao}
                        />
                        Configurações
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" className="form-button secondary" onClick={() => setMostrarFormulario(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="form-button success">
                    Cadastrar Usuário
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cargo</th>
                  <th>Permissões</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.cargo}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {usuario.permissoes.map((permissao) => (
                          <span
                            key={permissao}
                            className="inline-block px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs"
                          >
                            {permissao}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="action-button edit" title="Editar">
                          <User size={16} />
                        </button>
                        <button
                          className="action-button delete"
                          title="Remover"
                          onClick={() => handleRemoverUsuario(usuario.id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "sistema" && (
        <div className="form-container">
          <h2 className="form-title">Configurações do Sistema</h2>
          <form onSubmit={handleSubmitConfiguracoes}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nome da Instituição</label>
                <input
                  type="text"
                  name="nomeInstituicao"
                  className="form-input"
                  value={configuracoes.nomeInstituicao}
                  onChange={handleChangeConfiguracao}
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail de Contato</label>
                <input
                  type="email"
                  name="emailContato"
                  className="form-input"
                  value={configuracoes.emailContato}
                  onChange={handleChangeConfiguracao}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone de Contato</label>
                <input
                  type="text"
                  name="telefoneContato"
                  className="form-input"
                  value={configuracoes.telefoneContato}
                  onChange={handleChangeConfiguracao}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Endereço da Instituição</label>
                <input
                  type="text"
                  name="enderecoInstituicao"
                  className="form-input"
                  value={configuracoes.enderecoInstituicao}
                  onChange={handleChangeConfiguracao}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" className="form-button success flex items-center gap-2">
                <Save size={18} />
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "notificacoes" && (
        <div className="form-container">
          <h2 className="form-title">Configurações de Notificações</h2>
          <form onSubmit={handleSubmitConfiguracoes}>
            <div className="form-group">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notificacoesEmail"
                  checked={configuracoes.notificacoesEmail}
                  onChange={handleChangeConfiguracao}
                />
                Receber notificações por e-mail
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Receba notificações por e-mail quando novos pedidos forem registrados.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" className="form-button success flex items-center gap-2">
                <Save size={18} />
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "backup" && (
        <div className="form-container">
          <h2 className="form-title">Configurações de Backup</h2>
          <form onSubmit={handleSubmitConfiguracoes}>
            <div className="form-group">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="backupAutomatico"
                  checked={configuracoes.backupAutomatico}
                  onChange={handleChangeConfiguracao}
                />
                Realizar backup automático
              </label>
              <p className="text-sm text-gray-600 mt-1">
                O sistema realizará backups automáticos dos dados conforme o intervalo configurado.
              </p>
            </div>

            {configuracoes.backupAutomatico && (
              <div className="form-group mt-4">
                <label className="form-label">Intervalo de Backup</label>
                <select
                  name="intervaloBackup"
                  className="form-select"
                  value={configuracoes.intervaloBackup}
                  onChange={handleChangeConfiguracao}
                >
                  <option value="diario">Diário</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button type="button" className="form-button flex items-center gap-2">
                <Database size={18} />
                Realizar Backup Manual
              </button>

              <button type="submit" className="form-button success flex items-center gap-2">
                <Save size={18} />
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Configuracoes
