import type React from "react"
import { useNavigate } from "react-router-dom"
import ListaGenericaIntegrada from "../../../components/formularios/ListaGenerica"
import { Categoria, type Item } from "../../../types/Item"

const Texteis: React.FC = () => {
  const navigate = useNavigate()

  const handleEdit = (item: Item) => {
    navigate(`/categorias/texteis/editar/${item.id}`)
  }

  const handleView = (item: Item) => {
    navigate(`/categorias/texteis/detalhes/${item.id}`)
  }

  const handleAdd = () => {
    navigate("/categorias/texteis/novo")
  }

  return (
    <ListaGenericaIntegrada
      categoria={Categoria.TEXTIL}
      titulo="Têxteis"
      onEdit={handleEdit}
      onView={handleView}
      onAdd={handleAdd}
    />
  )
}

export default Texteis
