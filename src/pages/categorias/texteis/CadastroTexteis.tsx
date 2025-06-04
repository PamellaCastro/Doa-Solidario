import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, MapPin, User, Package2 } from "lucide-react";
import StepIndicator from "../../../components/StepForm/StepIndicador";
import { createItem } from "../../../services/ItemService";

const steps = [
  { title: "Informações do Doador", description: "Dados de contato" },
  { title: "Detalhes do Item", description: "Características do Moveis" },
  { title: "Localização", description: "Endereço para retirada" },
];

function CadastroMoveis() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // nomeDoador: "",
    // emailDoador: "",
    // telefoneDoador: "",
    // documentoDoador: "",


    descricao: "",
    data_cadastro: new Date().toISOString().split("T")[0],
    quantidade: 1,
    valor: 0,
    caminhao: "",
    categoria: "TEXIL",
    subcategoria: "",
    estadoConservacao: "",
    situacao: "Disponível",
    anexo: null as File | null,


    // cep: "",
    // endereco: "",
    // numero: "",
    // complemento: "",
    // bairro: "",
    // cidade: "",
    // estado: "",
    // pontoReferencia: "",
    // disponibilidadeRetirada: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files) return;

    if (e.target.files.length > 0) {
      setFormData({ ...formData, anexo: e.target.files[0] });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/categorias/textil");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "anexo" && value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      if (formData.anexo) {
        formDataToSend.append("anexo", formData.anexo);
      }

      await createItem(formDataToSend);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/categorias/textil");
      }, 3000);
    } catch (error) {
      console.error("Erro ao cadastrar têxtil:", error);
      alert("Ocorreu um erro ao cadastrar o têxtil. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep1 = () => {
    //return formData.nomeDoador && formData.telefoneDoador;
  };

  const validateStep2 = () => {
    return formData.descricao && formData.estadoConservacao && formData.quantidade > 0;
  };

  const validateStep3 = () => {
    //return formData.endereco && formData.cidade && formData.estado;
  };

  const renderStep1 = () => {
    return (
      // <div className="form-step">
      //   <div className="card-header d-flex align-items-center mb-4">
      //     <User size={20} className="me-2 text-primary" />
      //     <h5 className="card-title mb-0">Informações do Doador</h5>
      //   </div>

      //   <div className="row g-3">
      //     <div className="col-md-6">
      //       <div className="form-group">
      //         <label className="form-label form-label-required">Nome Completo</label>
      //         <input
      //           type="text"
      //           className="form-input"
      //           name="nomeDoador"
      //           value={formData.nomeDoador}
      //           onChange={handleChange}
      //           required
      //         />
      //       </div>
      //     </div>

      //     <div className="col-md-6">
      //       <div className="form-group">
      //         <label className="form-label">Documento (CPF/CNPJ)</label>
      //         <input
      //           type="text"
      //           className="form-input"
      //           name="documentoDoador"
      //           value={formData.documentoDoador}
      //           onChange={handleChange}
      //         />
      //       </div>
      //     </div>

      //     <div className="col-md-6">
      //       <div className="form-group">
      //         <label className="form-label form-label-required">Telefone</label>
      //         <input
      //           type="tel"
      //           className="form-input"
      //           name="telefoneDoador"
      //           value={formData.telefoneDoador}
      //           onChange={handleChange}
      //           required
      //         />
      //       </div>
      //     </div>

      //     <div className="col-md-6">
      //       <div className="form-group">
      //         <label className="form-label">E-mail</label>
      //         <input
      //           type="email"
      //           className="form-input"
      //           name="emailDoador"
      //           value={formData.emailDoador}
      //           onChange={handleChange}
      //         />
      //       </div>
      //     </div>
      //   </div>

      <div className="form-step-buttons">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          <ArrowLeft size={16} className="me-2" />
          Voltar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={nextStep}
        //disabled={!validateStep1()}
        >
          Próximo
        </button>
      </div>
      // </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="form-step">
        <div className="card-header d-flex align-items-center mb-4">
          <Package2 size={20} className="me-2 text-primary" />
          <h5 className="card-title mb-0">Detalhes do Têxtil</h5>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label form-label-required">Descrição</label>
              <input
                type="text"
                className="form-input"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label form-label-required">Data Cadastro</label>
                <input
                  type="text"
                  className="form-input"
                  name="dataCadastro"
                  value={formData.data_cadastro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label form-label-required">Quantidade</label>
                <input
                  type="number"
                  className="form-input"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Situação</label>
              <select
                className="form-select"
                name="situacao"
                value={formData.situacao}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="ABERTO">Aberto</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="DEPOSITADO">Depositado</option>
                <option value="VENDIDO">Vendido</option>
                <option value="SOLICITADO">Solicitado</option>
                <option value="DOADO">Doado</option>
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Valor Estimado (R$)</label>
              <input
                type="number"
                className="form-input"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label form-label-required">Estado de Conservação</label>
              <select
                className="form-select"
                name="estadoConservacao"
                value={formData.estadoConservacao}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="BOM">Bom</option>
                <option value="REGULAR">Regular</option>
                <option value="RUIM">Ruim</option>

              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label form-label-required">Categoria</label>
              <select
                className="form-select"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="ELETRONICO">Eletrônico</option>
                <option value="ELETRODOMESTICO">Eletrodoméstico</option>
                <option value="TEXIL">Têxtil</option>
                <option value="MOVEL">Móvel</option>
              </select>
            </div>
          </div>


          <div className="col-12">
            <div className="form-group">
              <label className="form-label">Foto do Item</label>
              <input
                type="file"
                className="form-input"
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="form-help-text">
                Adicione uma foto do têxtil para facilitar a identificação.
              </div>
            </div>
          </div>
        </div>

        <div className="form-step-buttons">
          <button type="button" className="btn btn-outline" onClick={prevStep}>
            <ArrowLeft size={16} className="me-2" />
            Voltar
          </button>
          <button type="button" className="btn btn-primary" onClick={nextStep} disabled={!validateStep2()}>
            Próximo
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
     return (
      //  <div className="form-step">
      //    <div className="card-header d-flex align-items-center mb-4">
      //      <MapPin size={20} className="me-2 text-primary" />
      //      <h5 className="card-title mb-0">Localização para Retirada</h5>
      //    </div>
 
      //    <div className="row g-3">
      //      <div className="col-md-4">
      //        <div className="form-group">
      //          <label className="form-label">CEP</label>
      //          <input type="text" className="form-input" name="cep" value={formData.cep} onChange={handleChange} />
      //        </div>
      //      </div>
 
      //      <div className="col-md-8">
      //        <div className="form-group">
      //          <label className="form-label form-label-required">Endereço</label>
      //          <input
      //            type="text"
      //            className="form-input"
      //            name="endereco"
      //            value={formData.endereco}
      //            onChange={handleChange}
      //            required
      //          />
      //        </div>
      //      </div>
 
      //      <div className="col-md-4">
      //        <div className="form-group">
      //          <label className="form-label">Número</label>
      //          <input type="text" className="form-input" name="numero" value={formData.numero} onChange={handleChange} />
      //        </div>
      //      </div>
 
      //      <div className="col-md-8">
      //        <div className="form-group">
      //          <label className="form-label">Complemento</label>
      //          <input
      //            type="text"
      //            className="form-input"
      //            name="complemento"
      //            value={formData.complemento}
      //            onChange={handleChange}
      //          />
      //        </div>
      //      </div>
 
      //      <div className="col-md-4">
      //        <div className="form-group">
      //          <label className="form-label">Bairro</label>
      //          <input type="text" className="form-input" name="bairro" value={formData.bairro} onChange={handleChange} />
      //        </div>
      //      </div>
 
      //      <div className="col-md-4">
      //        <div className="form-group">
      //          <label className="form-label form-label-required">Cidade</label>
      //          <input
      //            type="text"
      //            className="form-input"
      //            name="cidade"
      //            value={formData.cidade}
      //            onChange={handleChange}
      //            required
      //          />
      //        </div>
      //      </div>
 
      //      <div className="col-md-4">
      //        <div className="form-group">
      //          <label className="form-label form-label-required">Estado</label>
      //          <select
      //            className="form-select"
      //            name="estado"
      //            value={formData.estado}
      //            onChange={handleChange}
      //            required
      //          >
      //            <option value="">Selecione</option>
      //            <option value="AC">Acre</option>
      //            <option value="AL">Alagoas</option>
      //            <option value="AP">Amapá</option>
      //            <option value="AM">Amazonas</option>
      //            <option value="BA">Bahia</option>
      //            <option value="CE">Ceará</option>
      //            <option value="DF">Distrito Federal</option>
      //            <option value="ES">Espírito Santo</option>
      //            <option value="GO">Goiás</option>
      //            <option value="MA">Maranhão</option>
      //            <option value="MT">Mato Grosso</option>
      //            <option value="MS">Mato Grosso do Sul</option>
      //            <option value="MG">Minas Gerais</option>
      //            <option value="PA">Pará</option>
      //            <option value="PB">Paraíba</option>
      //            <option value="PR">Paraná</option>
      //            <option value="PE">Pernambuco</option>
      //            <option value="PI">Piauí</option>
      //            <option value="RJ">Rio de Janeiro</option>
      //            <option value="RN">Rio Grande do Norte</option>
      //            <option value="RS">Rio Grande do Sul</option>
      //            <option value="RO">Rondônia</option>
      //            <option value="RR">Roraima</option>
      //            <option value="SC">Santa Catarina</option>
      //            <option value="SP">São Paulo</option>
      //            <option value="SE">Sergipe</option>
      //            <option value="TO">Tocantins</option>
      //          </select>
      //        </div>
      //      </div>
 
      //      <div className="col-12">
      //        <div className="form-group">
      //          <label className="form-label">Ponto de Referência</label>
      //          <input
      //            type="text"
      //            className="form-input"
      //            name="pontoReferencia"
      //            value={formData.pontoReferencia}
      //            onChange={handleChange}
      //          />
      //        </div>
      //      </div>
 
      //      <div className="col-12">
      //        <div className="form-group">
      //          <label className="form-label">Disponibilidade para Retirada</label>
      //          <textarea
      //            className="form-textarea"
      //            name="disponibilidadeRetirada"
      //            value={formData.disponibilidadeRetirada}
      //            onChange={handleChange}
      //            placeholder="Ex: Segunda a sexta, das 9h às 18h"
      //            rows={3}
      //          ></textarea>
      //        </div>
      //      </div>
      //    </div>

         <div className="form-step-buttons">
           <button type="button" className="btn btn-outline" onClick={prevStep}>
             <ArrowLeft size={16} className="me-2" />
             Voltar
           </button>
           <button
             type="submit"
             className="btn btn-primary"
             //disabled={isSubmitting || !validateStep3()}
             onClick={handleSubmit}
           >
             {isSubmitting ? (
               <>
                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                 Salvando...
               </>
             ) : (
               <>
                 <Save size={16} className="me-2" />
                 Finalizar Cadastro
               </>
             )}
           </button>
         </div>
      //  </div>
     );
   };

  const renderStep = () => {
    if (showSuccess) {
      return (
        <div className="form-success">
          <div className="form-success-icon">
            <Save size={32} />
          </div>
          <h2 className="form-success-title">Cadastro Realizado com Sucesso!</h2>
          <p className="form-success-message">
            O Têxtil foi cadastrado com sucesso no sistema.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/categorias/textil")}>
            Voltar para Lista
          </button>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
       case 3:
         return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold text-primary mb-0">Cadastro de Têxtil</h1>
        <button className="btn btn-outline" onClick={() => navigate("/categorias/movel")}>
          <ArrowLeft size={16} className="me-2" />
          Voltar para Lista
        </button>
      </div>

      <div className="card">
        <div className="card-content p-4">
          <StepIndicator currentStep={currentStep} steps={steps} />
          <div className="form-steps-container">{renderStep()}</div>
        </div>
      </div>
    </div>
  );
}

export default CadastroMoveis;
