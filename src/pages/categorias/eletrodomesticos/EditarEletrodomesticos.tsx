import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getEletrodomesticoById, updateEletrodomestico } from "../../../services/ItemService"

function EditarEletrodomestico() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [descricao, setDescricao] = useState("")

  useEffect(() => {
    async function fetchItem() {
      if (id) {
        const item = await getEletrodomesticoById(Number(id))
        setDescricao(item.descricao)
      }
    }
    fetchItem()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateEletrodomestico(Number(id), { descricao })
      alert("Item atualizado com sucesso!")
      navigate("/categorias/eletrodomesticos")
    } catch (error) {
      console.error("Erro ao atualizar item:", error)
    }
  }

  return (
    <div>
      <h1>Editar Eletrodoméstico</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  )
}

export default EditarEletrodomestico
