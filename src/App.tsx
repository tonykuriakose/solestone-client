import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from './contexts/TaskContext';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <CssBaseline />
            <ThemeProvider theme={theme}>
              <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<HomePage />} />
                </Route>
              </Routes>
            </ThemeProvider>
          </LocalizationProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
