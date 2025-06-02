import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/transferir (1).png"

function QueroDoar() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    descricao: "",
    categoria: "",
    quantidade: 1,
    estadoConservacao: "",
    anexo: null as File | null,
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        anexo: e.target.files[0],
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    //Implementar envio do form para o back
    alert("Obrigado pela sua doação! Entraremos em contato em breve.")
    navigate("/login")
  }

  const handleVoltar = () => {
    navigate("/login")
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo">
          <img src={logo || "/placeholder.svg"} alt="Bairro da Juventude" />
          <h1>BAIRRO DA JUVENTUDE</h1>
        </div>
        <button className="form-button secondary" onClick={handleVoltar}>
          Voltar
        </button>
      </div>

      <div className="login-content" style={{ alignItems: "flex-start" }}>
        <div className="form-container" style={{ width: "100%", maxWidth: "800px" }}>
          <h2 className="form-title">Formulário de Doação</h2>
          <p className="mb-4">
            Sua doação faz a diferença! Preencha o formulário abaixo para doar itens para nossa instituição.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  className="form-input"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  className="form-input"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Categoria</label>
                <select
                  name="categoria"
                  className="form-select"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Eletrodomésticos">Eletrodomésticos</option>
                  <option value="Móveis">Móveis</option>
                  <option value="Têxteis">Têxteis</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label form-label-required">Descrição do Item</label>
                <textarea
                  name="descricao"
                  className="form-input"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={4}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Quantidade</label>
                <input
                  type="number"
                  name="quantidade"
                  className="form-input"
                  value={formData.quantidade}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Estado de Conservação</label>
                <select
                  name="estadoConservacao"
                  className="form-select"
                  value={formData.estadoConservacao}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o estado</option>
                  <option value="Novo">Novo</option>
                  <option value="Seminovo">Seminovo</option>
                  <option value="Usado em bom estado">Usado em bom estado</option>
                  <option value="Usado com marcas de uso">Usado com marcas de uso</option>
                  <option value="Precisa de reparos">Precisa de reparos</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Anexar Foto (opcional)</label>
                <input type="file" name="anexo" className="form-input" onChange={handleFileChange} accept="image/*" />
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-6">
              <button type="button" className="form-button secondary" onClick={handleVoltar}>
                Cancelar
              </button>
              <button type="submit" className="form-button">
                Enviar Doação
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QueroDoar
