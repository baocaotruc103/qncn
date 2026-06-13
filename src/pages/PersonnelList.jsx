import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContextBase';

export default function PersonnelList() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchPersonnel() {
      try {
        const { data, error } = await supabase
          .from('ho_so_qncn')
          .select('id, ho_ten_khai_sinh, ngay_sinh, tn_nhap_ngu, tn_tuyen_dung, don_vi')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPersonnel(data || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách", err);
        alert("Không thể tải danh sách quân nhân.");
      } finally {
        setLoading(false);
      }
    }

    fetchPersonnel();
  }, []);

  const currentUserName = (currentUser?.full_name || currentUser?.ho_ten || currentUser?.name || currentUser?.username || '').toLowerCase().trim();
  const userRecordsCount = personnel.filter(p => (p.ho_ten_khai_sinh || '').toLowerCase().trim() === currentUserName).length;
  const canCreateNew = currentUser?.role === 'admin' || userRecordsCount === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800"><i className="fas fa-list-alt text-blue-600 mr-2"></i>Danh sách Quân nhân chuyên nghiệp</h2>
        {canCreateNew && (
          <Link to="/personnel/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors">
            <i className="fas fa-plus mr-1"></i> Thêm mới
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">TT</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày sinh</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhập ngũ / Tuyển dụng</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn vị</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
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
            ) : personnel.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <p>Chưa có hồ sơ quân nhân nào.</p>
                </td>
              </tr>
            ) : (
              personnel.map((p, index) => (
                <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{p.ho_ten_khai_sinh}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.ngay_sinh || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.tn_nhap_ngu || p.tn_tuyen_dung || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                      {p.don_vi || 'Chưa cập nhật'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/personnel/edit/${p.id}`} className="text-blue-600 hover:text-blue-900 mr-4" title="Cập nhật">
                      <i className="fas fa-edit"></i> Sửa
                    </Link>
                    <Link to={`/personnel/view/${p.id}`} className="text-green-600 hover:text-green-900" title="Xem chi tiết">
                      <i className="fas fa-eye"></i> Xem
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <span className="text-sm text-gray-700">Hiển thị {personnel.length} kết quả</span>
      </div>
    </div>
  );
}
