import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const emptyFormData = {
    loai: '',
    batDau: '',
    ketThuc: '',
    bacDaoTao: '',
    tenTruong: ''
};

function mapInitialData(data) {
    return data.map(item => ({
        id: item.id || crypto.randomUUID(),
        loai: item.loai || '',
        batDau: item.bat_dau || '',
        ketThuc: item.ket_thuc || '',
        bacDaoTao: item.bac_dao_tao || '',
        tenTruong: item.ten_truong || ''
    }));
}

export default function TabDaoTao({ initialData = [], initialHoSo = {} }) {
    const [rows, setRows] = useState(() => mapInitialData(initialData));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [suggestions, setSuggestions] = useState({ trinhDo: [], nganhNghe: [] });

    useEffect(() => {
        async function fetchSuggestions() {
            const { data } = await supabase.from('ho_so_qncn').select('trinh_do_dao_tao_cao_nhat, trinh_do_lien_quan_cnqs, nganh_nghe_cao_nhat, nganh_nghe_lien_quan_cnqs');
            if (data) {
                const trinhDoSet = new Set();
                const nganhNgheSet = new Set();
                data.forEach(item => {
                    if (item.trinh_do_dao_tao_cao_nhat) trinhDoSet.add(item.trinh_do_dao_tao_cao_nhat.trim());
                    if (item.trinh_do_lien_quan_cnqs) trinhDoSet.add(item.trinh_do_lien_quan_cnqs.trim());
                    if (item.nganh_nghe_cao_nhat) nganhNgheSet.add(item.nganh_nghe_cao_nhat.trim());
                    if (item.nganh_nghe_lien_quan_cnqs) nganhNgheSet.add(item.nganh_nghe_lien_quan_cnqs.trim());
                });
                setSuggestions({
                    trinhDo: Array.from(trinhDoSet).filter(Boolean),
                    nganhNghe: Array.from(nganhNgheSet).filter(Boolean)
                });
            }
        }
        fetchSuggestions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateRowField = (id, field, value) => {
        setRows(prev => prev.map(row => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const openAddModal = () => {
        setEditingRowId(null);
        setFormData(emptyFormData);
        setIsModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditingRowId(row.id);
        setFormData({
            loai: row.loai || '',
            batDau: row.batDau || '',
            ketThuc: row.ketThuc || '',
            bacDaoTao: row.bacDaoTao || '',
            tenTruong: row.tenTruong || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRowId(null);
        setFormData(emptyFormData);
    };

    const handleSaveModal = (e) => {
        e.preventDefault();
        const nextRow = {
            id: editingRowId || crypto.randomUUID(),
            ...formData
        };

        setRows(prev => (
            editingRowId
                ? prev.map(row => (row.id === editingRowId ? nextRow : row))
                : [...prev, nextRow]
        ));
        closeModal();
    };

    const removeRow = (id) => setRows(prev => prev.filter(row => row.id !== id));

    const moveRow = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= rows.length) return;
        setRows(prev => {
            const nextRows = [...prev];
            [nextRows[index], nextRows[targetIndex]] = [nextRows[targetIndex], nextRows[index]];
            return nextRows;
        });
    };

    return (
        <section id="tab2" className="tab-pane block">
            <datalist id="trinhDoList">
                {suggestions.trinhDo.map((item, idx) => <option key={`td-${idx}`} value={item} />)}
            </datalist>
            <datalist id="nganhNgheList">
                {suggestions.nganhNghe.map((item, idx) => <option key={`nn-${idx}`} value={item} />)}
            </datalist>

            <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                <i className="fas fa-graduation-cap mr-2"></i>29. Thông tin đào tạo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">29.1 Trình độ văn hóa</label>
                    <input type="text" defaultValue={initialHoSo?.trinh_do_van_hoa || '12/12'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">29.2 Trình độ đào tạo cao nhất</label>
                    <input type="text" list="trinhDoList" defaultValue={initialHoSo?.trinh_do_dao_tao_cao_nhat || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">29.3 Ngành nghề cao nhất</label>
                    <input type="text" list="nganhNgheList" defaultValue={initialHoSo?.nganh_nghe_cao_nhat || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">29.4 Năm tốt nghiệp</label>
                    <input type="number" defaultValue={initialHoSo?.nam_tot_nghiep || ''} min="1950" max="2099" step="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">29.5 Trình độ liên quan CNQS</label>
                    <input type="text" list="trinhDoList" defaultValue={initialHoSo?.trinh_do_lien_quan_cnqs || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">29.6 Ngành nghề liên quan CNQS</label>
                    <input type="text" list="nganhNgheList" defaultValue={initialHoSo?.nganh_nghe_lien_quan_cnqs || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
            </div>

            <div className="mt-4 border rounded-md overflow-hidden">
                <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
                    <span className="font-medium text-gray-700">29.7 Thông tin đào tạo lại</span>
                    <button type="button" onClick={openAddModal} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap ml-2">
                        <i className="fas fa-plus"></i> Thêm đào tạo
                    </button>
                </div>
                <div className="md:hidden text-xs text-blue-600 p-2 bg-blue-50 border-b scroll-hint">
                    <i className="fas fa-arrows-alt-h mr-1"></i>Vuốt ngang để xem và chỉnh sửa các cột
                </div>
                <div className="table-container overflow-x-auto w-full mobile-vertical-table bg-gray-50 p-2 sm:p-0 sm:bg-white">
                    <table className="w-full text-sm text-left whitespace-nowrap" id="tableDaoTaoLai">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2">Loại</th>
                                <th className="px-4 py-2">Bắt đầu</th>
                                <th className="px-4 py-2">Kết thúc</th>
                                <th className="px-4 py-2">Bậc đào tạo</th>
                                <th className="px-4 py-2">Tên trường</th>
                                <th className="px-4 py-2 text-center min-w-[150px]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500 italic">
                                        Chưa có thông tin đào tạo lại. Hãy bấm "Thêm đào tạo" để nhập.
                                    </td>
                                </tr>
                            ) : rows.map((row, index) => (
                                <tr key={row.id} className="border-b bg-white hover:bg-gray-50">
                                    <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.loai} onChange={(e) => updateRowField(row.id, 'loai', e.target.value)} /></td>
                                    <td className="p-2 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-gray-300 rounded text-sm p-1" value={row.batDau} onChange={(e) => updateRowField(row.id, 'batDau', e.target.value)} /></td>
                                    <td className="p-2 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-gray-300 rounded text-sm p-1" value={row.ketThuc} onChange={(e) => updateRowField(row.id, 'ketThuc', e.target.value)} /></td>
                                    <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.bacDaoTao} onChange={(e) => updateRowField(row.id, 'bacDaoTao', e.target.value)} /></td>
                                    <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.tenTruong} onChange={(e) => updateRowField(row.id, 'tenTruong', e.target.value)} /></td>
                                    <td className="p-2 border text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button type="button" onClick={() => openEditModal(row)} className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-1 px-2 rounded transition-colors" title="Sửa dòng"><i className="fas fa-pen"></i></button>
                                            <button type="button" onClick={() => moveRow(index, -1)} disabled={index === 0} className="text-gray-700 hover:bg-gray-200 bg-gray-100 p-1 px-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Di chuyển lên"><i className="fas fa-arrow-up"></i></button>
                                            <button type="button" onClick={() => moveRow(index, 1)} disabled={index === rows.length - 1} className="text-gray-700 hover:bg-gray-200 bg-gray-100 p-1 px-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Di chuyển xuống"><i className="fas fa-arrow-down"></i></button>
                                            <button type="button" onClick={() => removeRow(row.id)} className="text-red-500 hover:bg-red-200 bg-red-100 p-1 px-2 rounded transition-colors" title="Xóa dòng"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] flex flex-col transform transition-all">
                        <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg shrink-0">
                            <h3 className="text-lg font-bold text-blue-800">
                                <i className={`${editingRowId ? 'fas fa-pen' : 'fas fa-plus-circle'} mr-2`}></i>
                                {editingRowId ? 'Sửa thông tin đào tạo lại' : 'Thêm thông tin đào tạo lại'}
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-700 font-medium mb-1">Loại</label>
                                    <input type="text" name="loai" value={formData.loai} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Bắt đầu</label>
                                        <input type="text" name="batDau" value={formData.batDau} onChange={handleInputChange} placeholder="mm/yyyy" className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Kết thúc</label>
                                        <input type="text" name="ketThuc" value={formData.ketThuc} onChange={handleInputChange} placeholder="mm/yyyy" className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 font-medium mb-1">Bậc đào tạo</label>
                                    <input type="text" name="bacDaoTao" value={formData.bacDaoTao} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 font-medium mb-1">Tên trường</label>
                                    <input type="text" name="tenTruong" value={formData.tenTruong} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg shrink-0">
                            <button type="button" onClick={closeModal} className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Hủy bỏ</button>
                            <button type="button" onClick={handleSaveModal} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm text-sm">
                                <i className="fas fa-check mr-2"></i>{editingRowId ? 'Lưu thay đổi' : 'Lưu vào bảng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
