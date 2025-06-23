"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import ListaGenericaIntegrada from "../../../components/formularios/ListaGenerica"
import { Categoria, type Item } from "../../../types/Item"

const MoveisIntegrado: React.FC = () => {
  const navigate = useNavigate()

  const handleEdit = (item: Item) => {
    navigate(`/categorias/moveis/editar/${item.id}`)
  }

  const handleView = (item: Item) => {
    navigate(`/categorias/moveis/detalhes/${item.id}`)
  }

  const handleAdd = () => {
    navigate("/categorias/moveis/novo")
  }

  return (
    <ListaGenericaIntegrada
      categoria={Categoria.MOVEL}
      titulo="Móveis"
      onEdit={handleEdit}
      onView={handleView}
      onAdd={handleAdd}
    />
  )
}

export default MoveisIntegrado
