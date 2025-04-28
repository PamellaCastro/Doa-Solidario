import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEletrodomesticoById } from '../../../services/ItemService'

function DetalhesEletrodomestico() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    async function fetchItem() {
      if (id) {
        const data = await getEletrodomesticoById(Number(id))
        setItem(data)
      }
    }
    fetchItem()
  }, [id])

  if (!item) return <p>Carregando...</p>

  return (
    <div>
      <h1>Detalhes do Eletrodoméstico</h1>
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Descrição:</strong> {item.descricao}</p>
      <p><strong>Data Cadastro:</strong> {item.data_cadastro}</p>
      <p><strong>Quantidade:</strong> {item.quantidade}</p>
      <p><strong>Valor:</strong> {item.valor}</p>
      <p><strong>Caminhão:</strong> {item.caminhao}</p>
      <p><strong>Categoria:</strong> {item.categoria}</p>
      <p><strong>Estado de Conservação:</strong> {item.estadoConservacao}</p>
      <p><strong>Situação:</strong> {item.situacao}</p>
      <p><strong>Anexo:</strong> {item.anexo ? <a href={item.anexo}>Ver Anexo</a> : 'Sem anexo'}</p>
    </div>
  )
}

export default DetalhesEletrodomestico
