import React, { useState } from 'react';

export default function TabGiaDinh({ initialData = [] }) {
    const mapInitialData = (data) => {
        return data.map(item => ({
            id: item.id || crypto.randomUUID(),
            relation: item.moi_quan_he || '',
            hoTen: item.ho_ten || '',
            soDienThoai: item.so_dien_thoai || '',
            namSinh: item.nam_sinh || '',
            ngheNghiep: item.nghe_nghiep || '',
            trangThai: item.trang_thai || 'Sống',
            namChet: item.nam_chet || '',
            noiOHienTai: item.noi_o_hien_tai || '',
            noiOChiTiet: item.noi_o_chi_tiet || ''
        }));
    };

    const [rows, setRows] = useState(() => mapInitialData(initialData));
    
    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        quanHe: 'Cha đẻ',
        hoTen: '',
        soDienThoai: '',
        namSinh: '',
        ngheNghiep: '',
        trangThai: 'Sống',
        namChet: '',
        tinhThanhPho: '',
        quanHuyen: '',
        noiOChiTiet: ''
    });

    const relations = ["Cha đẻ", "Mẹ đẻ", "Cha vợ (chồng)", "Mẹ vợ (chồng)", "Người nuôi dưỡng hợp pháp", "Vợ (chồng)", "Con đẻ", "Con nuôi hợp pháp", "Anh ruột", "Chị ruột", "Em ruột"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveModal = (e) => {
        e.preventDefault();
        const noiOHienTai = [formData.quanHuyen, formData.tinhThanhPho].filter(Boolean).join(', ');
        const newRow = {
            id: crypto.randomUUID(),
            relation: formData.quanHe,
            hoTen: formData.hoTen,
            soDienThoai: formData.soDienThoai,
            namSinh: formData.namSinh,
            ngheNghiep: formData.ngheNghiep,
            trangThai: formData.trangThai,
            namChet: formData.namChet,
            noiOHienTai: noiOHienTai,
            noiOChiTiet: formData.noiOChiTiet
        };
        setRows([...rows, newRow]);
        setIsModalOpen(false);
        // Reset form
        setFormData({
            quanHe: 'Cha đẻ', hoTen: '', soDienThoai: '', namSinh: '', ngheNghiep: '', 
            trangThai: 'Sống', namChet: '', tinhThanhPho: '', quanHuyen: '', noiOChiTiet: ''
        });
    };

    const removeRow = (id) => setRows(rows.filter(row => row.id !== id));

    return (
        <section id="tab3" className="tab-pane block">
            <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4"><i className="fas fa-users mr-2"></i>30. Thông tin quan hệ gia đình</h3>
            <p className="text-sm text-gray-500 mb-4 italic">Nhập thông tin cho các thành viên trong gia đình. Bỏ trống nếu không có thông tin.</p>
            
            <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
                    <span className="font-medium text-gray-700">Danh sách thành viên gia đình</span>
                    <button type="button" onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap ml-2"><i className="fas fa-plus"></i> Thêm thành viên</button>
                </div>
                <div className="md:hidden text-xs text-blue-600 p-2 bg-blue-50 border-b scroll-hint"><i className="fas fa-arrows-alt-h mr-1"></i>Vuốt ngang để xem và chỉnh sửa các cột</div>
                <div className="table-container overflow-x-auto w-full bg-gray-50 p-2 sm:p-0 sm:bg-white">
                    <table className="w-full text-sm text-left border-collapse" id="tableGiaDinh">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                            <tr>
                                <th className="border p-2 min-w-[140px]">Mối quan hệ</th>
                                <th className="border p-2 min-w-[180px]">Họ và tên / SĐT</th>
                                <th className="border p-2 min-w-[100px]">Năm sinh</th>
                                <th className="border p-2 min-w-[150px]">Nghề nghiệp</th>
                                <th className="border p-2 min-w-[160px]">Trạng thái</th>
                                <th className="border p-2 min-w-[200px]">Nơi ở hiện tại</th>
                                <th className="border p-2 min-w-[200px]">Nơi ở chi tiết</th>
                                <th className="border p-2 min-w-[80px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="tbodyGiaDinh">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center text-gray-500 italic">Chưa có thành viên nào. Hãy bấm "Thêm thành viên" để nhập.</td>
                                </tr>
                            ) : rows.map((row) => (
                                <tr key={row.id} className="bg-white hover:bg-gray-50 border-b group transition-colors">
                                    <td className="p-1 border align-top pt-2" data-label="Mối quan hệ">
                                        <input type="text" className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded font-semibold" defaultValue={row.relation} />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Họ và tên">
                                        <input type="text" className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded" defaultValue={row.hoTen} />
                                        <input type="tel" className={`mt-1 w-full text-sm border border-blue-300 bg-blue-50 p-1.5 outline-none focus:ring-1 focus:ring-blue-500 rounded ${row.relation !== 'Vợ (chồng)' && 'hidden'}`} defaultValue={row.soDienThoai} />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Năm sinh">
                                        <input type="number" min="1900" max="2099" step="1" className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded" defaultValue={row.namSinh} />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Nghề nghiệp">
                                        <input type="text" className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded" defaultValue={row.ngheNghiep} />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Trạng thái">
                                        <select className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded mb-1" defaultValue={row.trangThai}>
                                            <option value="Sống">Sống</option>
                                            <option value="Đã chết">Đã chết</option>
                                        </select>
                                        <input type="number" className={`w-full text-sm border border-gray-300 bg-gray-50 p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded ${row.trangThai !== 'Đã chết' && 'hidden'}`} defaultValue={row.namChet} placeholder="Năm chết..." />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Nơi ở hiện tại">
                                        <input type="text" className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded" defaultValue={row.noiOHienTai} />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Nơi ở chi tiết">
                                        <input type="text" className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded" defaultValue={row.noiOChiTiet} />
                                    </td>
                                    <td className="p-1 border text-center align-top pt-2">
                                        <button type="button" onClick={() => removeRow(row.id)} className="text-red-500 hover:bg-red-200 bg-red-100 p-1 px-2 rounded transition-colors" title="Xóa dòng"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Nhập Thành Viên */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col transform transition-all">
                        <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg shrink-0">
                            <h3 className="text-lg font-bold text-blue-800"><i className="fas fa-user-plus mr-2"></i>Thêm thành viên gia đình</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Mối quan hệ</label>
                                        <select name="quanHe" value={formData.quanHe} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                                            {relations.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Họ và tên</label>
                                        <input type="text" name="hoTen" value={formData.hoTen} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Nhập họ tên..." />
                                    </div>
                                </div>
                                
                                {formData.quanHe === 'Vợ (chồng)' && (
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Số điện thoại <em className="text-blue-500 font-normal italic">(Bắt buộc với Vợ/chồng)</em></label>
                                        <input type="tel" name="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-blue-50" placeholder="Nhập SĐT..." />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Năm sinh</label>
                                        <input type="number" name="namSinh" value={formData.namSinh} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="YYYY" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Nghề nghiệp</label>
                                        <input type="text" name="ngheNghiep" value={formData.ngheNghiep} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Nông dân..." />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Trạng thái</label>
                                        <select name="trangThai" value={formData.trangThai} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                                            <option value="Sống">Sống</option>
                                            <option value="Đã chết">Đã chết</option>
                                        </select>
                                    </div>
                                    {formData.trangThai === 'Đã chết' && (
                                        <div>
                                            <label className="block text-sm text-gray-700 font-medium mb-1">Năm chết</label>
                                            <input type="number" name="namChet" value={formData.namChet} onChange={handleInputChange} className="w-full border-red-300 rounded border p-2 text-sm focus:ring-1 focus:ring-red-500 outline-none bg-red-50" placeholder="YYYY" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 bg-gray-50 border rounded-md">
                                    <label className="block text-sm text-gray-700 font-medium mb-2 border-b pb-1">Nơi ở hiện tại (Gợi ý 2 cấp)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Tỉnh / Thành phố</label>
                                            <input list="provinces" name="tinhThanhPho" value={formData.tinhThanhPho} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Hà Nội" />
                                            <datalist id="provinces">
                                                <option value="Hà Nội" />
                                                <option value="TP Hồ Chí Minh" />
                                                <option value="Đà Nẵng" />
                                                <option value="Hải Phòng" />
                                                <option value="Cần Thơ" />
                                            </datalist>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Quận / Huyện</label>
                                            <input type="text" name="quanHuyen" value={formData.quanHuyen} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Ba Đình" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 font-medium mb-1">Nơi ở chi tiết</label>
                                    <input type="text" name="noiOChiTiet" value={formData.noiOChiTiet} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Số nhà, đường phố, thôn, xóm..." />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Hủy bỏ</button>
                            <button type="button" onClick={handleSaveModal} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm text-sm"><i className="fas fa-check mr-2"></i>Lưu vào bảng</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
