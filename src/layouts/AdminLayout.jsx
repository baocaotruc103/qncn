import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContextBase';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { name: 'Tổng quan', path: '/', icon: 'fas fa-chart-line' },
    { name: 'Quản lý quân nhân', path: '/personnel', icon: 'fas fa-users' },
  ];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-blue-800">
          <span className="text-white font-bold text-lg uppercase tracking-wider">Hệ thống QLQL</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800 hover:text-white text-blue-100'
                  }`}
                >
                  <i className={`${item.icon} w-6 text-center mr-3 text-lg`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-900 text-white">
            <div className="flex items-center justify-center h-16 border-b border-blue-800">
              <span className="font-bold text-lg uppercase">Hệ thống QLQL</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-6 py-3 text-sm font-medium ${
                        location.pathname === item.path ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800 text-blue-100'
                      }`}
                    >
                      <i className={`${item.icon} w-6 text-center mr-3 text-lg`}></i>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none md:hidden"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          <div className="flex items-center ml-auto gap-3">
            <span className="text-gray-700 text-sm font-medium">
              <i className="fas fa-user-circle mr-2 text-blue-600"></i>
              {currentUser?.full_name || currentUser?.username || 'User'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <i className="fas fa-right-from-bracket mr-2 text-gray-500"></i>
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
