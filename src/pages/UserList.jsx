import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function normalizeUser(row) {
  return {
    id: row.id,
    fullName: row.full_name || row.ho_va_ten || row.ho_ten || row.name || '',
    username: row.username || row.ten_dang_nhap || '',
    role: row.role || row.vai_tro || 'user',
    createdAt: row.created_at || null,
  };
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Edit state
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', role: '', password: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Create state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({ username: '', fullName: '', role: 'user', password: '' });

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setErrorMsg('');

      try {
        const { data, error } = await supabase
          .from('tai_khoan')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setUsers((data || []).map(normalizeUser));
      } catch (err) {
        console.error('Lỗi khi tải danh sách user', err);
        setErrorMsg(err.message || 'Không thể tải danh sách tài khoản. Kiểm tra lại user.sql/RLS trong Supabase.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}" không? Hành động này không thể hoàn tác.`)) return;
    
    try {
      const { error } = await supabase.from('tai_khoan').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa tài khoản', err);
      alert('Lỗi khi xóa tài khoản: ' + err.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      role: user.role || 'user',
      password: ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updates = {
        ho_va_ten: editFormData.fullName,
        vai_tro: editFormData.role
      };
      
      if (editFormData.password.trim()) {
        updates.mat_khau = editFormData.password.trim();
      }

      const { error } = await supabase
        .from('tai_khoan')
        .update(updates)
        .eq('id', editingUser.id);

      if (error) throw error;
      
      setUsers(users.map(u => u.id === editingUser.id ? { 
        ...u, 
        fullName: updates.ho_va_ten, 
        role: updates.vai_tro 
      } : u));
      
      setEditingUser(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật tài khoản', err);
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateFormData({ username: '', fullName: '', role: 'user', password: '' });
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async (e) => {
    e.preventDefault();
    if (!createFormData.username || !createFormData.password) {
      alert('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    
    setIsSaving(true);
    try {
      const newUser = {
        ten_dang_nhap: createFormData.username,
        ho_va_ten: createFormData.fullName,
        vai_tro: createFormData.role,
        mat_khau: createFormData.password
      };

      const { data, error } = await supabase
        .from('tai_khoan')
        .insert([newUser])
        .select()
        .single();

      if (error) throw error;
      
      setUsers([normalizeUser(data), ...users]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Lỗi khi tạo tài khoản', err);
      if (err.code === '23505') {
        if (err.message && err.message.includes('pkey')) {
          alert('Lỗi hệ thống: ID tự động bị trùng lặp do nhập liệu thủ công trước đó. Vui lòng thử lưu lại một lần nữa hoặc cấu hình lại Sequence ID trên Supabase.');
        } else {
          alert('Lỗi: Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
        }
      } else {
        alert('Lỗi: ' + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            <i className="fas fa-users-cog text-blue-600 mr-2"></i>
            Quản lý tài khoản
          </h2>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Thêm tài khoản
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="m-4 p-4 bg-red-50 text-red-600 rounded border border-red-100">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {errorMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-12">TT</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên đăng nhập</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Họ và tên</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quyền</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-28">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-circle-notch fa-spin text-2xl mb-2 text-blue-500"></i>
                  <p>Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <p>Chưa có dữ liệu tài khoản.</p>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id || user.username || index} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{user.username || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Chỉnh sửa tài khoản */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Chỉnh sửa tài khoản</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                  <input 
                    type="text" 
                    value={editingUser.username} 
                    disabled 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.fullName}
                    onChange={e => setEditFormData({...editFormData, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quyền</label>
                  <select 
                    value={editFormData.role}
                    onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="user">Người dùng (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    placeholder="Bỏ trống nếu không muốn đổi mật khẩu"
                    value={editFormData.password}
                    onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Đang lưu...</>
                  ) : (
                    <><i className="fas fa-save mr-2"></i> Lưu thay đổi</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm mới tài khoản */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-green-50">
              <h3 className="text-lg font-bold text-green-800">Thêm mới tài khoản</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveCreate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={createFormData.username} 
                    onChange={e => setCreateFormData({...createFormData, username: e.target.value})}
                    placeholder="Nhập tên đăng nhập viết liền không dấu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={createFormData.fullName}
                    onChange={e => setCreateFormData({...createFormData, fullName: e.target.value})}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quyền</label>
                  <select 
                    value={createFormData.role}
                    onChange={e => setCreateFormData({...createFormData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  >
                    <option value="user">Người dùng (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    required
                    value={createFormData.password}
                    onChange={e => setCreateFormData({...createFormData, password: e.target.value})}
                    placeholder="Nhập mật khẩu cho tài khoản"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Đang lưu...</>
                  ) : (
                    <><i className="fas fa-plus mr-2"></i> Tạo tài khoản</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
