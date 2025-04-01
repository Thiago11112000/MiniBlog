import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";


import { auth } from "../firebase/config"; 

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);


  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

 
  const createUser = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null); 

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth, 
        data.email,
        data.password
      );

      await updateProfile(user, {
        displayName: data.displayName,
      });

      setLoading(false); 
      return user;
    } catch (error) {
      console.log("Erro createUser:", error.message); 

      let systemErrorMessage;

      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro ao criar o usuário. Tente novamente.";
      }

      setError(systemErrorMessage);
      setLoading(false); 
    }
  };

  const logout = () => {
    checkIfIsCancelled();
    signOut(auth); 
  };

  const login = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null); 

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password); 
      setLoading(false);
    } catch (error) {
      console.log("Erro login:", error.message); 

      let systemErrorMessage;

      if (error.message.includes("user-not-found") || error.message.includes("invalid-email")) { // Agrupa erros similares
        systemErrorMessage = "Usuário não encontrado ou e-mail inválido.";
      } else if (error.message.includes("wrong-password") || error.message.includes("invalid-credential")) { // Agrupa erros similares (v10+ usa invalid-credential)
        systemErrorMessage = "Senha incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      }

      setError(systemErrorMessage);
      setLoading(false); 
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth, 
    createUser,
    error,
    logout,
    login,
    loading,
  };
};