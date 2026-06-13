import { useState } from 'react';

const emptyFormData = {
    tuThang: '',
    denThang: '',
    capTrucThuoc: '',
    donViChiTiet: '',
    loaiThayDoi: '',
    dienQuanLy: '',
    dienBoTri: '',
    capBac: '',
    chucVu: '',
    thamNienCNQS: '',
    loaiNgach: '',
    nhom: '',
    bac: '',
    heSo: '',
    pcVuotKhung: '',
    heSoBaoLuu: '',
    pcChucVu: '',
    pcThamNienNghe: '',
    thamNienBatDau: ''
};

const getHeSo = (loaiNgach, nhom, bac) => {
    if (!loaiNgach || !bac) return '';
    const loai = loaiNgach.toLowerCase();
    const n = (nhom || '').toLowerCase();
    const b = parseInt(bac, 10);
    if (isNaN(b)) return '';

    let key = '';
    if (loai.includes('cao cấp')) {
        if (n.includes('2')) key = 'QNCN_CC_N2';
        else key = 'QNCN_CC_N1';
    } else if (loai.includes('trung cấp')) {
        key = 'QNCN_TC';
    } else if (loai.includes('sơ cấp')) {
        key = 'QNCN_SC';
    }

    const salaryTables = {
        "QNCN_CC_N1": { 1: 3.85, 2: 4.20, 3: 4.55, 4: 4.90, 5: 5.25, 6: 5.60, 7: 5.95, 8: 6.30, 9: 6.65, 10: 7.00, 11: 7.35, 12: 7.70 },
        "QNCN_CC_N2": { 1: 3.65, 2: 4.00, 3: 4.35, 4: 4.70, 5: 5.05, 6: 5.40, 7: 5.75, 8: 6.10, 9: 6.45, 10: 6.80, 11: 7.15, 12: 7.50 },
        "QNCN_TC": { 1: 3.50, 2: 3.80, 3: 4.10, 4: 4.40, 5: 4.70, 6: 5.00, 7: 5.30, 8: 5.60, 9: 5.90, 10: 6.20 },
        "QNCN_SC": { 1: 3.20, 2: 3.45, 3: 3.70, 4: 3.95, 5: 4.20, 6: 4.45, 7: 4.70, 8: 4.95, 9: 5.20, 10: 5.45 }
    };

    if (key && salaryTables[key] && salaryTables[key][b]) {
        return salaryTables[key][b].toFixed(2);
    }
    return '';
};

const salaryFields = [
    ['tuThang', 'Từ tháng', 'text', 'mm/yyyy'],
    ['denThang', 'Đến tháng', 'text', 'mm/yyyy'],
    ['capTrucThuoc', 'Đơn vị cấp trực thuộc', 'text', ''],
    ['donViChiTiet', 'Đơn vị chi tiết', 'text', ''],
    ['loaiThayDoi', 'Loại thay đổi', 'text', ''],
    ['dienQuanLy', 'Diện quản lý', 'text', ''],
    ['dienBoTri', 'Diện bố trí', 'text', ''],
    ['capBac', 'Cấp bậc', 'text', ''],
    ['chucVu', 'Chức vụ, CNQS đang làm', 'text', ''],
    ['thamNienCNQS', 'T.N đảm nhận CNQS', 'text', 'mm/yyyy'],
    ['loaiNgach', 'Loại ngạch', 'text', ''],
    ['nhom', 'Nhóm', 'text', ''],
    ['bac', 'Bậc', 'text', ''],
    ['heSo', 'Hệ số', 'number', ''],
    ['pcVuotKhung', 'PC VK (%)', 'number', ''],
    ['heSoBaoLuu', 'Hệ số BL', 'number', ''],
    ['pcChucVu', 'PC C.Vụ', 'number', ''],
    ['pcThamNienNghe', 'PC TN Nghề', 'number', ''],
    ['thamNienBatDau', 'T.N bắt đầu đảm nhận', 'text', 'mm/yyyy']
];

function mapInitialData(data) {
    return data.map(item => ({
        id: item.id || crypto.randomUUID(),
        tuThang: item.tu_thang || '',
        denThang: item.den_thang || '',
        capTrucThuoc: item.don_vi_cap_truc_thuoc || '',
        donViChiTiet: item.don_vi_chi_tiet || '',
        loaiThayDoi: item.loai_thay_doi || '',
        dienQuanLy: item.dien_quan_ly || '',
        dienBoTri: item.dien_bo_tri || '',
        capBac: item.cap_bac || '',
        chucVu: item.chuc_vu_cnqs || '',
        thamNienCNQS: item.tn_dam_nhan_cnqs || '',
        loaiNgach: item.loai_ngach || '',
        nhom: item.nhom || '',
        bac: item.bac || '',
        heSo: item.he_so || '',
        pcVuotKhung: item.pc_vk || '',
        heSoBaoLuu: item.he_so_bl || '',
        pcChucVu: item.pc_chuc_vu || '',
        pcThamNienNghe: item.pc_tn_nghe || '',
        thamNienBatDau: item.tn_bat_dau_dam_nhan || ''
    }));
}

