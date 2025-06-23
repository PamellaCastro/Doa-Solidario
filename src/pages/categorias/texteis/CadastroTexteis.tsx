import React from "react";
import { useNavigate } from "react-router-dom";
import { Item } from "../../../services/ItemService";
import FormularioItem from "../../../components/formularios/FormularioItem";

const CadastroTextil: React.FC = () => {
  const navigate = useNavigate();
  const [item, setItem] = React.useState<Item>({
    descricao: "",
    quantidade: 0,
    valor: 0,
    caminhao: "",
    categoria: "TEXTIL",
    estadoConservacao: "",
    situacao: "",
    data_cadastro: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "valor") {
      const numeric = Number(value.replace(/[^\d]/g, "")) / 100;
      setItem((prev) => ({ ...prev, valor: numeric }));
    } else {
      setItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você chamaria o método de criação de item
    alert("Têxtil cadastrado com sucesso!");
    navigate("/categorias/texteis");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">Cadastrar Têxtil</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <FormularioItem
            item={item}
            onChange={handleChange}
            onSubmit={handleSubmit}
            modo="cadastro"
            error={null}
            isSubmitting={false}
            disableCategoria={true}
            disableDataCadastro={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CadastroTextil;
