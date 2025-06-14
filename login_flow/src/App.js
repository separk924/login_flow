import "./App.css"
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { useAuth } from './utils/AuthContext';
import ProtectedRoutes from './utils/ProtectedRoutes';
import AdminDashboardPage from './pages/AdminDashboardPage';  // Example of a protected route
import ProfilePage from './pages/ProfilePage';  // Example of a user profile page
import Login from './pages/Login';
import ConsentPage from './pages/ConsentPage';
import Unauthorized from './utils/Unauthorized';
import AwaitingApproval from './utils/AwaitingApproval';
import Register from './pages/Register';
import amplifyconfig from './amplifyconfiguration.json';  // Assuming you're using AWS Amplify
import {ring} from 'ldrs';  // Assuming you're using a custom library for spinner
import { Amplify } from 'aws-amplify';

function App() {
  let queryClient = new QueryClient();
  Amplify.configure(amplifyconfig);
  ring.register();

  return (
    <AuthProvider>
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <Routes>
            {/* Protected routes for admin */}
            <Route element={<ProtectedRouteWithLoading allowedRoles={['admin']} />} >
              <Route path="/auth/admin" element={<AdminDashboardPage />} />
            </Route>

            {/* Protected routes for users and admins */}
            <Route element={<ProtectedRouteWithLoading allowedRoles={['user', 'admin']} />} >
              <Route path="/auth/profile" element={<ProfilePage />} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/awaiting-approval" element={<AwaitingApproval />} />
            <Route path="/sign-up" element={<Register />} />
          </Routes>
        </QueryClientProvider>
      </div>
    </AuthProvider>
  );
}

const ProtectedRouteWithLoading = ({ allowedRoles }) => {
  const { userData, isLoading } = useAuth();

  if (isLoading || !userData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: "30px" }}>
        <l-ring size="50" stroke="5" bg-opacity="0" speed="2" color="#616161" />
      </div>
    );
  }

  return <ProtectedRoutes userData={userData} allowedRoles={allowedRoles} />;
};

export default App;
