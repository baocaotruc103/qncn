import React, { useState } from 'react';

export default function TabLuong({ initialData = [], initialHoSo = {} }) {
    const mapInitialData = (data) => {
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
    };

    const [rows, setRows] = useState(() => mapInitialData(initialData));
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        tuThang: '', denThang: '',
        capTrucThuoc: '', donViChiTiet: '',
        loaiThayDoi: '', dienQuanLy: '', dienBoTri: '',
        capBac: '', chucVu: '', thamNienCNQS: '',
        loaiNgach: '', nhom: '', bac: '', heSo: '',
        pcVuotKhung: '', heSoBaoLuu: '', pcChucVu: '', pcThamNienNghe: '', thamNienBatDau: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveModal = (e) => {
        e.preventDefault();
        const newRow = {
            id: crypto.randomUUID(),
            ...formData
        };
        setRows([...rows, newRow]);
        setIsModalOpen(false);
        // Reset form
        setFormData({
            tuThang: '', denThang: '', capTrucThuoc: '', donViChiTiet: '',
            loaiThayDoi: '', dienQuanLy: '', dienBoTri: '',
            capBac: '', chucVu: '', thamNienCNQS: '',
            loaiNgach: '', nhom: '', bac: '', heSo: '',
            pcVuotKhung: '', heSoBaoLuu: '', pcChucVu: '', pcThamNienNghe: '', thamNienBatDau: ''
        });
    };

    const removeRow = (id) => setRows(rows.filter(rowId => rowId.id !== id));

    return (
        <section id="tab6" className="tab-pane block">
            
                <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4"><i className="fas fa-money-bill-wave mr-2"></i>34. Thông tin lương</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">34.1 Bắt đầu đóng BHXH</label>
                        <input type="text" defaultValue={initialHoSo?.bat_dau_dong_bhxh || ''} inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">34.2 Số sổ <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(là 10 số cuối thẻ BHYT)</em></label>
                        <input type="text" defaultValue={initialHoSo?.so_so_bhxh || ''} className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">34.3 Theo chế độ <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(tuyển dụng QNCN, VCQP, CNQP; tuyển chọn QNCN không nhập được LĐHĐ thì để trống)</em></label>
                        <input type="text" defaultValue={initialHoSo?.theo_che_do || ''} className="mt-1 block w-full rounded border p-2" placeholder="" />
                    </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <div className="bg-blue-50 p-3 flex justify-between items-center border-b">
                        <span className="font-bold text-blue-800">34.4 Quá trình công tác và hưởng lương</span>
                        <button type="button" onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium whitespace-nowrap ml-2"><i className="fas fa-plus"></i> Thêm quá trình</button>
                    </div>
                    <div className="md:hidden text-xs text-blue-600 p-2 bg-blue-50 border-b scroll-hint"><i className="fas fa-arrows-alt-h mr-1"></i>Vuốt ngang để xem và nhập tất cả các cột</div>
                    <div className="table-container overflow-x-auto w-full mobile-vertical-table bg-gray-50 p-2 sm:p-0 sm:bg-white" style={{maxHeight: '500px', overflowY: 'auto'}}>
                        <table className="w-full text-sm text-left border-collapse" id="tableLuong">
                            <thead className="text-xs text-gray-700 bg-gray-100 shadow-sm border-b-2 border-gray-300">
                                <tr>
                                    <th className="border p-2 min-w-[120px]">Từ tháng</th>
                                    <th className="border p-2 min-w-[120px]">Đến tháng</th>
                                    <th className="border p-2 min-w-[150px]">Đơn vị (cấp trực thuộc)</th>
                                    <th className="border p-2 min-w-[150px]">Đơn vị (chi tiết)</th>
                                    <th className="border p-2 min-w-[150px]">Loại thay đổi</th>
                                    <th className="border p-2 min-w-[120px]">Diện quản lý</th>
                                    <th className="border p-2 min-w-[120px]">Diện bố trí</th>
                                    <th className="border p-2 min-w-[120px]">Cấp bậc</th>
                                    <th className="border p-2 min-w-[150px]">Chức vụ, CNQS đang làm</th>
                                    <th className="border p-2 min-w-[120px]">T.N đảm nhận CNQS</th>
                                    <th className="border p-2 min-w-[100px]">Loại (ngạch)</th>
                                    <th className="border p-2 min-w-[100px]">Nhóm</th>
                                    <th className="border p-2 min-w-[80px]">Bậc</th>
                                    <th className="border p-2 min-w-[80px]">Hệ số</th>
                                    <th className="border p-2 min-w-[80px]">PC VK(%)</th>
                                    <th className="border p-2 min-w-[80px]">Hệ số BL</th>
                                    <th className="border p-2 min-w-[80px]">PC C.Vụ</th>
                                    <th className="border p-2 min-w-[80px]">PC TN Nghề</th>
                                    <th className="border p-2 min-w-[120px]">T.N bắt đầu đảm nhận</th>
                                    <th className="border p-2 min-w-[60px] text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyLuong">
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan="20" className="p-4 text-center text-gray-500 italic">Chưa có dữ liệu quá trình công tác. Hãy bấm "Thêm quá trình".</td>
                                    </tr>
                                ) : rows.map((row) => (
                                    <tr key={row.id} className="border-b bg-white hover:bg-gray-50 luong-row">
                                        <td className="p-1 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.tuThang} /></td>
                                        <td className="p-1 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.denThang} /></td>
                                        
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.capTrucThuoc} /></td>
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.donViChiTiet} /></td>
                                        
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.loaiThayDoi} /></td>
                                        
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.dienQuanLy} /></td>
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.dienBoTri} /></td>
                                        
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.capBac} /></td>
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.chucVu} /></td>
                                        <td className="p-1 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.thamNienCNQS} /></td>
                                        
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.loaiNgach} /></td>
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.nhom} /></td>
                                        <td className="p-1 border"><input type="text" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.bac} /></td>
                                        <td className="p-1 border"><input type="number" step="0.01" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.heSo} /></td>
                                        <td className="p-1 border"><input type="number" step="0.01" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.pcVuotKhung} /></td>
                                        <td className="p-1 border"><input type="number" step="0.01" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.heSoBaoLuu} /></td>
                                        <td className="p-1 border"><input type="number" step="0.01" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.pcChucVu} /></td>
                                        <td className="p-1 border"><input type="number" step="0.01" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.pcThamNienNghe} /></td>
                                        <td className="p-1 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-0 bg-transparent text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500" defaultValue={row.thamNienBatDau} /></td>
                                        
                                        <td className="p-1 border text-center">
                                            <button type="button" onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700 p-1"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Thêm Quá trình công tác */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col transform transition-all">
                            <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg shrink-0">
                                <h3 className="text-lg font-bold text-blue-800"><i className="fas fa-plus-circle mr-2"></i>Thêm quá trình công tác</h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
                            </div>
                            
                            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
                                <div className="space-y-6">
                                    
                                    {/* Nhóm 1: Thời gian & Đơn vị */}
                                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Thời gian & Đơn vị</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Từ tháng <em className="italic">(mm/yy)</em></label>
                                                    <input type="text" name="tuThang" value={formData.tuThang} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="01/20" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Đến tháng <em className="italic">(mm/yy)</em></label>
                                                    <input type="text" name="denThang" value={formData.denThang} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="12/20" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Loại thay đổi</label>
                                                <input type="text" name="loaiThayDoi" value={formData.loaiThayDoi} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Bổ nhiệm, Nâng lương..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Cấp trực thuộc</label>
                                                <input type="text" name="capTrucThuoc" value={formData.capTrucThuoc} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Sư đoàn 1..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Chi tiết đơn vị</label>
                                                <input type="text" name="donViChiTiet" value={formData.donViChiTiet} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Trung đoàn 2..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nhóm 2: Chức vụ & Cấp bậc */}
                                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Chức vụ, Cấp bậc & Diện quản lý</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Chức vụ, CNQS đang làm</label>
                                                <input type="text" name="chucVu" value={formData.chucVu} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Trợ lý..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Cấp bậc</label>
                                                <input type="text" name="capBac" value={formData.capBac} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Thượng úy..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Diện quản lý</label>
                                                <input type="text" name="dienQuanLy" value={formData.dienQuanLy} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Diện bố trí</label>
                                                <input type="text" name="dienBoTri" value={formData.dienBoTri} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">T.N đảm nhận CNQS</label>
                                                <input type="text" name="thamNienCNQS" value={formData.thamNienCNQS} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">T.N bắt đầu đảm nhận</label>
                                                <input type="text" name="thamNienBatDau" value={formData.thamNienBatDau} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nhóm 3: Lương & Phụ cấp */}
                                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Lương & Phụ cấp</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Loại (Ngạch)</label>
                                                <input type="text" name="loaiNgach" value={formData.loaiNgach} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Nhóm</label>
                                                <input type="text" name="nhom" value={formData.nhom} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Bậc</label>
                                                <input type="text" name="bac" value={formData.bac} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Hệ số</label>
                                                <input type="text" name="heSo" value={formData.heSo} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">PC Vượt Khung (%)</label>
                                                <input type="text" name="pcVuotKhung" value={formData.pcVuotKhung} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Hệ số bảo lưu</label>
                                                <input type="text" name="heSoBaoLuu" value={formData.heSoBaoLuu} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">PC Chức vụ</label>
                                                <input type="text" name="pcChucVu" value={formData.pcChucVu} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">PC TN Nghề</label>
                                                <input type="text" name="pcThamNienNghe" value={formData.pcThamNienNghe} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div className="p-4 border-t bg-white flex justify-end gap-3 rounded-b-lg shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Hủy bỏ</button>
                                <button type="button" onClick={handleSaveModal} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm text-sm"><i className="fas fa-check mr-2"></i>Lưu vào bảng</button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-4 text-sm text-gray-500 italic">
                    * Lưu ý: Các mục 35, 36, 37, 39, 40 (Tăng giảm, Vắng mặt, Đào ngũ, Trích yếu, Tài liệu đính kèm) không cần nhập liệu trên form này theo yêu cầu.
                </div>
            
        </section>
    );
}
