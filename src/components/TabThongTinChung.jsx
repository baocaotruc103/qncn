import { useEffect, useRef } from 'react';
import cccdConfig from '../../cccd.json';

export default function TabThongTinChung({ initialData = {}, currentUser }) {
    const defaultHoTen = initialData?.id
        ? initialData.ho_ten_khai_sinh 
        : (currentUser?.full_name || currentUser?.ho_ten || currentUser?.name || currentUser?.username || '');

    const noiCapCccdRef = useRef(null);
    const ngaySinhRef = useRef(null);
    const ngayCapCccdRef = useRef(null);
    const hanSuDungCccdRef = useRef(null);
    const ngayChinhThucRef = useRef(null);

    const parseDateInput = (value) => {
        if (!value) return null;
        const [year, month, day] = value.split('-').map(Number);
        if (!year || !month || !day) return null;
        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const formatDateInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getAgeAtDate = (birthDate, targetDate) => {
        let age = targetDate.getFullYear() - birthDate.getFullYear();
        const beforeBirthday =
            targetDate.getMonth() < birthDate.getMonth() ||
            (targetDate.getMonth() === birthDate.getMonth() && targetDate.getDate() < birthDate.getDate());
        return beforeBirthday ? age - 1 : age;
    };

    const calculateCccdExpiryDate = (birthDateValue, issueDateValue) => {
        const birthDate = parseDateInput(birthDateValue);
        const issueDate = parseDateInput(issueDateValue);
        if (!birthDate || !issueDate) return '';

        const issueAge = getAgeAtDate(birthDate, issueDate);
        const rule = cccdConfig.cccd_expiry_rules.rules.find((item) => {
            if (typeof item.issue_age_under === 'number') {
                return issueAge >= item.issue_age_from && issueAge < item.issue_age_under;
            }
            return issueAge >= item.issue_age_from;
        });

        if (!rule || rule.expiry === 'KHONG_THOI_HAN') return '';

        const expiryDate = new Date(birthDate);
        expiryDate.setFullYear(birthDate.getFullYear() + rule.expiry_age);
        return formatDateInput(expiryDate);
    };

    const updateCccdExpiryDate = () => {
        if (!hanSuDungCccdRef.current) return;
        const expiryDate = calculateCccdExpiryDate(
            ngaySinhRef.current?.value || initialData?.ngay_sinh || '',
            ngayCapCccdRef.current?.value || initialData?.ngay_cap_cccd || ''
        );
        hanSuDungCccdRef.current.value = expiryDate;
    };

    useEffect(() => {
        if (!hanSuDungCccdRef.current?.value) {
            updateCccdExpiryDate();
        }
    });

    const handleNgayCapCccdChange = (e) => {
        const dateStr = e.target.value;
        updateCccdExpiryDate();
        if (!dateStr || !noiCapCccdRef.current) return;

        const selectedDate = new Date(dateStr);
        const cutoffDate = new Date('2024-06-30');
        
        if (selectedDate <= cutoffDate) {
            noiCapCccdRef.current.value = "Cục CSQLHC về TTXH";
        } else {
            noiCapCccdRef.current.value = "Bộ Công an";
        }
    };

    const handleNgayVaoDangChange = (e) => {
        const dateStr = e.target.value;
        if (!dateStr || !ngayChinhThucRef.current) return;

        const dateObj = new Date(dateStr);
        dateObj.setFullYear(dateObj.getFullYear() + 1);
        
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        ngayChinhThucRef.current.value = `${year}-${month}-${day}`;
    };

    return (
        <section id="tab1" className="tab-pane block">
            
                <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4"><i className="fas fa-user-circle mr-2"></i>I. Thông tin chung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">1. Họ tên khai sinh <span className="text-red-500">*</span></label>
                        <input type="text" required defaultValue={defaultHoTen} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 uppercase" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">2. Ngày tháng năm sinh <span className="text-red-500">*</span></label>
                        <input type="date" required ref={ngaySinhRef} onChange={updateCccdExpiryDate} defaultValue={initialData?.ngay_sinh || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">3. Đơn vị</label>
                        <input type="text" defaultValue={initialData?.don_vi || 'Khoa Hồi sức ngoại, Bộ môn -Trung tâm Hồi sức cấp cứu chống độc, Bệnh viện Quân y 103'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">4. Tháng năm vào quân đội <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(thời gian nhập ngũ, tuyển dụng CNVQP, VCQP)</em></label>
                        <input type="text" inputMode="numeric" placeholder="mm/yyyy" pattern="(0[1-9]|1[0-2])\/[0-9]{4}" data-month-year defaultValue={initialData?.thang_nam_vao_quan_doi || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">5. Số CMQNCN/CMSQ</label>
                        <input type="text" defaultValue={initialData?.so_cmqncn_cmsq || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">5.1 Ngày cấp CMQNCN/CMSQ</label>
                        <input type="date" defaultValue={initialData?.ngay_cap_cmqncn_cmsq || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">5.2 Nơi cấp CMQNCN/CMSQ</label>
                        <input type="text" defaultValue={initialData?.noi_cap_cmqncn_cmsq || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">6. Quê quán <em className="text-xs text-gray-500 font-normal italic">(địa chỉ 2 cấp)</em></label>
                        <input type="text" defaultValue={initialData?.que_quan || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">7. Nhóm máu</label>
                        <select defaultValue={initialData?.nhom_mau || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white">
                            <option value="">-- Chọn --</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">8. Số CCCD</label>
                        <input type="text" defaultValue={initialData?.so_cccd || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">8.1 Ngày cấp</label>
                        <input type="date" ref={ngayCapCccdRef} onChange={handleNgayCapCccdChange} defaultValue={initialData?.ngay_cap_cccd || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">8.2 Nơi cấp</label>
                        <input type="text" ref={noiCapCccdRef} defaultValue={initialData?.noi_cap_cccd || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">8.3 Hạn sử dụng</label>
                        <input type="date" ref={hanSuDungCccdRef} defaultValue={initialData?.han_su_dung_cccd || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">9. Trình độ ngoại ngữ</label>
                        <input type="text" defaultValue={initialData?.trinh_do_ngoai_ngu || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">10. Khối quân</label>
                        <input type="text" defaultValue={initialData?.khoi_quan || 'Dự toán'} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 border p-2 text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">11. Họ tên thường dùng</label>
                        <input type="text" defaultValue={initialData?.ho_ten_thuong_dung || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">12. Tình trạng hôn nhân <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(chưa kết hôn, đã kết hôn, đã ly hôn)</em></label>
                        <select defaultValue={initialData?.tinh_trang_hon_nhan || 'Chưa kết hôn'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white">
                            <option value="Chưa kết hôn">Chưa kết hôn</option>
                            <option value="Đã kết hôn">Đã kết hôn</option>
                            <option value="Đã ly hôn">Đã ly hôn</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded border">
                        <label className="block text-sm font-medium text-gray-700">13. Nơi thường trú <em className="text-xs text-gray-500 font-normal italic">(địa chỉ 2 cấp)</em></label>
                        <input type="text" defaultValue={initialData?.noi_thuong_tru || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 mb-2" />
                        <label className="block text-sm font-medium text-gray-700">14. Nơi thường trú chi tiết <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(VD: số nhà, tổ dân phố...)</em></label>
                        <input type="text" defaultValue={initialData?.noi_thuong_tru_chi_tiet || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded border">
                        <label className="block text-sm font-medium text-gray-700">15. Nơi tạm trú <em className="text-xs text-gray-500 font-normal italic">(địa chỉ 2 cấp)</em></label>
                        <input type="text" defaultValue={initialData?.noi_tam_tru || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 mb-2" />
                        <label className="block text-sm font-medium text-gray-700">16. Nơi tạm trú chi tiết <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(VD: số nhà, tổ dân phố...)</em></label>
                        <input type="text" defaultValue={initialData?.noi_tam_tru_chi_tiet || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded border md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">17. Nơi ở hiện tại</label>
                        <input type="text" defaultValue={initialData?.noi_o_hien_tai || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 mb-2" />
                        <label className="block text-sm font-medium text-gray-700">18. Nơi ở hiện tại chi tiết <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(VD: số nhà, tổ dân phố...)</em></label>
                        <input type="text" defaultValue={initialData?.noi_o_hien_tai_chi_tiet || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                </div>

                {/* Cột mốc thời gian */}
                <h4 className="font-medium text-gray-800 mt-6 mb-2">Các mốc thời gian</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 md:col-span-2">
                        <label className="block text-sm text-gray-700 font-medium">19. TN Tuyển dụng <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(đối với tuyển dụng VCQP, CNVQP, tuyển dụng từ HĐ hay ở ngoài vào QNCN)</em></label>
                        <input type="text" defaultValue={initialData?.tn_tuyen_dung || ''} inputMode="numeric" placeholder="mm/yyyy" pattern="(0[1-9]|1[0-2])\/[0-9]{4}" data-month-year className="mt-1 block w-full rounded border p-2 text-sm" />
                    </div>
                    <div className="sm:col-span-2 md:col-span-2">
                        <label className="block text-sm text-gray-700 font-medium">20. TN Nhập ngũ <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(đối với trường hợp đi nghĩa vụ quân sự)</em></label>
                        <input type="text" defaultValue={initialData?.tn_nhap_ngu || ''} inputMode="numeric" placeholder="mm/yyyy" pattern="(0[1-9]|1[0-2])\/[0-9]{4}" data-month-year className="mt-1 block w-full rounded border p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium">21. TN Xuất ngũ</label>
                        <input type="text" defaultValue={initialData?.tn_xuat_ngu || ''} inputMode="numeric" placeholder="mm/yyyy" pattern="(0[1-9]|1[0-2])\/[0-9]{4}" data-month-year className="mt-1 block w-full rounded border p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium">22. TN Tái ngũ</label>
                        <input type="text" defaultValue={initialData?.tn_tai_ngu || ''} inputMode="numeric" placeholder="mm/yyyy" pattern="(0[1-9]|1[0-2])\/[0-9]{4}" data-month-year className="mt-1 block w-full rounded border p-1 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium">26. Ngày vào Đoàn</label>
                        <input type="date" defaultValue={initialData?.ngay_vao_doan || ''} className="mt-1 block w-full rounded border p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium">27. Ngày vào Đảng</label>
                        <input type="date" onChange={handleNgayVaoDangChange} defaultValue={initialData?.ngay_vao_dang || ''} className="mt-1 block w-full rounded border p-2 text-sm" />
                    </div>
                    <div className="sm:col-span-2 md:col-span-2">
                        <label className="block text-sm text-gray-700 font-medium">Ngày chính thức <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(vào Đảng CSVN)</em></label>
                        <input type="date" ref={ngayChinhThucRef} defaultValue={initialData?.ngay_chinh_thuc_dang || ''} className="mt-1 block w-full rounded border p-2 text-sm" />
                    </div>
                </div>
            
        </section>
    );
}