export default function TabLuong({ initialData = [], initialHoSo = {} }) {
    const [rows, setRows] = useState(() => mapInitialData(initialData));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState(emptyFormData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const nextForm = { ...prev, [name]: value };
            if (['loaiNgach', 'nhom', 'bac'].includes(name)) {
                const calculatedHeSo = getHeSo(nextForm.loaiNgach, nextForm.nhom, nextForm.bac);
                if (calculatedHeSo) {
                    nextForm.heSo = calculatedHeSo;
                }
            }
            return nextForm;
        });
    };

    const updateRowField = (id, field, value) => {
        setRows(prev => prev.map(row => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const openAddModal = () => {
        setEditingRowId(null);
        let initialForm = { ...emptyFormData };
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            initialForm = { ...lastRow };
            // Xóa các trường cần nhập mới
            initialForm.id = '';
            initialForm.tuThang = '';
            initialForm.denThang = '';
            initialForm.loaiThayDoi = '';
            // Gợi ý hệ số tự động nếu hợp lệ
            const suggestedHeSo = getHeSo(initialForm.loaiNgach, initialForm.nhom, initialForm.bac);
            if (suggestedHeSo) initialForm.heSo = suggestedHeSo;
        }
        setFormData(initialForm);
        setIsModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditingRowId(row.id);
        setFormData({ ...emptyFormData, ...row });
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

    const renderTableInput = (row, field, type, placeholder) => (
        <input
            type={type}
            step={type === 'number' ? '0.01' : undefined}
            inputMode={placeholder ? 'numeric' : undefined}
            placeholder={placeholder}
            data-month-year={placeholder ? 'true' : undefined}
            className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500"
            value={row[field]}
            onChange={(e) => updateRowField(row.id, field, e.target.value)}
        />
    );

    return (
        <section id="tab6" className="tab-pane block">
            <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                <i className="fas fa-money-bill-wave mr-2"></i>34. Thông tin lương
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">34.1 Bắt đầu đóng BHXH</label>
                    <input type="text" defaultValue={initialHoSo?.bat_dau_dong_bhxh || ''} inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="mt-1 block w-full rounded border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">34.2 Số sổ</label>
                    <input type="text" defaultValue={initialHoSo?.so_so_bhxh || ''} className="mt-1 block w-full rounded border p-2" />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">34.3 Theo chế độ</label>
                    <input type="text" defaultValue={initialHoSo?.theo_che_do || ''} className="mt-1 block w-full rounded border p-2" />
                </div>
            </div>

            <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-50 p-3 flex justify-between items-center border-b">
                    <span className="font-bold text-blue-800">34.4 Quá trình công tác và hưởng lương</span>
                    <button type="button" onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium whitespace-nowrap ml-2">
                        <i className="fas fa-plus"></i> Thêm quá trình
                    </button>
                </div>
                <div className="md:hidden text-xs text-blue-600 p-2 bg-blue-50 border-b scroll-hint">
                    <i className="fas fa-arrows-alt-h mr-1"></i>Vuốt ngang để xem và nhập tất cả các cột
                </div>
                <div className="table-container overflow-x-auto w-full mobile-vertical-table bg-gray-50 p-2 sm:p-0 sm:bg-white" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="w-full text-sm text-left border-collapse" id="tableLuong">
                        <thead className="text-xs text-gray-700 bg-gray-100 shadow-sm border-b-2 border-gray-300">
                            <tr>
                                {salaryFields.map(([, label]) => (
                                    <th key={label} className="border p-2 min-w-[120px]">{label}</th>
                                ))}
                                <th className="border p-2 min-w-[150px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="tbodyLuong">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="20" className="p-4 text-center text-gray-500 italic">
                                        Chưa có dữ liệu quá trình công tác. Hãy bấm "Thêm quá trình".
                                    </td>
                                </tr>
                            ) : rows.map((row, index) => (
                                <tr key={row.id} className="border-b bg-white hover:bg-gray-50 luong-row">
                                    {salaryFields.map(([field, label, type, placeholder]) => (
                                        <td key={field} className="p-1 border" data-label={label}>
                                            {renderTableInput(row, field, type, placeholder)}
                                        </td>
                                    ))}
                                    <td className="p-1 border text-center">
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col transform transition-all">
                        <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg shrink-0">
                            <h3 className="text-lg font-bold text-blue-800">
                                <i className={`${editingRowId ? 'fas fa-pen' : 'fas fa-plus-circle'} mr-2`}></i>
                                {editingRowId ? 'Sửa quá trình công tác' : 'Thêm quá trình công tác'}
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
                        </div>

                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                {salaryFields.map(([field, label, type, placeholder]) => (
                                    <div key={field}>
                                        <label className="block text-xs text-gray-500 mb-1">{label}</label>
                                        <input
                                            type={type === 'number' ? 'text' : type}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            placeholder={placeholder}
                                            className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-white flex justify-end gap-3 rounded-b-lg shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <button type="button" onClick={closeModal} className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Hủy bỏ</button>
                            <button type="button" onClick={handleSaveModal} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm text-sm">
                                <i className="fas fa-check mr-2"></i>{editingRowId ? 'Lưu thay đổi' : 'Lưu vào bảng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-500 italic">
                * Lưu ý: Các mục 35, 36, 37, 39, 40 không cần nhập liệu trên form này theo yêu cầu.
            </div>
        </section>
    );
}
