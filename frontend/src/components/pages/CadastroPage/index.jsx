import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./styles.css";

// Validações com Yup (simples e diretas)
const esquemaDeCadastro = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: yup
    .string()
    .required("O e-mail é obrigatório.")
    .email("Formato de e-mail inválido.")
});

function PaginaDeCadastro() {
  // Deixando os nomes em português e sem abreviações
  const {
    register: registrarCampo,
    handleSubmit: lidarComEnvioDoFormulario,
    formState: { errors: errosDoFormulario, isSubmitting: estaEnviando },
    setError: definirErroNoCampo,
    reset: limparCamposDoFormulario,
  } = useForm({
    resolver: yupResolver(esquemaDeCadastro),
    defaultValues: { nome: "", email: "" },
  });

  async function enviarDados(dadosDoFormulario) {
    try {
      await api.post("/usuarios", dadosDoFormulario);
      toast.success("Usuário cadastrado com sucesso!");
      limparCamposDoFormulario();
    } catch (erro) {
      const codigoDeStatus = erro?.response?.status;
      const mensagemDoServidor =
        erro?.response?.data?.message || erro?.response?.data?.error || "";

      // Se o e-mail já existir, mostra erro diretamente no campo de e-mail
      if (codigoDeStatus === 409 || mensagemDoServidor.toLowerCase().includes("email")) {
        definirErroNoCampo("email", {
          type: "server",
          message: "Este e-mail já está cadastrado.",
        });
      }

      toast.error("Erro ao cadastrar usuário. Tente novamente.");
      console.error("Erro no cadastro:", erro);
    }
  }

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Usuário</h1>

      <form noValidate onSubmit={lidarComEnvioDoFormulario(enviarDados)}>
        {/* Nome */}
        <div className="form-group">
          <label htmlFor="campo-nome">Nome</label>
          <input
            id="campo-nome"
            placeholder="Ex.: Maria Silva"
            {...registrarCampo("nome")}
          />
        </div>
        {errosDoFormulario.nome && (
          <p className="error-message">{errosDoFormulario.nome.message}</p>
        )}

        {/* E-mail */}
        <div className="form-group">
          <label htmlFor="campo-email">E-mail</label>
          <input
            id="campo-email"
            type="email"
            placeholder="exemplo@dominio.com"
            {...registrarCampo("email")}
          />
        </div>
        {errosDoFormulario.email && (
          <p className="error-message">{errosDoFormulario.email.message}</p>
        )}

        <button type="submit" disabled={estaEnviando}>
          {estaEnviando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default PaginaDeCadastro;