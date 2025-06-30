import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  User,
  MapPin,
  Package,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { ItemService } from "../../services/ItemService";
import { PessoaService } from "../../services/PessoaService";
import { SubCategoriaService } from "../../services/SubCategoriaService";
import {
  type Item,
  Categoria,
  EstadoConservacao,
  Situacao,
} from "../../types/Item";
import type { Pessoa } from "../../types/Pessoa";
import type { SubCategoria } from "../../types/SubCategoria";
import { Estado } from "../../types/Endereco";

interface FormData {
  // Dados da Pessoa
  nome: string;
  cpf: string;
  email: string;

  // Dados do Endereço
  cidade: string;
  cep: string;
  rua: string;
  numero: string;
  estado: string;

  // Dados do Item
  descricao: string;
  quantidade: number | string;
  data_cadastro: string;
  caminhao: string;
 // valor: number | string;
  categoria: string;
  situacao: string;
  estadoConservacao: string;
  subCategoriaId: string; // Para armazenar o ID da subcategoria selecionada
}

const estados = Object.values(Estado);

const categorias = [
  { value: Categoria.ELETRONICO, label: "Eletrônico" },
  { value: Categoria.ELETRODOMESTICO, label: "Eletrodoméstico" },
  { value: Categoria.MOVEL, label: "Móvel" },
  { value: Categoria.TEXTIL, label: "Têxtil" },
];

const situacoes = [
  { value: Situacao.ABERTO, label: "Aberto" },
  { value: Situacao.EM_ANDAMENTO, label: "Em Andamento" },
  { value: Situacao.DEPOSITADO, label: "Depositado" },
  { value: Situacao.SOLICITADO, label: "Solicitado" },
  { value: Situacao.DOADO, label: "Doado" },
];

const estadosConservacao = [
  { value: EstadoConservacao.BOM, label: "Bom" },
  { value: EstadoConservacao.REGULAR, label: "Regular" },
  { value: EstadoConservacao.RUIM, label: "Ruim" },
];

