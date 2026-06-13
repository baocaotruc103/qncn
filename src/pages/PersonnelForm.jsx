import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TabThongTinChung from '../components/TabThongTinChung';
import TabDaoTao from '../components/TabDaoTao';
import TabGiaDinh from '../components/TabGiaDinh';
import TabKhenKyLuat from '../components/TabKhenKyLuat';
import TabNhanDang from '../components/TabNhanDang';
import TabLuong from '../components/TabLuong';
import { supabase } from '../services/supabase';
import { processAndSaveHoSo } from '../utils/saveLogic';
import { useAuth } from '../contexts/authContextBase';

function PersonnelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('tab1');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [initialData, setInitialData] = useState(null);

  const tabs = [
    { id: 'tab1', label: '1. TT Chung' },
    { id: 'tab2', label: '2. Đào tạo' },
    { id: 'tab3', label: '3. Gia đình' },
    { id: 'tab4', label: '4. Khen/Kỷ luật' },
    { id: 'tab5', label: '5. Nhận dạng' },
    { id: 'tab6', label: '6. Lương' },
  ];

  useEffect(() => {
    if (!id) {
        setIsLoading(false);
        return;
    }
    async function fetchData() {
        try {
            const [
                { data: hoSo },
                { data: daoTao },
                { data: giaDinh },
                { data: khenThuong },
                { data: kyLuat },
                { data: luong }
            ] = await Promise.all([
                supabase.from('ho_so_qncn').select('*').eq('id', id).single(),
                supabase.from('dao_tao_lai').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                supabase.from('gia_dinh').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                supabase.from('khen_thuong').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                supabase.from('ky_luat').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                supabase.from('luong_qua_trinh').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true })
            ]);
            setInitialData({
                hoSo: hoSo || {},
                daoTao: daoTao || [],
                giaDinh: giaDinh || [],
                khenThuong: khenThuong || [],
                kyLuat: kyLuat || [],
                luong: luong || []
            });
        } catch (e) {
            console.error(e);
            alert("Lỗi khi tải dữ liệu cũ.");
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await processAndSaveHoSo(id);
      alert('Đã lưu hồ sơ thành công.');
      navigate('/personnel');
    } catch (error) {
      console.error(error);
      alert(`Không lưu được dữ liệu: ${error.message || 'Lỗi không xác định'}`);
      if (error.message.includes('Họ tên khai sinh') || error.message.includes('Ngày tháng năm sinh')) {
        setActiveTab('tab1');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="text-center text-blue-600">
                <i className="fas fa-spinner fa-spin text-3xl mb-2"></i>
                <p>Đang tải dữ liệu hồ sơ...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-blue-800 text-white p-4 sm:p-6 rounded-t-lg shadow-md text-center flex justify-between items-center">
        <button type="button" onClick={() => navigate(-1)} className="text-blue-200 hover:text-white transition-colors">
            <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold uppercase flex-1">{id ? 'Cập nhật hồ sơ' : 'Nhập liệu hồ sơ mới'}</h1>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      <form className="bg-white shadow-md rounded-b-lg p-3 sm:p-6" onSubmit={handleSave}>
        <div className="border-b border-gray-200 mb-6 -mx-3 sm:-mx-6 px-3 sm:px-6">
          <nav className="-mb-px flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-8 pb-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className={activeTab === 'tab1' ? 'block' : 'hidden'}>
          <TabThongTinChung initialData={initialData?.hoSo} currentUser={currentUser} />
        </div>
        <div className={activeTab === 'tab2' ? 'block' : 'hidden'}>
          <TabDaoTao initialData={initialData?.daoTao} initialHoSo={initialData?.hoSo} />
        </div>
        <div className={activeTab === 'tab3' ? 'block' : 'hidden'}>
          <TabGiaDinh initialData={initialData?.giaDinh} />
        </div>
        <div className={activeTab === 'tab4' ? 'block' : 'hidden'}>
          <TabKhenKyLuat initialKhenThuong={initialData?.khenThuong} initialKyLuat={initialData?.kyLuat} initialHoSo={initialData?.hoSo} />
        </div>
        <div className={activeTab === 'tab5' ? 'block' : 'hidden'}>
          <TabNhanDang initialData={initialData?.hoSo} />
        </div>
        <div className={activeTab === 'tab6' ? 'block' : 'hidden'}>
          <TabLuong initialData={initialData?.luong} initialHoSo={initialData?.hoSo} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center gap-4">
          {activeTab !== 'tab6' ? (
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-lg"
            >
              Tiếp tục <i className="fas fa-arrow-right ml-2"></i>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:w-auto text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-lg ${
                isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Đang lưu...</>
              ) : (
                <><i className="fas fa-save mr-2"></i> Lưu hồ sơ</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PersonnelForm;
