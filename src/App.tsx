import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { CssBaseline, ThemeProvider } from '@mui/material';
// // import SignupPage from './pages/SignupPage';
// // import LoginPage from './pages/LoginPage';
// // import HomePage from './pages/HomePage';
// // import AIToolsPage from './pages/AIToolsPage';
// // import ProtectedRoute from './components/ProtectedRoute';
// // import Layout from './components/Layout';
// import theme from './theme';

// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// import { TaskProvider } from './contexts/TaskProvider';

import SignupPage from "./pages/SignupPage";

// // const queryClient = new QueryClient();

// export default function App() {
//   console.log("app");

// //   return (
// //     // <QueryClientProvider client={queryClient}>
// //       <ThemeProvider theme={theme}>
// //         <LocalizationProvider dateAdapter={AdapterLuxon}>
// //           <CssBaseline />
// //           <BrowserRouter>
// //             <AuthProvider>
// //               <TaskProvider>
// //               <Routes>
// //               {/* <Route path="/signup" element={<SignupPage />} /> */}
// //               <Route path="/signup" element={<h1>Signup Route Works!</h1>} />

// //                 {/* <Route path="/login" element={<LoginPage />} /> */}
// // {/*
// //                 <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}> */}
// //                   {/* <Route path="/" element={<HomePage />} />
// //                   <Route path="/ai-tools" element={<AIToolsPage />} /> */}
// //                 {/* </Route> */}
// //               </Routes>
// //               </TaskProvider>
// //             </AuthProvider>
// //           </BrowserRouter>
// //           <ReactQueryDevtools initialIsOpen={false} />
// //         </LocalizationProvider>
// //       </ThemeProvider>
// //     // </QueryClientProvider>
// //   );
// // }

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
