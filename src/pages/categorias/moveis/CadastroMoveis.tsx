"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormularioItemIntegrado from "../../../components/formularios/FormularioItem"
import { ItemService } from "../../../services/ItemService"
import { type Item, Categoria, EstadoConservacao, Situacao } from "../../../types/Item"

const initialItemState: Item = {
  descricao: "",
  quantidade: 1,
  valor: 0,
  caminhao: false,
  categoria: Categoria.MOVEL, 
  estadoConservacao: EstadoConservacao.BOM, 
  situacao: Situacao.ABERTO, 
  data_cadastro: new Date().toISOString().split("T")[0],
}

const CadastroMovelIntegrado: React.FC = () => {
  const [item, setItem] = useState<Item>(initialItemState)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target

    if (name === "valor") {
      const onlyNumbers = value.replace(/[^\d]/g, "")
      const numericValue = Number(onlyNumbers) / 100
      setItem((prev) => ({ ...prev, valor: numericValue }))
    } else if (name === "caminhao") {
      setItem((prev) => ({ ...prev, caminhao: value === "true" }))
    } else if (type === "number" || name === "quantidade") {
      setItem((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    } else {
      setItem((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validações
      if (
        !item.descricao ||
        item.quantidade <= 0 ||
        item.valor <= 0 ||
        !item.estadoConservacao ||
        !item.situacao
      ) {
        setError("Por favor, preencha todos os campos obrigatórios.")
        return
      }

      if (!item.pessoa) {
        setError("Por favor, selecione uma pessoa.")
        return
      }

      await ItemService.criar(item)
      alert("Móvel cadastrado com sucesso!")
      navigate("/categorias/moveis")
    } catch (err) {
      console.error("Erro ao cadastrar móvel:", err)
      setError("Erro ao cadastrar móvel. Verifique os dados e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Cadastrar Novo Móvel</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/categorias/moveis")}>
          Voltar para Lista
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-12">
          <FormularioItemIntegrado
            item={item}
            onChange={handleChange}
            onSubmit={handleSubmit}
            modo="cadastro"
            error={error}
            isSubmitting={isSubmitting}
            disableCategoria={true}
            disableDataCadastro={true}
          />
        </div>
      </div>
    </div>
  )
}

export default CadastroMovelIntegrado