import React from "react";
import { Item, Categoria } from "../services/ItemService";
import { Save, XCircle } from "lucide-react";

interface FormularioItemProps {
  item: Item | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  modo: "cadastro" | "edicao";
  error: string | null;
  isSubmitting: boolean;
  disableCategoria?: boolean;
  disableDataCadastro?: boolean;
}

const FormularioItem: React.FC<FormularioItemProps> = ({
  item,
  onChange,
  onSubmit,
  modo,
  error,
  isSubmitting,
  disableCategoria = false,
  //disableDataCadastro = false,
}) => {
  if (!item && modo === "edicao") {
    // Isso deve ser tratado pelo componente pai que carrega os dados
    // Aqui, apenas garantimos que o item não é null para os inputs
    return null;
  }

  // Opções para select (mesmas em todas as categorias)
  const categorias: Categoria[] = ["ELETRONICO", "ELETRODOMESTICO", "MOVEL", "TEXIL"];
  const estadosConservacao = ["BOM", "REGULAR", "RUIM"];
  const situacoes = ["ABERTO", "EM_ANDAMENTO", "DEPOSITADO", "VENDIDO", "SOLICITADO", "DOADO"];

  return (
    <form onSubmit={onSubmit} className="card p-4">
      <div className="row">
        {/* Cada 'col-12 col-md-6' faz com que os campos ocupem 100% da largura em telas pequenas e 50% em telas médias e maiores */}
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="descricao" className="form-label">
            Descrição
          </label>
          <input
            type="text"
            className="form-control"
            id="descricao"
            name="descricao"
            value={item?.descricao || ""}
            onChange={onChange}
            required
            aria-label="Descrição do item"
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="quantidade" className="form-label">
            Quantidade
          </label>
          <input
            type="number"
            className="form-control"
            id="quantidade"
            name="quantidade"
            value={item?.quantidade ?? ""} 
            onChange={onChange}
            required
            min="0"
            aria-label="Quantidade do item"
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="valor" className="form-label">
            Valor (R$)
          </label>
          <input
            type="number"
            className="form-control"
            id="valor"
            name="valor"
            value={item?.valor ?? ""}
            onChange={onChange}
            required
            min="0"
            step="0.01"
            aria-label="Valor do item"
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="caminhao" className="form-label">
            Caminhão
          </label>
          <input
            type="text"
            className="form-control"
            id="caminhao"
            name="caminhao"
            value={item?.caminhao || ""}
            onChange={onChange}
            aria-label="Caminhão do item"
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="categoria" className="form-label">
            Categoria
          </label>
          <select
            className="form-select"
            id="categoria"
            name="categoria"
            value={item?.categoria || ""}
            onChange={onChange}
            required
            disabled={disableCategoria} 
            aria-label="Categoria do item"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="estadoConservacao" className="form-label">
            Estado de Conservação
          </label>
          <select
            className="form-select" 
            id="estadoConservacao"
            name="estadoConservacao"
            value={item?.estadoConservacao || ""}
            onChange={onChange}
            required
            aria-label="Estado de conservação do item"
          >
            <option value="">Selecione o estado</option>
            {estadosConservacao.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label htmlFor="situacao" className="form-label">
            Situação
          </label>
          <select
            className="form-select" 
            id="situacao"
            name="situacao"
            value={item?.situacao || ""}
            onChange={onChange}
            required
            aria-label="Situação do item"
          >
            <option value="">Selecione a situação</option>
            {situacoes.map((situ) => (
              <option key={situ} value={situ}>
                {situ}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 col-12"> {/* Este campo ocupa a largura total em todas as telas */}
          <label htmlFor="data_cadastro" className="form-label">
            Data de Cadastro
          </label>
          <input
            type="date"
            className="form-control"
            id="data_cadastro"
            name="data_cadastro"
            value={item?.data_cadastro || ""}
            onChange={onChange}
            //disabled={disableDataCadastro}
            aria-label="Data de cadastro do item"
          />
        </div>

        {error && (
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <XCircle size={20} className="me-2" />
              <div>{error}</div>
            </div>
          </div>
        )}

        <div className="col-12 mt-4 text-center"> 
          <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                {modo === "cadastro" ? "Cadastrar" : "Atualizar"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormularioItem;