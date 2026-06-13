import React, { useState } from 'react';

export default function TabDaoTao({ initialData = [], initialHoSo = {} }) {
    const mapInitialData = (data) => {
        return data.map(item => ({
            id: item.id || crypto.randomUUID(),
            loai: item.loai || '',
            batDau: item.bat_dau || '',
            ketThuc: item.ket_thuc || '',
            bacDaoTao: item.bac_dao_tao || '',
            tenTruong: item.ten_truong || ''
        }));
    };

    const [rows, setRows] = useState(() => mapInitialData(initialData));
    
    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        loai: '',
        batDau: '',
        ketThuc: '',
        bacDaoTao: '',
        tenTruong: ''
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
            loai: '', batDau: '', ketThuc: '', bacDaoTao: '', tenTruong: ''
        });
    };

    const removeRow = (id) => setRows(rows.filter(rowId => rowId.id !== id));

    return (
        <section id="tab2" className="tab-pane block">
            
                <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4"><i className="fas fa-graduation-cap mr-2"></i>29. Thông tin đào tạo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">29.1 Trình độ văn hóa</label>
                        <input type="text" defaultValue={initialHoSo?.trinh_do_van_hoa || '12/12'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">29.2 Trình độ đào tạo cao nhất <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(Tiến sĩ, thạc sĩ, đại học...)</em></label>
                        <input type="text" defaultValue={initialHoSo?.trinh_do_dao_tao_cao_nhat || ''} placeholder="" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">29.3 Ngành nghề cao nhất <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(điều dưỡng...riêng quản lý bệnh viện không có)</em></label>
                        <input type="text" defaultValue={initialHoSo?.nganh_nghe_cao_nhat || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">29.4 Năm tốt nghiệp <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(của đào tạo bậc cao nhất)</em></label>
                        <input type="number" defaultValue={initialHoSo?.nam_tot_nghiep || ''} min="1950" max="2099" step="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">29.5 Trình độ liên quan CNQS <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(Đại học, cao đẳng...)</em></label>
                        <input type="text" defaultValue={initialHoSo?.trinh_do_lien_quan_cnqs || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">29.6 Ngành nghề liên quan CNQS <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(điều dưỡng, kỹ sư, kế toán...)</em></label>
                        <input type="text" defaultValue={initialHoSo?.nganh_nghe_lien_quan_cnqs || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                </div>

                {/* Đào tạo lại */}
                <div className="mt-4 border rounded-md overflow-hidden">
                    <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
                        <span className="font-medium text-gray-700">29.7 Thông tin đào tạo lại</span>
                        <button type="button" onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap ml-2"><i className="fas fa-plus"></i> Thêm đào tạo</button>
                    </div>
                    <div className="md:hidden text-xs text-blue-600 p-2 bg-blue-50 border-b scroll-hint"><i className="fas fa-arrows-alt-h mr-1"></i>Vuốt ngang để xem và chỉnh sửa các cột</div>
                    <div className="table-container overflow-x-auto w-full mobile-vertical-table bg-gray-50 p-2 sm:p-0 sm:bg-white">
                        <table className="w-full text-sm text-left whitespace-nowrap" id="tableDaoTaoLai">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-2">Loại <em className="lowercase normal-case font-normal text-gray-500 block italic">(Bổ túc, chuyên tu, dài hạn,....)</em></th>
                                    <th className="px-4 py-2">Bắt đầu <em className="lowercase normal-case font-normal text-gray-500 block italic">(thời gian đi học cao đẳng, đại học, ...)</em></th>
                                    <th className="px-4 py-2">Kết thúc <em className="lowercase normal-case font-normal text-gray-500 block italic">(thời gian đi học cao đẳng, đại học, ...)</em></th>
                                    <th className="px-4 py-2">Bậc đào tạo <em className="lowercase normal-case font-normal text-gray-500 block italic">(cao đẳng, đại học, ...)</em></th>
                                    <th className="px-4 py-2">Tên trường <em className="lowercase normal-case font-normal text-gray-500 block italic">(cao đẳng, đại học, ...đã học)</em></th>
                                    <th className="px-4 py-2 text-center w-10">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-gray-500 italic">Chưa có thông tin đào tạo lại. Hãy bấm "Thêm đào tạo" để nhập.</td>
                                    </tr>
                                ) : rows.map((row) => (
                                    <tr key={row.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" defaultValue={row.loai} /></td>
                                        <td className="p-2 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-gray-300 rounded text-sm p-1" defaultValue={row.batDau} /></td>
                                        <td className="p-2 border"><input type="text" inputMode="numeric" placeholder="mm/yyyy" data-month-year="true" className="w-full border-gray-300 rounded text-sm p-1" defaultValue={row.ketThuc} /></td>
                                        <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" defaultValue={row.bacDaoTao} /></td>
                                        <td className="p-2 border"><input type="text" className="w-full border-gray-300 rounded text-sm p-1" defaultValue={row.tenTruong} /></td>
                                        <td className="p-2 border text-center">
                                            <button type="button" onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700 p-1"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Thêm Đào tạo lại */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] flex flex-col transform transition-all">
                            <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg shrink-0">
                                <h3 className="text-lg font-bold text-blue-800"><i className="fas fa-plus-circle mr-2"></i>Thêm thông tin đào tạo lại</h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
                            </div>
                            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Loại <em className="text-xs text-gray-500 font-normal italic">(Bổ túc, chuyên tu...)</em></label>
                                        <input type="text" name="loai" value={formData.loai} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 font-medium mb-1">Bắt đầu <em className="text-xs text-gray-500 font-normal italic">(mm/yyyy)</em></label>
                                            <input type="text" name="batDau" value={formData.batDau} onChange={handleInputChange} placeholder="mm/yyyy" className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 font-medium mb-1">Kết thúc <em className="text-xs text-gray-500 font-normal italic">(mm/yyyy)</em></label>
                                            <input type="text" name="ketThuc" value={formData.ketThuc} onChange={handleInputChange} placeholder="mm/yyyy" className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Bậc đào tạo <em className="text-xs text-gray-500 font-normal italic">(Cao đẳng, đại học...)</em></label>
                                        <input type="text" name="bacDaoTao" value={formData.bacDaoTao} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Tên trường <em className="text-xs text-gray-500 font-normal italic">(Trường đã học)</em></label>
                                        <input type="text" name="tenTruong" value={formData.tenTruong} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
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
