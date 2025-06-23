import type React from "react"
import { useNavigate } from "react-router-dom"
import ListaGenericaIntegrada from "../../../components/formularios/ListaGenerica"
import { Categoria, type Item } from "../../../types/Item"

const Eletronicos: React.FC = () => {
  const navigate = useNavigate()

  const handleEdit = (item: Item) => {
    navigate(`/categorias/eletronicos/editar/${item.id}`)
  }

  const handleView = (item: Item) => {
    navigate(`/categorias/eletronicos/detalhes/${item.id}`)
  }

  const handleAdd = () => {
    navigate("/categorias/eletronicos/novo")
  }

  return (
    <ListaGenericaIntegrada
      categoria={Categoria.ELETRONICO}
      titulo="Eletrônicos"
      onEdit={handleEdit}
      onView={handleView}
      onAdd={handleAdd}
    />
  )
}

export default Eletronicos
