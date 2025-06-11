import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, XCircle } from 'lucide-react'; 
import logo from '../../assets/logo.jpg'; 
import mao from '../../assets/mao.png'; 

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Lógica de autenticação (simplificada para o exemplo)
    if (email === 'doa@solidario.com' && password === 'solidario') {
      onLogin(); // Chama a função onLogin do App.tsx para atualizar o estado de autenticação
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  const handleDoarClick = () => {
    navigate('/quero-doar');
  };

  return (
    
    <div className="login-container">
      <header className="login-header">
        <div className="login-logo">
          <img src={mao} alt="Bairro da Juventude Logo" />
          <h1>Doa Solidário</h1>
        </div>
        <button className="doar-button" onClick={handleDoarClick}>
          Quero Doar
        </button>
      </header>

      
      <main className="login-content">
        <div className="login-box"> 
          <div className="login-image">
            <img src={logo} alt="Mãos segurando o mundo" />
          </div>
          <div className="login-form-container">
            <h2 className="login-form-title">Acesso ao Sistema</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail *</label>
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    className="login-input"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    //required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha *</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    className="login-input"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   // required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger">
                  <XCircle size={20} className="me-2" />
                  <div>{error}</div>
                </div>
              )}

              <button type="submit" className="login-button">
                Entrar
              </button>
            </form>
            {/* <div className="login-footer">
              <p>Esqueceu sua senha? <a href="#" className="login-link">Redefinir aqui</a></p>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;