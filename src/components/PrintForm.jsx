export default function PrintForm({ data }) {
    if (!data || !data.hoSo) return null;
    const { hoSo, daoTao, giaDinh, khenThuong, kyLuat, luong } = data;

    const formatDate = (d) => {
        if (!d) return '';
        try {
            const date = new Date(d);
            if (isNaN(date.getTime())) return d;
            return date.toLocaleDateString('vi-VN');
        } catch { return d; }
    };

    const field = (source, keys, fallback = '') => {
        for (const key of keys) {
            const value = source?.[key];
            if (value !== null && value !== undefined && value !== '') return value;
        }
        return fallback;
    };

    const safeDaoTao = daoTao || [];
    const safeGiaDinh = giaDinh || [];
    const safeKhen = khenThuong || [];
    const safeKy = kyLuat || [];
    const safeLuong = luong || [];

    return (
        <div className="print-form-container bg-white text-black text-sm" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .print-form-container { width: 196mm; max-width: 196mm; font-size: 12px; line-height: 1.25; }
                .a4-page { width: 196mm; min-height: 283mm; background-color: white; margin: 0 0 6mm 0; padding: 4mm 5mm; box-sizing: border-box; position: relative; overflow: hidden; }
                @media print {
                    body { background-color: white; padding: 0; }
                    .print-form-container { width: 196mm; max-width: 196mm; }
                    .a4-page { box-shadow: none; margin: 0; padding: 4mm 5mm; page-break-after: always; }
                    .no-print { display: none !important; }
                }
                .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; margin-top: 10px; margin-bottom: 7px; padding-bottom: 2px; }
                .field-group { display: flex; align-items: flex-start; margin-bottom: 4px; min-width: 0; }
                .field-label { font-weight: bold; margin-right: 5px; white-space: nowrap; line-height: 1.25; }
                .field-value { flex: 1 1 0; border-bottom: 0.6px dotted #000; min-height: 20px; padding: 3px 4px 0; line-height: 1.15; overflow-wrap: anywhere; word-break: break-word; white-space: normal; }
                table { width: 100% !important; border-collapse: collapse !important; margin-top: 4px; margin-bottom: 10px; font-size: 11px !important; line-height: 1.35 !important; table-layout: fixed !important; overflow-wrap: anywhere; word-break: break-word; }
                th, td { border: 0.6px solid #000 !important; padding: 7px 5px !important; vertical-align: middle !important; overflow: visible; text-overflow: clip; white-space: normal !important; overflow-wrap: anywhere; word-break: break-word; }
                th { background-color: #f7f7f7; font-weight: bold; text-align: center !important; vertical-align: middle !important; }
                td { text-align: left !important; }
                .overflow-x-auto { overflow: visible !important; }
                .salary-table { font-size: 6.2px !important; line-height: 1.25 !important; }
                .salary-table th, .salary-table td { padding: 3px !important; }
                .bold { font-weight: bold; }
                .italic { font-style: italic; }
                .text-center { text-align: center !important; }
            `}} />
            <div className="a4-page">
        
        <div className="text-center mb-6">
            <h1 className="text-xl font-bold uppercase">Lý Lịch Trích Ngang / Bản Chi Tiết Nhân Sự</h1>
        </div>

        
        <div className="section-title">I. Thông tin chung</div>
        
        <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-8 field-group"><span className="field-label">1. Họ tên khai sinh:</span><span className="field-value uppercase bold">{hoSo.ho_ten_khai_sinh || ""} </span></div>
            <div className="col-span-4 field-group"><span className="field-label">2. Ngày sinh:</span><span className="field-value">{formatDate(hoSo.ngay_sinh)}</span></div>
            
            <div className="col-span-12 field-group"><span className="field-label">3. Đơn vị:</span><span className="field-value">{hoSo.don_vi || ""}</span></div>
            
            <div className="col-span-6 field-group"><span className="field-label">4. Tháng năm vào quân đội:</span><span className="field-value">{hoSo.thang_nam_vao_quan_doi || ""}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">7. Nhóm máu:</span><span className="field-value">{hoSo.nhom_mau || ""}</span></div>

            <div className="col-span-4 field-group"><span className="field-label">5. Số CMQNCN:</span><span className="field-value">{hoSo.so_cmqncn || ""}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">5.1 Ngày cấp:</span><span className="field-value">{formatDate(hoSo.ngay_cap_cmqncn)}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">5.2 Nơi cấp:</span><span className="field-value">{hoSo.noi_cap_cmqncn || ""}</span></div>

            <div className="col-span-4 field-group"><span className="field-label">8. Số CCCD:</span><span className="field-value">{hoSo.so_cccd || ""}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">8.1 Ngày cấp:</span><span className="field-value">{formatDate(hoSo.ngay_cap_cccd)}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">8.2 Nơi cấp:</span><span className="field-value text-xs">{hoSo.noi_cap_cccd || ""}</span></div>
            
            <div className="col-span-4 field-group"><span className="field-label">8.3 Hạn sử dụng:</span><span className="field-value">{formatDate(hoSo.han_su_dung_cccd)}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">9. Trình độ ngoại ngữ:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">10. Khối quân:</span><span className="field-value">{hoSo.khoi_quan || ""}</span></div>

            <div className="col-span-6 field-group"><span className="field-label">11. Họ tên thường dùng:</span><span className="field-value">{hoSo.ten_thuong_dung || hoSo.tenThuongDung || ""}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">12. Tình trạng hôn nhân:</span><span className="field-value">{hoSo.tinh_trang_hon_nhan || ""}</span></div>

            <div className="col-span-12 field-group"><span className="field-label">6. Quê quán:</span><span className="field-value">{hoSo.que_quan || ""}</span></div>
            
            <div className="col-span-12 field-group mt-2"><span className="field-label italic underline">Nơi tạm trú:</span></div>
            <div className="col-span-12 field-group"><span className="field-label">15. Xã/Phường, Tỉnh/Thành:</span><span className="field-value"></span></div>
            <div className="col-span-12 field-group"><span className="field-label">16. Chi tiết:</span><span className="field-value"></span></div>

            <div className="col-span-12 field-group mt-2"><span className="field-label italic underline">Nơi ở hiện tại:</span></div>
            <div className="col-span-12 field-group"><span className="field-label">17. Xã/Phường, Tỉnh/Thành:</span><span className="field-value">{hoSo.noi_o_hien_tai || ""}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">18. Chi tiết:</span><span className="field-value">{hoSo.noi_o_chi_tiet || ""}</span></div>
        </div>

        
        <div className="section-title mt-4">II. Các mốc thời gian</div>
        <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-6 field-group"><span className="field-label">19. Tháng, năm Tuyển dụng:</span><span className="field-value">{hoSo.thang_nam_vao_quan_doi || ""}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">20. Tháng, năm Nhập ngũ:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">21. Tháng, năm Xuất ngũ:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">22. Tháng, năm Tái ngũ:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label"></span><span className="field-value border-none"></span></div>
            
            <div className="col-span-4 field-group"><span className="field-label">23. HSQ-BS sang QNCN:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">24. HSQ-BS sang CNVQP:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">25. CNVQP sang QNCN:</span><span className="field-value"></span></div>

            <div className="col-span-4 field-group"><span className="field-label">26. Ngày vào Đoàn:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">27. Ngày vào Đảng:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">Ngày chính thức:</span><span className="field-value"></span></div>
        </div>

        
        <div className="section-title mt-4">III. Thông tin đào tạo</div>
        <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-6 field-group"><span className="field-label">Trình độ văn hóa:</span><span className="field-value">{hoSo.trinh_do_van_hoa || ""}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">Trình độ đào tạo cao nhất:</span><span className="field-value">{hoSo.trinh_do_dao_tao_cao_nhat || ""}</span></div>
            
            <div className="col-span-6 field-group"><span className="field-label">Ngành nghề cao nhất:</span><span className="field-value">{hoSo.nganh_nghe_cao_nhat || ""}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">Năm tốt nghiệp:</span><span className="field-value">{field(hoSo, ['nam_tot_nghiep', 'nam_tot_nghiep_cao_nhat'])}</span></div>

            <div className="col-span-6 field-group"><span className="field-label">Trình độ liên quan CNQS:</span><span className="field-value">{field(hoSo, ['trinh_do_lien_quan_cnqs', 'trinh_do_dao_tao_cao_nhat'])}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">Ngành nghề CNQS:</span><span className="field-value">{field(hoSo, ['nganh_nghe_lien_quan_cnqs', 'nganh_nghe_cao_nhat'])}</span></div>
        </div>
        
        <div className="font-bold mt-2 mb-1 text-sm italic">Quá trình đào tạo lại:</div>
        <table>
            <thead>
                <tr>
                    <th style={{width: "12%"}}>Loại</th>
                    <th style={{width: "14%"}}>Bắt đầu</th>
                    <th style={{width: "14%"}}>Kết thúc</th>
                    <th style={{width: "25%"}}>Bậc đào tạo</th>
                    <th style={{width: "35%"}}>Tên trường</th>
                </tr>
            </thead>
            <tbody>
                {safeDaoTao.length > 0 ? safeDaoTao.map((dt, i) => (
                    <tr key={i}>
                        <td className="text-center">{field(dt, ['loai', 'loai_dao_tao'])}</td>
                        <td className="text-center">{field(dt, ['bat_dau', 'thoi_gian_bat_dau', 'batDau'])}</td>
                        <td className="text-center">{field(dt, ['ket_thuc', 'thoi_gian_ket_thuc', 'ketThuc'])}</td>
                        <td className="text-center">{field(dt, ['bac_dao_tao', 'bacDaoTao'])}</td>
                        <td>{field(dt, ['ten_truong', 'tenTruong'])}</td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>
        </table>
        
        
        <div className="section-title mt-4">IV. Đặc điểm nhận dạng & Sức khỏe</div>
        <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-4 field-group"><span className="field-label">Chiều cao (m):</span><span className="field-value">{field(hoSo, ['chieu_cao_m'])}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">Sống mũi:</span><span className="field-value">{field(hoSo, ['song_mui'])}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">Nếp tai dưới:</span><span className="field-value">{field(hoSo, ['nep_tai_duoi'])}</span></div>
            <div className="col-span-4 field-group"><span className="field-label">Dái tai:</span><span className="field-value">{field(hoSo, ['dai_tai'])}</span></div>
            <div className="col-span-8 field-group"><span className="field-label">Dấu vết riêng:</span><span className="field-value">{field(hoSo, ['dau_vet_rieng'])}</span></div>
            <div className="col-span-6 field-group"><span className="field-label">Hạn dùng:</span><span className="field-value">{field(hoSo, ['han_dung'])}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Thông tin sức khỏe:</span><span className="field-value">{field(hoSo, ['thong_tin_suc_khoe'])}</span></div>
        </div>
    </div>

    
    <div className="a4-page">
        
        <div className="section-title">V. Thông tin quan hệ gia đình</div>
        <table>
            <thead>
                <tr>
                    <th style={{width: "12%"}}>Mối quan hệ</th>
                    <th style={{width: "20%"}}>Họ và tên / SĐT</th>
                    <th style={{width: "8%"}}>Năm sinh</th>
                    <th style={{width: "12%"}}>Nghề nghiệp</th>
                    <th style={{width: "8%"}}>Trạng thái</th>
                    <th style={{width: "20%"}}>Nơi ở hiện tại</th>
                    <th style={{width: "20%"}}>Nơi ở chi tiết</th>
                </tr>
            </thead>
            <tbody>
                {safeGiaDinh.length > 0 ? safeGiaDinh.map((gd, i) => (
                    <tr key={i}>
                        <td className="font-bold text-center">{gd.relation || gd.moi_quan_he}</td>
                        <td>{gd.hoTen || gd.ho_ten} {gd.soDienThoai ? <><br /><span className="text-xs text-gray-600">{gd.soDienThoai}</span></> : ''}</td>
                        <td className="text-center">{gd.namSinh || gd.nam_sinh}</td>
                        <td>{gd.ngheNghiep || gd.nghe_nghiep}</td>
                        <td className="text-center">{gd.trangThai || gd.trang_thai}</td>
                        <td>{gd.noiOHienTai || gd.noi_o_hien_tai || ""}</td>
                        <td>{gd.noiOChiTiet || gd.noi_o_chi_tiet || gd.noi_o_hien_tai_chi_tiet || ""}</td>
                    </tr>
                )) : <tr><td colSpan="7" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>
        </table>

        
        <div className="section-title mt-6">VI. Đánh giá, Khen thưởng & Kỷ luật</div>
        
        <div className="font-bold mt-2 mb-2 text-sm italic underline">1. Xếp loại hoàn thành nhiệm vụ các năm:</div>
        <div className="grid grid-cols-12 gap-x-4 mb-4">
            <div className="col-span-12 field-group"><span className="field-label">Xuất sắc:</span><span className="field-value">{hoSo.nam_xep_loai_xuat_sac || hoSo.xep_loai_xuat_sac || ''}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Tốt:</span><span className="field-value">{hoSo.nam_xep_loai_tot || hoSo.xep_loai_tot || ''}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Hoàn thành:</span><span className="field-value">{hoSo.nam_xep_loai_hoan_thanh || hoSo.xep_loai_hoan_thanh || ''}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Không hoàn thành:</span><span className="field-value">{hoSo.nam_xep_loai_khong_hoan_thanh || hoSo.xep_loai_khong_hoan_thanh || ''}</span></div>
        </div>

        <div className="font-bold mt-2 mb-1 text-sm italic underline">2. Thông tin khen thưởng:</div>
        <table>
            <thead>
                <tr>
                    <th style={{width: "14%"}}>Ngày tháng năm</th>
                    <th style={{width: "13%"}}>Đánh giá xếp loại</th>
                    <th style={{width: "31%"}}>Lý do</th>
                    <th style={{width: "16%"}}>Loại</th>
                    <th style={{width: "26%"}}>Cấp</th>
                </tr>
            </thead>
            <tbody>
                {safeKhen.length > 0 ? safeKhen.map((kt, i) => (
                    <tr key={i}>
                        <td className="text-center">{formatDate(kt.ngayThangNam || kt.ngay)}</td>
                        <td className="text-center">{kt.danhGiaXepLoai || kt.danh_gia_xep_loai}</td>
                        <td>{kt.lyDo || kt.ly_do}</td>
                        <td>{kt.loai}</td>
                        <td>{kt.cap}</td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>
        </table>

        <div className="font-bold mt-2 mb-1 text-sm italic underline">3. Thông tin kỷ luật:</div>
        <table>
            <thead>
                <tr>
                    <th style={{width: "14%"}}>Ngày tháng năm</th>
                    <th style={{width: "13%"}}>Đánh giá xếp loại</th>
                    <th style={{width: "31%"}}>Lý do</th>
                    <th style={{width: "16%"}}>Loại</th>
                    <th style={{width: "26%"}}>Cấp</th>
                </tr>
            </thead>
            <tbody>
                {safeKy.length > 0 ? safeKy.map((kl, i) => (
                    <tr key={i}>
                        <td className="text-center">{formatDate(kl.ngayThangNam || kl.ngay)}</td>
                        <td className="text-center">{kl.danhGiaXepLoai || kl.danh_gia_xep_loai}</td>
                        <td>{kl.lyDo || kl.ly_do}</td>
                        <td>{kl.loai}</td>
                        <td>{kl.cap}</td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>
        </table>

        
        <div className="section-title mt-6">VII. Thông tin lương & Quá trình công tác</div>
        <div className="grid grid-cols-12 gap-x-4 mb-4">
            <div className="col-span-4 field-group"><span className="field-label">Bắt đầu đóng BHXH:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">Số sổ:</span><span className="field-value"></span></div>
            <div className="col-span-4 field-group"><span className="field-label">Theo chế độ:</span><span className="field-value"></span></div>
        </div>

        <div className="font-bold mt-2 mb-1 text-sm italic">Quá trình công tác và hưởng lương:</div>
        <div className="overflow-x-auto">
            <table className="salary-table text-[7px] w-full" style={{ tableLayout: "fixed", wordWrap: "break-word" }}>
                <thead>
                    <tr>
                        <th className="p-1" style={{width: "5%"}}>Từ tháng</th>
                        <th className="p-1" style={{width: "5%"}}>Đến tháng</th>
                        <th className="p-1" style={{width: "8%"}}>ĐV trực thuộc</th>
                        <th className="p-1" style={{width: "8%"}}>ĐV chi tiết</th>
                        <th className="p-1" style={{width: "7%"}}>Loại TĐ</th>
                        <th className="p-1" style={{width: "5%"}}>D.QL</th>
                        <th className="p-1" style={{width: "5%"}}>D.BT</th>
                        <th className="p-1" style={{width: "5%"}}>C.Bậc</th>
                        <th className="p-1" style={{width: "7%"}}>CV,CNQS</th>
                        <th className="p-1" style={{width: "5%"}}>TN CNQS</th>
                        <th className="p-1" style={{width: "5%"}}>Ngạch</th>
                        <th className="p-1" style={{width: "4%"}}>Nhóm</th>
                        <th className="p-1" style={{width: "4%"}}>Bậc</th>
                        <th className="p-1" style={{width: "4%"}}>HS</th>
                        <th className="p-1" style={{width: "4%"}}>VK%</th>
                        <th className="p-1" style={{width: "4%"}}>BL</th>
                        <th className="p-1" style={{width: "5%"}}>PC CV</th>
                        <th className="p-1" style={{width: "5%"}}>TN Nghề</th>
                        <th className="p-1" style={{width: "5%"}}>TN bđ nhận</th>
                    </tr>
                </thead>
                <tbody>
                    {safeLuong.length > 0 ? safeLuong.map((l, i) => (
                        <tr key={i}>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.tuThang || l.tu_thang || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.denThang || l.den_thang || ""}</td>
                            <td className="p-1" style={{wordBreak: 'break-word'}}>{l.capTrucThuoc || l.don_vi_cap_truc_thuoc || ""}</td>
                            <td className="p-1" style={{wordBreak: 'break-word'}}>{l.donViChiTiet || l.don_vi_chi_tiet || ""}</td>
                            <td className="p-1" style={{wordBreak: 'break-word'}}>{l.loaiThayDoi || l.loai_thay_doi || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.dienQuanLy || l.dien_quan_ly || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.dienBoTri || l.dien_bo_tri || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.capBac || l.cap_bac || ""}</td>
                            <td className="p-1" style={{wordBreak: 'break-word'}}>{l.chucVu || l.chuc_vu_cnqs || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.thamNienCNQS || l.tn_dam_nhan_cnqs || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.loaiNgach || l.loai_ngach || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.nhom || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.bac || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.heSo || l.he_so || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.pcVuotKhung || l.pc_vk || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.heSoBaoLuu || l.he_so_bl || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.pcChucVu || l.pc_chuc_vu || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.pcThamNienNghe || l.pc_tn_nghe || ""}</td>
                            <td className="p-1 text-center" style={{wordBreak: 'break-word'}}>{l.thamNienBatDau || l.tn_bat_dau_dam_nhan || ""}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="19" className="text-center italic text-gray-500 py-6">Chưa có dữ liệu quá trình công tác</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        <div className="flex justify-end mt-12">
            <div className="text-center">
                <p className="italic mb-1">........, ngày ..... tháng ..... năm .......</p>
                <p className="font-bold">Người khai</p>
                <p className="italic text-xs mb-12">(Ký và ghi rõ họ tên)</p>
                <p className="font-bold">{hoSo.ho_ten_khai_sinh || ""} </p>
            </div>
        </div>
    </div>
        </div>
    );
}
