import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    loading: true,
  });
  const [personnel, setPersonnel] = useState([]);
  const [personnelLoading, setPersonnelLoading] = useState(true);
  const [personnelError, setPersonnelError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsResult, personnelResult] = await Promise.all([
          supabase
            .from('ho_so_qncn')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('ho_so_qncn')
            .select('id, ho_ten_khai_sinh, ngay_sinh, tn_nhap_ngu, tn_tuyen_dung, don_vi')
            .order('created_at', { ascending: false }),
        ]);

        if (statsResult.error) {
          throw statsResult.error;
        }

        if (personnelResult.error) {
          throw personnelResult.error;
        }

        setStats({ total: statsResult.count || 0, loading: false });
        setPersonnel(personnelResult.data || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu tổng quan', err);
        setStats((prev) => ({ ...prev, loading: false }));
        setPersonnelError('Không thể tải danh sách quân nhân.');
      } finally {
        setPersonnelLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h2>
        <Link to="/personnel/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow inline-flex items-center justify-center transition-colors">
          <i className="fas fa-plus mr-2"></i> Thêm hồ sơ
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600 mr-4">
            <i className="fas fa-users text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tổng quân nhân</p>
            <div className="flex items-center mt-1">
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.loading ? <i className="fas fa-circle-notch fa-spin text-xl text-gray-400"></i> : stats.total}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-4 rounded-full bg-green-100 text-green-600 mr-4">
            <i className="fas fa-user-check text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Đang công tác</p>
            <div className="flex items-center mt-1">
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.loading ? <i className="fas fa-circle-notch fa-spin text-xl text-gray-400"></i> : stats.total}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-4 rounded-full bg-orange-100 text-orange-600 mr-4">
            <i className="fas fa-clock text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Sắp hết hạn phục vụ</p>
            <div className="flex items-center mt-1">
              <h3 className="text-3xl font-bold text-gray-800">0</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-3 bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            <i className="fas fa-list-alt text-blue-600 mr-2"></i>
            Danh sách quân nhân
          </h3>
          <Link to="/personnel" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
            Xem tất cả <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">TT</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ và tên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhập ngũ / Tuyển dụng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn vị</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personnelLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <i className="fas fa-circle-notch fa-spin text-2xl mb-2 text-blue-500"></i>
                    <p>Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : personnelError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-red-600">
                    <i className="fas fa-circle-exclamation text-2xl mb-2"></i>
                    <p>{personnelError}</p>
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
                personnel.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{item.ho_ten_khai_sinh}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ngay_sinh || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tn_nhap_ngu || item.tn_tuyen_dung || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                        {item.don_vi || 'Chưa cập nhật'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/personnel/edit/${item.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        <i className="fas fa-edit"></i> Sửa
                      </Link>
                      <Link to={`/personnel/view/${item.id}`} className="text-green-600 hover:text-green-900">
                        <i className="fas fa-eye"></i> Xem
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-700">Hiển thị {personnel.length} kết quả</span>
        </div>
      </div>
    </div>
  );
}
