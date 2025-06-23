import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FormularioItemIntegrado from "../../../components/formularios/FormularioItem"
import { ItemService } from "../../../services/ItemService"
import type { Item } from "../../../types/Item"

const EditarMovel: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        try {
          const data = await ItemService.buscarPorId(Number(id))

          if (data.data_cadastro) {
            data.data_cadastro = new Date(data.data_cadastro).toISOString().split("T")[0]
          }

          setItem(data)
          setError(null)
        } catch (err) {
          console.error("Erro ao buscar móvel:", err)
          setError("Não foi possível carregar os dados do móvel para edição.")
          setItem(null)
        } finally {
          setLoading(false)
        }
      } else {
        setError("ID do móvel não fornecido.")
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (!item) return

    if (name === "valor") {
      const numericString = value.replace(/[^\d]/g, "")
      const numericValue = Number(numericString) / 100
      setItem((prev) => ({ ...prev!, valor: numericValue }))
    } else if (name === "caminhao") {
      setItem((prev) => ({ ...prev!, caminhao: value === "true" }))
    } else if (type === "number" || name === "quantidade") {
      setItem((prev) => ({ ...prev!, [name]: Number.parseFloat(value) || 0 }))
    } else {
      setItem((prev) => ({ ...prev!, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!item || !item.id) {
      setError("Item inválido para atualização.")
      setIsSubmitting(false)
      return
    }

    try {
      if (!item.descricao || item.quantidade <= 0 || item.valor <= 0 || !item.estadoConservacao || !item.situacao) {
        setError("Por favor, preencha todos os campos obrigatórios.")
        return
      }

      if (!item.pessoa) {
        setError("Por favor, selecione uma pessoa.")
        return
      }

      await ItemService.atualizar(item.id, item)
      alert("Móvel atualizado com sucesso!")
      navigate("/categorias/moveis")
    } catch (err) {
      console.error("Erro ao atualizar móvel:", err)
      setError("Erro ao atualizar móvel. Verifique os dados e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-danger" role="alert">
          <h4>Erro ao carregar móvel</h4>
          <p>{error || "Móvel não encontrado."}</p>
          <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/categorias/moveis")}>
            Voltar para a Lista
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Editar Móvel</h1>
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
            modo="edicao"
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

export default EditarMovel
