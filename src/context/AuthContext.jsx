import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  reload,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

function getFriendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este email já está registado.";
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/weak-password":
      return "A password tem de ter pelo menos 6 caracteres.";
    case "auth/invalid-credential":
      return "Email ou password incorretos.";
    default:
      return `Erro Firebase: ${code}`;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await reload(currentUser);
        setUser({ ...currentUser });
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  async function register(name, email, password) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName: name,
      });

      await reload(res.user);

      await sendEmailVerification(res.user);

      setUser({ ...res.user });

      return {
        success: true,
        message: "Email de verificação enviado!",
      };
    } catch (err) {
      return {
        success: false,
        message: getFriendlyError(err.code),
      };
    }
  }

  async function login(email, password) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      await reload(res.user);

      if (!res.user.emailVerified) {
        return {
          success: false,
          message: "Verifica o teu email antes de entrar.",
        };
      }

      setUser({ ...res.user });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: getFriendlyError(err.code),
      };
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}