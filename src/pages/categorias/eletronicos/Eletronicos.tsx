import { useEffect, useState } from 'react'
import { getEletronicos, deleteEletronico } from '../../../services/ItemService'
import { useNavigate } from 'react-router-dom'

function Eletronicos() {
  const [eletronicos, setEletronicos] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchEletronicos()
  }, [])

  const fetchEletronicos = async () => {
    try {
      const data = await getEletronicos()
      setEletronicos(data)
    } catch (error) {
      console.error('Erro ao buscar eletrônicos:', error)
    }
  }

  const handleNovoCadastro = () => {
    navigate('/categorias/eletronicos/novo')
  }

  const handleEditar = (id: number) => {
    navigate(`/categorias/eletronicos/editar/${id}`)
  }

  const handleDetalhes = (id: number) => {
    navigate(`/categorias/eletronicos/detalhes/${id}`)
  }

  const handleExcluir = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteEletronico(id)
        alert('Item excluído com sucesso!')
        fetchEletronicos()
      } catch (error) {
        console.error('Erro ao excluir:', error)
        alert('Erro ao excluir o item.')
      }
    }
  }

  return (
    <div>
      <h1>Lista de Eletrônicos</h1>
      <button onClick={handleNovoCadastro}>Novo Cadastro</button>
      <table border={1} cellPadding={5} style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Data Cadastro</th>
            <th>Quantidade</th>
            <th>Valor</th>
            <th>Caminhão</th>
            <th>Categoria</th>
            <th>Estado de Conservação</th>
            <th>Situação</th>
            <th>Anexo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {eletronicos.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.descricao}</td>
              <td>{item.data_cadastro}</td>
              <td>{item.quantidade}</td>
              <td>{item.valor}</td>
              <td>{item.caminhao}</td>
              <td>{item.categoria}</td>
              <td>{item.estadoConservacao}</td>
              <td>{item.situacao}</td>
              <td>
                {item.anexo ? (
                  <a href={item.anexo} target="_blank" rel="noopener noreferrer">
                    Ver Anexo
                  </a>
                ) : (
                  'Sem anexo'
                )}
              </td>
              <td>
                {}
                <details>
                  <summary style={{ cursor: 'pointer' }}>⋮</summary>
                  <button onClick={() => handleEditar(item.id)}>Editar</button><br />
                  <button onClick={() => handleDetalhes(item.id)}>Detalhes</button><br />
                  <button onClick={() => handleExcluir(item.id)}>Excluir</button>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Eletronicos
