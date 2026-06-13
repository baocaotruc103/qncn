import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const relations = [
    'Cha đẻ',
    'Mẹ đẻ',
    'Cha vợ (chồng)',
    'Mẹ vợ (chồng)',
    'Người nuôi dưỡng hợp pháp',
    'Vợ (chồng)',
    'Con đẻ',
    'Con nuôi hợp pháp',
    'Anh ruột',
    'Chị ruột',
    'Em ruột',
    'Ông nội',
    'Bà nội',
    'Ông ngoại',
    'Bà ngoại',
    'Cháu'
];

const emptyFormData = {
    quanHe: 'Cha đẻ',
    hoTen: '',
    soDienThoai: '',
    namSinh: '',
    ngheNghiep: '',
    trangThai: 'Sống',
    namChet: '',
    tinhThanhPho: '',
    xaPhuong: '',
    noiOChiTiet: ''
};

const getFamilyDetailAddress = (row = {}) => (
    row.noiOChiTiet ||
    row.noi_o_chi_tiet ||
    row.noi_o_hien_tai_chi_tiet ||
    ''
);

function mapInitialData(data) {
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
        noiOChiTiet: getFamilyDetailAddress(item)
    }));
}

export default function TabGiaDinh({ initialData = [] }) {
    const [rows, setRows] = useState(() => mapInitialData(initialData));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [suggestions, setSuggestions] = useState({
        ngheNghiep: [],
        tinhThanhPho: ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'],
        xaPhuong: [],
        noiOChiTiet: [],
        noiOHienTai: []
    });

    useEffect(() => {
        async function fetchSuggestions() {
            const { data } = await supabase.from('gia_dinh').select('nghe_nghiep, noi_o_hien_tai, noi_o_chi_tiet');
            if (data) {
                const ngheNghiepSet = new Set();
                const tinhThanhSet = new Set(['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ']);
                const xaPhuongSet = new Set();
                const chiTietSet = new Set();
                const hienTaiSet = new Set();

                data.forEach(item => {
                    if (item.nghe_nghiep) ngheNghiepSet.add(item.nghe_nghiep.trim());
                    if (item.noi_o_chi_tiet) chiTietSet.add(item.noi_o_chi_tiet.trim());
                    if (item.noi_o_hien_tai) {
                        hienTaiSet.add(item.noi_o_hien_tai.trim());
                        const parts = item.noi_o_hien_tai.split(',').map(p => p.trim());
                        if (parts.length > 0) {
                            const ttp = parts.pop();
                            if (ttp) tinhThanhSet.add(ttp);
                            if (parts.length > 0) {
                                xaPhuongSet.add(parts.join(', '));
                            }
                        }
                    }
                });

                setSuggestions({
                    ngheNghiep: Array.from(ngheNghiepSet).filter(Boolean),
                    tinhThanhPho: Array.from(tinhThanhSet).filter(Boolean),
                    xaPhuong: Array.from(xaPhuongSet).filter(Boolean),
                    noiOChiTiet: Array.from(chiTietSet).filter(Boolean),
                    noiOHienTai: Array.from(hienTaiSet).filter(Boolean)
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
        setRows(prev => prev.map(row => (
            row.id === id ? { ...row, [field]: value } : row
        )));
    };

    const openAddModal = () => {
        setEditingRowId(null);
        setFormData(emptyFormData);
        setIsModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditingRowId(row.id);
        
        let xaPhuong = '';
        let tinhThanhPho = row.noiOHienTai || '';
        if (row.noiOHienTai && row.noiOHienTai.includes(',')) {
            const parts = row.noiOHienTai.split(',').map(p => p.trim());
            tinhThanhPho = parts.pop();
            xaPhuong = parts.join(', ');
        }

        setFormData({
            quanHe: row.relation || 'Cha đẻ',
            hoTen: row.hoTen || '',
            soDienThoai: row.soDienThoai || '',
            namSinh: row.namSinh || '',
            ngheNghiep: row.ngheNghiep || '',
            trangThai: row.trangThai || 'Sống',
            namChet: row.namChet || '',
            tinhThanhPho: tinhThanhPho,
            xaPhuong: xaPhuong,
            noiOChiTiet: getFamilyDetailAddress(row)
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

        const noiOHienTai = [formData.xaPhuong, formData.tinhThanhPho].filter(Boolean).join(', ');
        const existingRow = rows.find(row => row.id === editingRowId);
        const noiOChiTiet = formData.noiOChiTiet || getFamilyDetailAddress(existingRow);
        const nextRow = {
            id: editingRowId || crypto.randomUUID(),
            relation: formData.quanHe,
            hoTen: formData.hoTen,
            soDienThoai: formData.soDienThoai,
            namSinh: formData.namSinh,
            ngheNghiep: formData.ngheNghiep,
            trangThai: formData.trangThai,
            namChet: formData.namChet,
            noiOHienTai,
            noiOChiTiet
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
        <section id="tab3" className="tab-pane block">
            <datalist id="ngheNghiepList">
                {suggestions.ngheNghiep.map((item, idx) => <option key={`nn-${idx}`} value={item} />)}
            </datalist>
            <datalist id="tinhThanhList">
                {suggestions.tinhThanhPho.map((item, idx) => <option key={`tt-${idx}`} value={item} />)}
            </datalist>
            <datalist id="xaPhuongList">
                {suggestions.xaPhuong.map((item, idx) => <option key={`xp-${idx}`} value={item} />)}
            </datalist>
            <datalist id="chiTietList">
                {suggestions.noiOChiTiet.map((item, idx) => <option key={`ct-${idx}`} value={item} />)}
            </datalist>
            <datalist id="noiOHienTaiList">
                {suggestions.noiOHienTai.map((item, idx) => <option key={`ht-${idx}`} value={item} />)}
            </datalist>

            <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                <i className="fas fa-users mr-2"></i>30. Thông tin quan hệ gia đình
            </h3>
            <p className="text-sm text-gray-500 mb-4 italic">
                Nhập thông tin cho các thành viên trong gia đình. Bỏ trống nếu không có thông tin.
            </p>

            <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
                    <span className="font-medium text-gray-700">Danh sách thành viên gia đình</span>
                    <button type="button" onClick={openAddModal} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap ml-2">
                        <i className="fas fa-plus"></i> Thêm thành viên
                    </button>
                </div>
                <div className="md:hidden text-xs text-blue-600 p-2 bg-blue-50 border-b scroll-hint">
                    <i className="fas fa-arrows-alt-h mr-1"></i>Vuốt ngang để xem và chỉnh sửa các cột
                </div>
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
                                <th className="border p-2 min-w-[150px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="tbodyGiaDinh">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center text-gray-500 italic">
                                        Chưa có thành viên nào. Hãy bấm "Thêm thành viên" để nhập.
                                    </td>
                                </tr>
                            ) : rows.map((row, index) => (
                                <tr key={row.id} className="bg-white hover:bg-gray-50 border-b group transition-colors">
                                    <td className="p-1 border align-top pt-2" data-label="Mối quan hệ">
                                        <input
                                            type="text"
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded font-semibold"
                                            value={row.relation}
                                            onChange={(e) => updateRowField(row.id, 'relation', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Họ và tên">
                                        <input
                                            type="text"
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                            value={row.hoTen}
                                            onChange={(e) => updateRowField(row.id, 'hoTen', e.target.value)}
                                        />
                                        <input
                                            type="tel"
                                            className={`mt-1 w-full text-sm border border-blue-300 bg-blue-50 p-1.5 outline-none focus:ring-1 focus:ring-blue-500 rounded ${row.relation !== 'Vợ (chồng)' && 'hidden'}`}
                                            value={row.soDienThoai}
                                            onChange={(e) => updateRowField(row.id, 'soDienThoai', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Năm sinh">
                                        <input
                                            type="number"
                                            min="1900"
                                            max="2099"
                                            step="1"
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                            value={row.namSinh}
                                            onChange={(e) => updateRowField(row.id, 'namSinh', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Nghề nghiệp">
                                        <input
                                            type="text"
                                            list="ngheNghiepList"
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                            value={row.ngheNghiep}
                                            onChange={(e) => updateRowField(row.id, 'ngheNghiep', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Trạng thái">
                                        <select
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded mb-1"
                                            value={row.trangThai}
                                            onChange={(e) => updateRowField(row.id, 'trangThai', e.target.value)}
                                        >
                                            <option value="Sống">Sống</option>
                                            <option value="Đã chết">Đã chết</option>
                                        </select>
                                        <input
                                            type="number"
                                            className={`w-full text-sm border border-gray-300 bg-gray-50 p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded ${row.trangThai !== 'Đã chết' && 'hidden'}`}
                                            value={row.namChet}
                                            onChange={(e) => updateRowField(row.id, 'namChet', e.target.value)}
                                            placeholder="Năm chết..."
                                        />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Nơi ở hiện tại">
                                        <input
                                            type="text"
                                            list="noiOHienTaiList"
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                            value={row.noiOHienTai}
                                            onChange={(e) => updateRowField(row.id, 'noiOHienTai', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-1 border align-top pt-2" data-label="Nơi ở chi tiết">
                                        <textarea
                                            rows="2"
                                            className="w-full text-sm border-0 bg-transparent p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded resize-y min-h-[40px]"
                                            value={getFamilyDetailAddress(row)}
                                            onChange={(e) => updateRowField(row.id, 'noiOChiTiet', e.target.value)}
                                            placeholder="Nơi ở chi tiết..."
                                        ></textarea>
                                    </td>
                                    <td className="p-1 border text-center align-top pt-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button type="button" onClick={() => openEditModal(row)} className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-1 px-2 rounded transition-colors" title="Sửa dòng">
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            <button type="button" onClick={() => moveRow(index, -1)} disabled={index === 0} className="text-gray-700 hover:bg-gray-200 bg-gray-100 p-1 px-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Di chuyển lên">
                                                <i className="fas fa-arrow-up"></i>
                                            </button>
                                            <button type="button" onClick={() => moveRow(index, 1)} disabled={index === rows.length - 1} className="text-gray-700 hover:bg-gray-200 bg-gray-100 p-1 px-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Di chuyển xuống">
                                                <i className="fas fa-arrow-down"></i>
                                            </button>
                                            <button type="button" onClick={() => removeRow(row.id)} className="text-red-500 hover:bg-red-200 bg-red-100 p-1 px-2 rounded transition-colors" title="Xóa dòng">
                                                <i className="fas fa-trash"></i>
                                            </button>
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col transform transition-all">
                        <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg shrink-0">
                            <h3 className="text-lg font-bold text-blue-800">
                                <i className={`${editingRowId ? 'fas fa-pen' : 'fas fa-user-plus'} mr-2`}></i>
                                {editingRowId ? 'Sửa thành viên gia đình' : 'Thêm thành viên gia đình'}
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Mối quan hệ</label>
                                        <select name="quanHe" value={formData.quanHe} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                                            {relations.map(relation => <option key={relation} value={relation}>{relation}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Họ và tên</label>
                                        <input type="text" name="hoTen" value={formData.hoTen} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Nhập họ tên..." />
                                    </div>
                                </div>

                                {formData.quanHe === 'Vợ (chồng)' && (
                                    <div>
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Số điện thoại</label>
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
                                        <input type="text" list="ngheNghiepList" name="ngheNghiep" value={formData.ngheNghiep} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Nông dân..." />
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
                                    <label className="block text-sm text-gray-700 font-medium mb-2 border-b pb-1">Nơi ở hiện tại</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Tỉnh / Thành phố</label>
                                            <input list="tinhThanhList" name="tinhThanhPho" value={formData.tinhThanhPho} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Hà Nội" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Xã / Phường</label>
                                            <input type="text" list="xaPhuongList" name="xaPhuong" value={formData.xaPhuong} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Phường Thanh Xuân Trung" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 font-medium mb-1">Nơi ở chi tiết</label>
                                    <input type="text" list="chiTietList" name="noiOChiTiet" value={formData.noiOChiTiet} onChange={handleInputChange} className="w-full border-gray-300 rounded border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Số nhà, đường phố, thôn, xóm..." />
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
