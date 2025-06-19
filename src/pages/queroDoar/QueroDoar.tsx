"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, User, MapPin, Package, ArrowLeft, ArrowRight } from "lucide-react"

const API_URL = "http://localhost:8080/api/item"

interface FormData {
  // Dados da Pessoa
  nome: string
  cpf: string
  email: string

  // Dados do Endereço
  cidade: string
  cep: string
  rua: string
  numero: string
  estado: string

  // Dados do Item
  descricao: string
  quantidade: number | string
  data_cadastro: string
  caminhao: string
  valor: number | string
  categoria: string
  situacao: string
  estadoConservacao: string
}

const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

const categorias = [
  { value: "ELETRONICO", label: "Eletrônico" },
  { value: "ELETRODOMESTICO", label: "Eletrodoméstico" },
  { value: "MOVEL", label: "Móvel" },
  { value: "TEXTIL", label: "Têxtil" },
]

const situacoes = [
  { value: "ABERTO", label: "Aberto" },
  { value: "EM_ANDAMENTO", label: "Em Andamento" },
  { value: "DEPOSITADO", label: "Depositado" },
  { value: "SOLICITADO", label: "Solicitado" },
  { value: "DOADO", label: "Doado" },
]

const estadosConservacao = [
  { value: "BOM", label: "Bom" },
  { value: "REGULAR", label: "Regular" },
  { value: "RUIM", label: "Ruim" },
]

export default function FormularioDoacao() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    cidade: "",
    cep: "",
    rua: "",
    numero: "",
    estado: "",
    descricao: "",
    quantidade: "",
    data_cadastro: new Date().toISOString().split("T")[0],
    caminhao: "",
    valor: "",
    categoria: "",
    situacao: "",
    estadoConservacao: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "valor") {
      const numeric = value.replace(/[^\d]/g, "")
      const valorNumber = Number(numeric) / 100
      setFormData((prev) => ({ ...prev, [name]: valorNumber }))
    } else if (name === "quantidade") {
      const val = value === "" ? "" : Number(value)
      setFormData((prev) => ({ ...prev, [name]: val }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.nome && formData.cpf && formData.email)
      case 2:
        return !!(formData.cidade && formData.rua && formData.estado)
      case 3:
        return !!(formData.descricao && formData.quantidade && formData.categoria && formData.estadoConservacao)
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsSubmitting(true)

    const payload = {
      descricao: formData.descricao,
      quantidade: Number(formData.quantidade) || 0,
      valor: Number(formData.valor) || 0,
      caminhao: formData.caminhao === "true",
      categoria: formData.categoria,
      situacao: formData.situacao || "ABERTO",
      estadoConservacao: formData.estadoConservacao,
      data_cadastro: formData.data_cadastro,
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert("Item cadastrado com sucesso!")
        navigate("/login")
      } else {
        alert("Erro ao cadastrar item. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro na API:", error)
      alert("Erro ao conectar com a API.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: User },
    { number: 2, title: "Endereço", icon: MapPin },
    { number: 3, title: "Item para Doação", icon: Package },
  ]

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/login")}>
              ← Voltar ao Login
            </button>
            <h1 className="display-5 fw-bold text-dark mb-0 flex-grow-1">Formulário de Doação</h1>
            <div style={{ width: "140px" }}></div> {/* Spacer para centralizar o título */}
          </div>
          <p className="text-muted">Sua doação faz a diferença! Preencha os dados em etapas.</p>
        </div>

        {/* Stepper */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="d-flex align-items-center justify-content-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = currentStep > step.number
                const isCurrent = currentStep === step.number

                return (
                  <div key={step.number} className="d-flex align-items-center flex-fill">
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          isCompleted
                            ? "bg-success text-white"
                            : isCurrent
                              ? "bg-primary text-white"
                              : "bg-secondary text-white"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                      </div>
                      <small className={`mt-1 ${isCurrent ? "text-primary fw-bold" : "text-muted"}`}>
                        {step.title}
                      </small>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-fill mx-3">
                        <hr className={`${isCompleted ? "border-success" : "border-secondary"} border-2`} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="card-title mb-0">{steps[currentStep - 1].title}</h4>
                <small>
                  Etapa {currentStep} de {steps.length}
                </small>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Dados Pessoais */}
                  {currentStep === 1 && (
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
                          placeholder="Digite seu nome completo"
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
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Endereço */}
                  {currentStep === 2 && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="cidade" className="form-label">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          placeholder="Nome da cidade"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="cep" className="form-label">
                          CEP
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="rua" className="form-label">
                          Rua *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="rua"
                          name="rua"
                          value={formData.rua}
                          onChange={handleInputChange}
                          placeholder="Nome da rua"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="numero" className="form-label">
                          Número
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="numero"
                          name="numero"
                          value={formData.numero}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="estado" className="form-label">
                          Estado *
                        </label>
                        <select
                          className="form-select"
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o estado</option>
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Item para Doação */}
                  {currentStep === 3 && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="descricao" className="form-label">
                          Descrição do Item *
                        </label>
                        <textarea
                          className="form-control"
                          id="descricao"
                          name="descricao"
                          rows={3}
                          value={formData.descricao}
                          onChange={handleInputChange}
                          placeholder="Descreva o item que deseja doar"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="quantidade" className="form-label">
                          Quantidade *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="quantidade"
                          name="quantidade"
                          value={formData.quantidade === 0 ? "" : formData.quantidade}
                          onChange={handleInputChange}
                          placeholder="1"
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="valor" className="form-label">
                          Valor Estimado (R$)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="valor"
                          name="valor"
                          value={formData.valor === 0 || formData.valor === "" ? "" : formData.valor}
                          onChange={handleInputChange}
                          placeholder="0,00"
                        />
                      </div>
                      <div className="col-md-6">
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
                          <option value="">Selecione a categoria</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.value} value={categoria.value}>
                              {categoria.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="estadoConservacao" className="form-label">
                          Estado de Conservação *
                        </label>
                        <select
                          className="form-select"
                          id="estadoConservacao"
                          name="estadoConservacao"
                          value={formData.estadoConservacao}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o estado</option>
                          {estadosConservacao.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="situacao" className="form-label">
                          Situação
                        </label>
                        <select
                          className="form-select"
                          id="situacao"
                          name="situacao"
                          value={formData.situacao}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecione a situação</option>
                          {situacoes.map((situacao) => (
                            <option key={situacao.value} value={situacao.value}>
                              {situacao.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="caminhao" className="form-label">
                          Necessita Caminhão?
                        </label>
                        <select
                          className="form-select"
                          id="caminhao"
                          name="caminhao"
                          value={formData.caminhao}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecione</option>
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="data_cadastro" className="form-label">
                          Data de Cadastro
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="data_cadastro"
                          name="data_cadastro"
                          value={formData.data_cadastro}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-2"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft size={16} />
                      Anterior
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={nextStep}
                        disabled={!validateStep(currentStep)}
                      >
                        Próximo
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success d-flex align-items-center gap-2"
                        disabled={!validateStep(3) || isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Finalizar Doação"}
                        <Package size={16} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
