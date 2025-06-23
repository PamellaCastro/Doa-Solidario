import type React from "react"
import { useNavigate } from "react-router-dom"
import ListaGenericaIntegrada from "../../../components/formularios/ListaGenerica"
import { Categoria, type Item } from "../../../types/Item"

const Eletrodomesticos: React.FC = () => {
  const navigate = useNavigate()

  const handleEdit = (item: Item) => {
    navigate(`/categorias/eletrodomesticos/editar/${item.id}`)
  }

  const handleView = (item: Item) => {
    navigate(`/categorias/eletrodomesticos/detalhes/${item.id}`)
  }

  const handleAdd = () => {
    navigate("/categorias/eletrodomesticos/novo")
  }

  return (
    <ListaGenericaIntegrada
      categoria={Categoria.ELETRODOMESTICO}
      titulo="Eletrodomésticos"
      onEdit={handleEdit}
      onView={handleView}
      onAdd={handleAdd}
    />
  )
}

export default Eletrodomesticos
