import { useState } from 'react';

const emptyFormData = {
    ngayThangNam: '',
    danhGiaXepLoai: '',
    lyDo: '',
    loai: '',
    cap: ''
};

function mapInitialRows(data) {
    return data.map(item => ({
        id: item.id || crypto.randomUUID(),
        ngayThangNam: item.ngay || '',
        danhGiaXepLoai: item.danh_gia_xep_loai || '',
        lyDo: item.ly_do || '',
        loai: item.loai || '',
        cap: item.cap || '',
        file_dinh_kem: item.file_dinh_kem || '',
        file_ten_goc: item.file_ten_goc || ''
    }));
}

export default function TabKhenKyLuat({ initialKhenThuong = [], initialKyLuat = [], initialHoSo = {} }) {
    const [khenThuongRows, setKhenThuongRows] = useState(() => mapInitialRows(initialKhenThuong));
    const [kyLuatRows, setKyLuatRows] = useState(() => mapInitialRows(initialKyLuat));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('khen');
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState(emptyFormData);

    const activeRows = modalType === 'khen' ? khenThuongRows : kyLuatRows;
    const setActiveRows = modalType === 'khen' ? setKhenThuongRows : setKyLuatRows;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = (type) => {
        setModalType(type);
        setEditingRowId(null);
        setFormData(emptyFormData);
        setIsModalOpen(true);
    };

    const openEditModal = (type, row) => {
        setModalType(type);
        setEditingRowId(row.id);
        setFormData({
            ngayThangNam: row.ngayThangNam || '',
            danhGiaXepLoai: row.danhGiaXepLoai || '',
            lyDo: row.lyDo || '',
            loai: row.loai || '',
            cap: row.cap || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRowId(null);
        setFormData(emptyFormData);
    };

    const updateRowField = (type, id, field, value) => {
        const setter = type === 'khen' ? setKhenThuongRows : setKyLuatRows;
        setter(prev => prev.map(row => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const handleSaveModal = (e) => {
        e.preventDefault();
        const existingRow = activeRows.find(row => row.id === editingRowId);
        const nextRow = {
            id: editingRowId || crypto.randomUUID(),
            ...formData,
            file_dinh_kem: existingRow?.file_dinh_kem || '',
            file_ten_goc: existingRow?.file_ten_goc || ''
        };

        setActiveRows(prev => (
            editingRowId
                ? prev.map(row => (row.id === editingRowId ? nextRow : row))
                : [...prev, nextRow]
        ));
        closeModal();
    };

    const removeRow = (type, id) => {
        const setter = type === 'khen' ? setKhenThuongRows : setKyLuatRows;
        setter(prev => prev.filter(row => row.id !== id));
    };

    const moveRow = (type, index, direction) => {
        const setter = type === 'khen' ? setKhenThuongRows : setKyLuatRows;
        setter(prev => {
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= prev.length) return prev;
            const nextRows = [...prev];
            [nextRows[index], nextRows[targetIndex]] = [nextRows[targetIndex], nextRows[index]];
            return nextRows;
        });
    };

    const renderRow = (type, row, index, totalRows) => (
        <tr key={row.id} className="border-b bg-white hover:bg-gray-50 relative">
            <td className="p-2 border"><input type="date" className="w-full border-gray-300 rounded text-sm p-1" value={row.ngayThangNam} onChange={(e) => updateRowField(type, row.id, 'ngayThangNam', e.target.value)} /></td>
            <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.danhGiaXepLoai} onChange={(e) => updateRowField(type, row.id, 'danhGiaXepLoai', e.target.value)} /></td>
            <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.lyDo} onChange={(e) => updateRowField(type, row.id, 'lyDo', e.target.value)} /></td>
            <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.loai} onChange={(e) => updateRowField(type, row.id, 'loai', e.target.value)} /></td>
            <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" value={row.cap} onChange={(e) => updateRowField(type, row.id, 'cap', e.target.value)} /></td>
            <td className="p-2 border">
                {row.file_ten_goc && (
                    <div className="text-xs text-blue-600 mb-1 truncate max-w-[200px]" title={row.file_ten_goc}>
                        <i className="fas fa-paperclip mr-1"></i>Đã tải lên: {row.file_ten_goc}
                    </div>
                )}
                <input type="file" accept="image/*,.pdf" className="w-full border-gray-300 rounded text-sm p-1 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                <input type="hidden" className="old-file-path" defaultValue={row.file_dinh_kem} />
                <input type="hidden" className="old-file-name" defaultValue={row.file_ten_goc} />
            </td>
            <td className="p-2 border text-center">
                <div className="flex items-center justify-center gap-1">
                    <button type="button" onClick={() => openEditModal(type, row)} className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-1 px-2 rounded transition-colors" title="Sửa dòng"><i className="fas fa-pen"></i></button>
                    <button type="button" onClick={() => moveRow(type, index, -1)} disabled={index === 0} className="text-gray-700 hover:bg-gray-200 bg-gray-100 p-1 px-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Di chuyển lên"><i className="fas fa-arrow-up"></i></button>
                    <button type="button" onClick={() => moveRow(type, index, 1)} disabled={index === totalRows - 1} className="text-gray-700 hover:bg-gray-200 bg-gray-100 p-1 px-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Di chuyển xuống"><i className="fas fa-arrow-down"></i></button>
                    <button type="button" onClick={() => removeRow(type, row.id)} className="text-red-500 hover:bg-red-200 bg-red-100 p-1 px-2 rounded transition-colors" title="Xóa dòng"><i className="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    );

    const renderTable = (type, rows, emptyText) => (
        <tbody>
            {rows.length === 0 ? (
                <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500 italic">{emptyText}</td>
                </tr>
            ) : rows.map((row, index) => renderRow(type, row, index, rows.length))}
        </tbody>
    );

    return (
        <section id="tab4" className="tab-pane block">
            <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                <i className="fas fa-award mr-2"></i>31-32. Đánh giá, Khen thưởng & Kỷ luật
            </h3>

            <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">31. Xếp loại hoàn thành nhiệm vụ</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded border border-blue-100">
                    <div><label className="block text-sm text-gray-700">Xuất sắc</label><input type="text" defaultValue={initialHoSo?.xep_loai_xuat_sac || ''} className="mt-1 block w-full rounded border p-2" /></div>
                    <div><label className="block text-sm text-gray-700">Tốt</label><input type="text" defaultValue={initialHoSo?.xep_loai_tot || ''} className="mt-1 block w-full rounded border p-2" /></div>
                    <div><label className="block text-sm text-gray-700">Hoàn thành</label><input type="text" defaultValue={initialHoSo?.xep_loai_hoan_thanh || ''} className="mt-1 block w-full rounded border p-2" /></div>
                    <div><label className="block text-sm text-gray-700">Không hoàn thành</label><input type="text" defaultValue={initialHoSo?.xep_loai_khong_hoan_thanh || ''} className="mt-1 block w-full rounded border p-2" /></div>
                </div>
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
                <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
                    <span className="font-medium text-gray-700">32.1 Thông tin khen thưởng</span>
                    <button type="button" onClick={() => openAddModal('khen')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap ml-2"><i className="fas fa-plus"></i> Thêm khen thưởng</button>
                </div>
                <div className="table-container overflow-x-auto w-full mobile-vertical-table bg-gray-50 p-2 sm:p-0 sm:bg-white">
                    <table className="w-full text-sm text-left whitespace-nowrap" id="tableKhenThuong">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2 w-40">Ngày tháng năm</th>
                                <th className="px-4 py-2 w-48">Đánh giá xếp loại</th>
                                <th className="px-4 py-2">Lý do</th>
                                <th className="px-4 py-2 w-32">Loại</th>
                                <th className="px-4 py-2 w-32">Cấp</th>
                                <th className="px-4 py-2 w-64">File đính kèm</th>
                                <th className="px-4 py-2 min-w-[150px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        {renderTable('khen', khenThuongRows, 'Chưa có thông tin khen thưởng. Hãy bấm "Thêm khen thưởng" để nhập.')}
                    </table>
                </div>
            </div>

            <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
                    <span className="font-medium text-gray-700">32.2 Thông tin kỷ luật</span>
                    <button type="button" onClick={() => openAddModal('ky')} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 whitespace-nowrap ml-2"><i className="fas fa-plus"></i> Thêm kỷ luật</button>
                </div>
                <div className="table-container overflow-x-auto w-full mobile-vertical-table bg-gray-50 p-2 sm:p-0 sm:bg-white">
                    <table className="w-full text-sm text-left whitespace-nowrap" id="tableKyLuat">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2 w-40">Ngày tháng năm</th>
                                <th className="px-4 py-2 w-48">Đánh giá xếp loại</th>
                                <th className="px-4 py-2">Lý do</th>
                                <th className="px-4 py-2 w-32">Loại</th>
                                <th className="px-4 py-2 w-32">Cấp</th>
                                <th className="px-4 py-2 w-64">File đính kèm</th>
                                <th className="px-4 py-2 min-w-[150px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        {renderTable('ky', kyLuatRows, 'Chưa có thông tin kỷ luật. Hãy bấm "Thêm kỷ luật" để nhập.')}
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] flex flex-col transform transition-all">
                        <div className={`p-4 border-b flex justify-between items-center rounded-t-lg shrink-0 ${modalType === 'khen' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <h3 className={`text-lg font-bold ${modalType === 'khen' ? 'text-green-800' : 'text-red-800'}`}>
                                <i className={`${editingRowId ? 'fas fa-pen' : 'fas fa-plus-circle'} mr-2`}></i>
                                {editingRowId ? 'Sửa thông tin' : modalType === 'khen' ? 'Thêm thông tin khen thưởng' : 'Thêm thông tin kỷ luật'}
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Ngày tháng năm</label>
                                        <input type="date" name="ngayThangNam" value={formData.ngayThangNam} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Đánh giá xếp loại</label>
                                        <input type="text" name="danhGiaXepLoai" value={formData.danhGiaXepLoai} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 font-medium mb-1">Lý do</label>
                                    <textarea name="lyDo" rows="2" value={formData.lyDo} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Nhập lý do..."></textarea>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Loại</label>
                                        <input type="text" name="loai" value={formData.loai} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Cấp quyết định</label>
                                        <input type="text" name="cap" value={formData.cap} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg shrink-0">
                            <button type="button" onClick={closeModal} className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Hủy bỏ</button>
                            <button type="button" onClick={handleSaveModal} className={`px-5 py-2 text-white rounded-md font-medium shadow-sm text-sm ${modalType === 'khen' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                <i className="fas fa-check mr-2"></i>{editingRowId ? 'Lưu thay đổi' : 'Lưu vào bảng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
