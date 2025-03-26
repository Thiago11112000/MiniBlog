import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

// Importe a instância 'app' do seu arquivo de configuração
// *** Ajuste o caminho se necessário ***
import { app } from "../firebase/config"; // Assumindo que config.js está em src/firebase/config.js

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  // Passe a instância 'app' para getAuth
  const auth = getAuth(app); // <--- CORREÇÃO AQUI

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

  const createUser = async (data) => {
    checkIfIsCancelled();

    setLoading(true);
    setError(null); // Limpe o erro antes de tentar criar

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, {
        displayName: data.displayName,
      });

      setLoading(false); // Defina loading como false em caso de sucesso
      return user;
    } catch (error) {
      console.error("Erro ao criar usuário:", error); // Use console.error para erros
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage;

      if (error.code === 'auth/weak-password') { // Use error.code para erros do Firebase Auth
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
      } else if (error.code === 'auth/email-already-in-use') {
        systemErrorMessage = "E-mail já cadastrado.";
      } else if (error.code === 'auth/invalid-email') {
          systemErrorMessage = "O formato do e-mail é inválido.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
      setLoading(false); // Defina loading como false também em caso de erro
    }

    // Removido setLoading(false) daqui, pois já está no try/catch
  };

  // ... (restante do código logout e login, que parecem ok, mas adicionei setLoading(false) nos catches)

    const logout = () => {
      checkIfIsCancelled();
      signOut(auth);
    };

    const login = async (data) => {
      checkIfIsCancelled();

      setLoading(true);
      setError(null); // Use null ou string vazia para limpar o erro

      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setLoading(false); // Mova para dentro do try em caso de sucesso
      } catch (error) {
        console.error("Erro ao fazer login:", error); // Use console.error para erros
        console.log(error.message);
        console.log(typeof error.message);
        console.log(error.code); // Verifique error.code

        let systemErrorMessage;

        // Use error.code para erros mais específicos do Firebase Auth v9+
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
          systemErrorMessage = "Usuário ou senha inválidos."; // Mensagem mais genérica por segurança
        } else if (error.code === 'auth/wrong-password') {
           systemErrorMessage = "Usuário ou senha inválidos."; // Mensagem mais genérica por segurança
        } else {
          systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
        }

        console.log(systemErrorMessage);
        setError(systemErrorMessage);
        setLoading(false); // Defina loading como false também em caso de erro
      }
      // Removido console.log(error) daqui, pois error só existe no catch
      // Removido setLoading(false) daqui
    };


  useEffect(() => {
    // Esta função de limpeza será chamada quando o componente que usa o hook for desmontado
    return () => setCancelled(true);
  }, []); // Array de dependências vazio garante que isso rode apenas na montagem/desmontagem

  return {
    auth,
    createUser,
    error,
    logout,
    login,
    loading,
  };
};