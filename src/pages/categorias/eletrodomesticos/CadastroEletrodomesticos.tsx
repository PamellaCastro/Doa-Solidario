import { useState } from 'react'
import { createEletrodomestico } from '../../../services/ItemService'
import { useNavigate } from 'react-router-dom'

function CadastroEletrodomestico() {
  const [descricao, setDescricao] = useState('')
  const [dataCadastro, setDataCadastro] = useState('')
  const [quantidade, setQuantidade] = useState<number>(1)
  const [valor, setValor] = useState<number>(0)
  const [caminhao, setCaminhao] = useState('')
  const [categoria] = useState('Eletrodomésticos') // fixo
  const [estadoConservacao, setEstadoConservacao] = useState('')
  const [situacao, setSituacao] = useState('')
  const [anexo, setAnexo] = useState<File | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('descricao', descricao)
    formData.append('data_cadastro', dataCadastro)
    formData.append('quantidade', String(quantidade))
    formData.append('valor', String(valor))
    formData.append('caminhao', caminhao)
    formData.append('categoria', categoria)
    formData.append('estadoConservacao', estadoConservacao)
    formData.append('situacao', situacao)
    if (anexo) {
      formData.append('anexo', anexo)
    }

    try {
      await createEletrodomestico(formData)
      alert('Cadastrado com sucesso!')
      navigate('/categorias/eletrodomesticos')
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAnexo(e.target.files[0])
    }
  }

  return (
    <div>
      <h1>Cadastrar Eletrodoméstico</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <input type="date" value={dataCadastro} onChange={(e) => setDataCadastro(e.target.value)} required />
        <input type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} required />
        <input type="number" step="0.01" placeholder="Valor" value={valor} onChange={(e) => setValor(Number(e.target.value))} required />
        <input type="text" placeholder="Caminhão" value={caminhao} onChange={(e) => setCaminhao(e.target.value)} />
        <input type="text" placeholder="Estado de Conservação" value={estadoConservacao} onChange={(e) => setEstadoConservacao(e.target.value)} required />
        <input type="text" placeholder="Situação" value={situacao} onChange={(e) => setSituacao(e.target.value)} required />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}

export default CadastroEletrodomestico
