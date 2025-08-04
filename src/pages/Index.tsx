import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {isLoginMode ? (
        <LoginForm onSuccess={handleAuthSuccess} onToggleMode={toggleAuthMode} />
      ) : (
        <RegisterForm onSuccess={handleAuthSuccess} onToggleMode={toggleAuthMode} />
      )}
    </div>
  );
};

export default Index;
