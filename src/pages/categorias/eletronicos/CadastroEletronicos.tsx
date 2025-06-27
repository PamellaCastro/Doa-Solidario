import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormularioItem from "../../../components/formularios/FormularioItem"
import { ItemService } from "../../../services/ItemService"
import type { Item, Categoria, EstadoConservacao, Situacao } from "../../../types/Item"

const CadastroEletronicos: React.FC = () => {
  const navigate = useNavigate()

  const [item, setItem] = useState<Item>({
    descricao: "",
    quantidade: 1,
    valor: 0,
    caminhao: false,
    categoria: "ELETRONICO" as Categoria,
    estadoConservacao: "" as EstadoConservacao,
    situacao: "ABERTO" as Situacao,
    data_cadastro: new Date().toISOString().split("T")[0],
    subCategoria: undefined,
    pessoadoador: undefined,
    pessoabeneficiario: undefined,
  })

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target

    if (name.includes('.')) { 
      const [parent, child] = name.split('.')
      setItem((prevItem) => ({
        ...prevItem,
        [parent]: {
          ...(prevItem as any)[parent],
          [child]: value,
        },
      }))
    } else if (name === "caminhao") {
      setItem((prevItem) => ({
        ...prevItem,
        [name]: (value === "true" || value === true), 
      }))
    } else if (name === "quantidade" || name === "valor") {
      setItem((prevItem) => ({
        ...prevItem,
        [name]: Number(value),
      }))
    } else if (name === "pessoadoador" || name === "pessoabeneficiario") {
    
      setItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }))
    }
    else {
      setItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // DAVA ERRO, INVESTIGAR NO FUTURO (NÃO APAGAR)
    // Validação adicional antes de enviar
    if (!item.pessoadoador || typeof item.pessoadoador.id !== 'number' || item.pessoadoador.id <= 0) {
      setError("Por favor, selecione uma pessoa doadora válida.")
      setIsSubmitting(true)
      return
    }

    try {
      await ItemService.criar(item)
      alert("Eletrônico cadastrado com sucesso!")

      setItem({
        descricao: "",
        quantidade: 1,
        valor: 0,
        caminhao: false,
        categoria: "ELETRONICO" as Categoria,
        estadoConservacao: "" as EstadoConservacao,
        situacao: "ABERTO" as Situacao,
        data_cadastro: new Date().toISOString().split("T")[0],
        subCategoria: undefined,
        pessoadoador: undefined,
        pessoabeneficiario: undefined,
      })

      navigate("/categorias/eletronicos")
    } catch (err) {
      console.error("Erro ao cadastrar eletrônico:", err)
      setError("Erro ao cadastrar eletrônico. Verifique os dados e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Cadastrar Novo Eletrônico</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/categorias/eletronicos")}>
          Voltar para Lista
        </button>
      </div>

      <FormularioItem
        item={item}
        onChange={handleChange}
        onSubmit={handleSubmit}
        modo="cadastro"
        error={error}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default CadastroEletronicos