export default function QueroDoarIntegrado() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    cidade: "",
    cep: "",
    rua: "",
    numero: "",
    estado: "",
    descricao: "",
    quantidade: "",
    data_cadastro: new Date().toISOString().split("T")[0],
    caminhao: "",
    //valor: "",
    categoria: "",
    situacao: Situacao.ABERTO,
    estadoConservacao: "",
    subCategoriaId: "", 
  });

  const [todasSubCategorias, setTodasSubCategorias] = useState<SubCategoria[]>(
    []
  ); // Estado para todas as subcategorias
  const [subCategoriasDisponiveis, setSubCategoriasDisponiveis] = useState<
    SubCategoria[]
  >([]); // Estado para subcategorias filtradas

  // Efeito para carregar TODAS as subcategorias uma única vez no carregamento do componente
  useEffect(() => {
    const fetchTodasSubCategorias = async () => {
      try {
        const fetchedSubCategorias = await SubCategoriaService.listarTodos();
        setTodasSubCategorias(fetchedSubCategorias);
      } catch (error) {
        console.error("Erro ao carregar todas as subcategorias:", error);
        setTodasSubCategorias([]);
      }
    };
    fetchTodasSubCategorias();
  }, []); 

  // Efeito para filtrar as subcategorias disponíveis sempre que a categoria ou a lista completa muda
  useEffect(() => {
    if (formData.categoria && todasSubCategorias.length > 0) {
      const filtered = todasSubCategorias.filter(
        (subCat) => subCat.categoria === formData.categoria
      );
      setSubCategoriasDisponiveis(filtered);
      // Reseta a subcategoria selecionada se ela não estiver mais na lista filtrada
      if (
        !filtered.some((sc) => sc.id === Number(formData.subCategoriaId)) &&
        formData.subCategoriaId !== ""
      ) {
        setFormData((prev) => ({ ...prev, subCategoriaId: "" }));
      }
    } else {
      setSubCategoriasDisponiveis([]);
      setFormData((prev) => ({ ...prev, subCategoriaId: "" }));
    }
  }, [formData.categoria, todasSubCategorias]); // Dependências: categoria selecionada e a lista completa

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // if (name === "valor") {
    //   const numeric = value.replace(/[^\d,]/g, "").replace(",", "."); // Permite vírgula para decimal
    //   const valorNumber = Number(numeric);
    //   setFormData((prev) => ({ ...prev, [name]: valorNumber }));
    // }
      if (name === "quantidade") {
      const val = value === "" ? "" : Number(value);
      setFormData((prev) => ({ ...prev, [name]: val }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.nome && formData.cpf && formData.email);
      case 2:
        return !!(formData.cidade && formData.rua && formData.estado);
      case 3:
        // A validação da subCategoriaId só é necessária se houver subcategorias disponíveis para a categoria selecionada
        const isSubCategoriaRequired =
          formData.categoria && subCategoriasDisponiveis.length > 0;

        if (isSubCategoriaRequired) {
          return !!(
            formData.descricao &&
            formData.quantidade &&
            formData.categoria &&
            formData.estadoConservacao &&
            formData.subCategoriaId
          ); // Valida a subcategoria
        } else {
          return !!(
            formData.descricao &&
            formData.quantidade &&
            formData.categoria &&
            formData.estadoConservacao
          );
        }
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (!validateStep(currentStep)) {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      alert("Por favor, preencha todos os campos obrigatórios da etapa atual.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Primeiro, verifica se a pessoa já existe pelo CPF
      let pessoa: Pessoa;
      try {
        pessoa = await PessoaService.buscarPorCpf(formData.cpf);
        console.log("Pessoa encontrada:", pessoa);
      } catch (error) {
        // Se não existir, cria uma nova pessoa com endereço
        console.warn("Pessoa não encontrada, criando nova...", error);
        const novaPessoa: Pessoa = {
          nome: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          endereco: {
            cidade: formData.cidade,
            cep: formData.cep || undefined,
            rua: formData.rua,
            numero: formData.numero ? Number(formData.numero) : undefined,
            estado: formData.estado as Estado,
          },
        };

        pessoa = await PessoaService.criar(novaPessoa);
        console.log("Nova pessoa criada:", pessoa);
      }

      // Cria o item associado à pessoa
      const novoItem: Item = {
        descricao: formData.descricao,
        quantidade: Number(formData.quantidade) || 0,
        //valor: Number(formData.valor) || 0,
        caminhao: formData.caminhao === "true",
        categoria: formData.categoria as Categoria,
        situacao: (formData.situacao as Situacao) || Situacao.ABERTO,
        estadoConservacao: formData.estadoConservacao as EstadoConservacao,
        data_cadastro: formData.data_cadastro,
        pessoadoador: pessoa, 
        pessoabeneficiario: undefined, 
        subCategoria: {
          id: Number(formData.subCategoriaId),
        } as SubCategoria,
      };

      await ItemService.criar(novoItem);

      alert("Doação cadastrada com sucesso! Obrigado pela sua contribuição!");
      navigate("/login");
    } catch (error: any) {
      // Use 'any' para lidar com a tipagem de erro do Axios
      console.error("Erro ao cadastrar doação:", error);
      let errorMessage = "Erro ao cadastrar doação. Tente novamente.";

      if (error.response && error.response.data) {
        // Tenta pegar uma mensagem de erro mais específica do backend
        if (error.response.data.message) {
          errorMessage = `Erro: ${error.response.data.message}`;
        } else if (typeof error.response.data === "string") {
          errorMessage = `Erro do servidor: ${error.response.data}`;
        }
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: User },
    { number: 2, title: "Endereço", icon: MapPin },
    { number: 3, title: "Item para Doação", icon: Package },
  ];

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/login")}
            >
              ← Voltar ao Login
            </button>
            <h1 className="display-5 fw-bold text-dark mb-0 flex-grow-1">
              Formulário de Doação
            </h1>
            <div style={{ width: "140px" }}></div>
          </div>
          <p className="text-muted">
            Sua doação faz a diferença! Preencha os dados em etapas.
          </p>
        </div>

        {/* Stepper */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="d-flex align-items-center justify-content-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div
                    key={step.number}
                    className="d-flex align-items-center flex-fill"
                  >
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          isCompleted
                            ? "bg-success text-white"
                            : isCurrent
                            ? "bg-primary text-white"
                            : "bg-secondary text-white"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Icon size={20} />
                        )}
                      </div>
                      <small
                        className={`mt-1 ${
                          isCurrent ? "text-primary fw-bold" : "text-muted"
                        }`}
                      >
                        {step.title}
                      </small>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-fill mx-3">
                        <hr
                          className={`${
                            isCompleted ? "border-success" : "border-secondary"
                          } border-2`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="card-title mb-0">
                  {steps[currentStep - 1].title}
                </h4>
                <small>
                  Etapa {currentStep} de {steps.length}
                </small>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Dados Pessoais */}
                  {currentStep === 1 && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="nome" className="form-label">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          placeholder="Digite seu nome completo"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="cpf" className="form-label">
                          CPF *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cpf"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Endereço */}
                  {currentStep === 2 && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="cidade" className="form-label">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          placeholder="Nome da cidade"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="cep" className="form-label">
                          CEP
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="rua" className="form-label">
                          Rua *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="rua"
                          name="rua"
                          value={formData.rua}
                          onChange={handleInputChange}
                          placeholder="Nome da rua"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="numero" className="form-label">
                          Número
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="numero"
                          name="numero"
                          value={formData.numero}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="estado" className="form-label">
                          Estado *
                        </label>
                        <select
                          className="form-select"
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o estado</option>
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Item para Doação */}
                  {currentStep === 3 && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="descricao" className="form-label">
                          Descrição do Item *
                        </label>
                        <textarea
                          className="form-control"
                          id="descricao"
                          name="descricao"
                          rows={3}
                          value={formData.descricao}
                          onChange={handleInputChange}
                          placeholder="Descreva o item que deseja doar"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="quantidade" className="form-label">
                          Quantidade *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="quantidade"
                          name="quantidade"
                          value={
                            formData.quantidade === 0 ? "" : formData.quantidade
                          }
                          onChange={handleInputChange}
                          placeholder="0"
                          min="1"
                          required
                        />
                      </div>
                      {/* <div className="col-md-6">
                        <label htmlFor="valor" className="form-label">
                          Valor Estimado (R$)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="valor"
                          name="valor"
                          value={
                            formData.valor === 0 || formData.valor === ""
                              ? ""
                              : formData.valor.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) // Formata para BRL
                          }
                          onChange={handleInputChange}
                          placeholder="0,00"
                        />
                      </div> */}
                      <div className="col-md-6">
                        <label htmlFor="categoria" className="form-label">
                          Categoria *
                        </label>
                        <select
                          className="form-select"
                          id="categoria"
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione a categoria</option>
                          {categorias.map((categoria) => (
                            <option
                              key={categoria.value}
                              value={categoria.value}
                            >
                              {categoria.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* CAMPO Subcategoria */}
                      {formData.categoria &&
                        subCategoriasDisponiveis.length > 0 && (
                          <div className="col-md-6">
                            <label
                              htmlFor="subCategoriaId"
                              className="form-label"
                            >
                              Subcategoria *
                            </label>
                            <select
                              className="form-select"
                              id="subCategoriaId"
                              name="subCategoriaId"
                              value={formData.subCategoriaId}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Selecione a subcategoria</option>
                              {subCategoriasDisponiveis.map((subCat) => (
                                <option key={subCat.id} value={subCat.id}>
                                  {subCat.descricao}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      {/* FIM DO CAMPO Subcategoria */}

                      <div className="col-md-6">
                        <label
                          htmlFor="estadoConservacao"
                          className="form-label"
                        >
                          Estado de Conservação *
                        </label>
                        <select
                          className="form-select"
                          id="estadoConservacao"
                          name="estadoConservacao"
                          value={formData.estadoConservacao}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o estado</option>
                          {estadosConservacao.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="situacao" className="form-label">
                          Situação
                        </label>
                        <select
                          className="form-select"
                          id="situacao"
                          name="situacao"
                          value={formData.situacao}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecione a situação</option>
                          {situacoes.map((situacao) => (
                            <option key={situacao.value} value={situacao.value}>
                              {situacao.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="caminhao" className="form-label">
                          Requer Entrega?
                        </label>
                        <select
                          className="form-select"
                          id="caminhao"
                          name="caminhao"
                          value={formData.caminhao}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecione</option>
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="data_cadastro" className="form-label">
                          Data de Cadastro
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="data_cadastro"
                          name="data_cadastro"
                          value={formData.data_cadastro}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navegação Botões */}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-2"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft size={16} />
                      Anterior
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={nextStep}
                        disabled={!validateStep(currentStep)}
                      >
                        Próximo
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success d-flex align-items-center gap-2"
                        disabled={!validateStep(3) || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Finalizar Doação
                            <Package size={16} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
