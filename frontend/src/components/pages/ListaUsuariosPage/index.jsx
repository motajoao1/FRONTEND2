import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Nosso cliente axios
import './styles.css';

function ListaUsuariosPage() {
  // Estado para guardar a lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  // Estado para controlar o feedback de carregamento
  const [loading, setLoading] = useState(true);

  // useEffect é executado quando o componente é montado
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        // Faz a chamada GET para a nossa API na rota /usuarios
        const response = await api.get('/usuarios');
        setUsuarios(response.data); // Salva os dados no estado
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
        setLoading(false); // Finaliza o carregamento mesmo com erro
      }
    }
    fetchUsuarios();
  }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez

  if (loading) {
    return <div className="lista-container"><h2>Carregando...</h2></div>;
  }

  return (
    <div className="lista-container">
      <h1>Lista de Usuários</h1>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeia a lista de usuários para criar uma linha <tr> para cada um */}
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaUsuariosPage;