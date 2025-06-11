import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/transferir (1).png";

function QueroDoar() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    descricao: "",
    quantidade: null as number | null,
    data_cadastro: "",
    caminhao: "",
    valor: "",
    categoria: "",
    situacao: "",
    estadoConservacao: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "valor") {
      const numeric = value.replace(/[^\d]/g, "");
      const formatted = (Number(numeric) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      valor: formData.valor.replace(/[^\d,]/g, "").replace(",", "."),
    };

    try {
      const response = await fetch("https://sua-api.com/doacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Obrigado pela sua doação! Entraremos em contato em breve.");
        navigate("/login");
      } else {
        alert("Erro ao enviar doação. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao conectar à API.");
    }
  };

  const handleVoltar = () => {
    navigate("/login");
  };

  return (
    <div className="login-container px-4 py-6">
      <div className="login-header flex justify-between items-center">
        <div className="login-logo flex items-center gap-4">
          <img
            src={logo || "/placeholder.svg"}
            alt="Bairro da Juventude"
            className="w-16 h-16"
          />
          <h1 className="text-xl font-bold">BAIRRO DA JUVENTUDE</h1>
        </div>
        <button className="form-button secondary" onClick={handleVoltar}>
          Voltar
        </button>
      </div>

      <div className="form-container max-w-7xl mx-auto mt-6 bg-white p-6 rounded shadow">
        <h2 className="form-title text-2xl mb-2">Formulário de Doação</h2>
        <p className="mb-6 text-gray-600">
          Sua doação faz a diferença! Preencha o formulário abaixo para doar
          itens para nossa instituição.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nome Completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <Input
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Data de Cadastro"
              name="data_cadastro"
              type="date"
              value={formData.data_cadastro}
              onChange={handleChange}
              required
            />
            <Input
              label="Caminhão"
              name="caminhao"
              value={formData.caminhao}
              onChange={handleChange}
            />
            <Input
              label="Valor estimado (R$)"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
            />
            <Input
              label="Quantidade"
              name="quantidade"
              type="number"
              value={formData.quantidade ?? ""}
              onChange={handleChange}
              required
            />

            <Select
              label="Categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              options={[
                "",
                "Eletrônicos",
                "Eletrodomésticos",
                "Móveis",
                "Têxteis",
              ]}
            />

            <Select
              label="Situação"
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              options={["", "Disponível", "Reservado", "Entregue"]}
            />

            <Select
              label="Estado de Conservação"
              name="estadoConservacao"
              value={formData.estadoConservacao}
              onChange={handleChange}
              required
              options={[
                "",
                "Novo",
                "Seminovo",
                "Usado em bom estado",
                "Usado com marcas de uso",
                "Precisa de reparos",
              ]}
            />

            <div className="col-span-full">
              <label className="form-label">Descrição do Item</label>
              <textarea
                name="descricao"
                className="form-input w-full"
                rows={4}
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="form-button secondary"
              onClick={handleVoltar}
            >
              Cancelar
            </button>
            <button type="submit" className="form-button">
              Enviar Doação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input {...props} className="form-input w-full" />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select {...props} className="form-select w-full">
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt || "Selecione"}
          </option>
        ))}
      </select>
    </div>
  );
}

export default QueroDoar;
