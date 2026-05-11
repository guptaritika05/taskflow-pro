import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className={`nav-link ${isActive('/projects') ? 'nav-link-active' : ''}`}
              >
                Projects
              </Link>
              <Link 
                to="/tasks" 
                className={`nav-link ${isActive('/tasks') ? 'nav-link-active' : ''}`}
              >
                Tasks
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium text-sm">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-danger text-sm px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}