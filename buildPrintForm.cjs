const fs = require('fs');
let html = fs.readFileSync('thongtin.json', 'utf8');

html = html.replace(/class=/g, 'className=');
html = html.replace(/<!--.*?-->/gs, '');
html = html.replace(/<br>/g, '<br />');
html = html.replace(/<img(.*?)>/g, '<img$1 />');
html = html.replace(/colspan=/g, 'colSpan=');

const startIndex = html.indexOf('<div className="a4-page">');
const endIndex = html.lastIndexOf('</body>');
html = html.substring(startIndex, endIndex).trim();

// Mapping replacements
html = html.replace(/>TRẦN THỊ THU HUYỀN</g, '>{hoSo.ho_ten_khai_sinh || ""} <');
html = html.replace(/>23\/07\/1990</g, '>{formatDate(hoSo.ngay_sinh)}<');
html = html.replace(/>Khoa Gây mê, Bệnh viện Quân y 103</g, '>{hoSo.don_vi || ""}<');
html = html.replace(/>10\/2011</g, '>{hoSo.thang_nam_vao_quan_doi || ""}<');
html = html.replace(/>O</g, '>{hoSo.nhom_mau || ""}<');
html = html.replace(/>659011140456</g, '>{hoSo.so_cmqncn || ""}<');
html = html.replace(/>04\/04\/2019</g, '>{formatDate(hoSo.ngay_cap_cmqncn)}<');
html = html.replace(/>Học viện Quân y</g, '>{hoSo.noi_cap_cmqncn || ""}<');
html = html.replace(/>001190032893</g, '>{hoSo.so_cccd || ""}<');
html = html.replace(/>25\/04\/2021</g, '>{formatDate(hoSo.ngay_cap_cccd)}<');
html = html.replace(/>Cục CSQLHC về TTXH</g, '>{hoSo.noi_cap_cccd || ""}<');
html = html.replace(/>23\/07\/2030</g, '>{formatDate(hoSo.han_su_dung_cccd)}<');
html = html.replace(/>Dự toán</g, '>{hoSo.khoi_quan || ""}<');
html = html.replace(/>Đã kết hôn</g, '>{hoSo.tinh_trang_hon_nhan || ""}<');
html = html.replace(/>Hát Môn, Hà Nội</g, '>{hoSo.que_quan || ""}<');
html = html.replace(/>Bình Minh, Hà Nội</g, '>{hoSo.noi_o_hien_tai || ""}<');
html = html.replace(/>SN1010, Tòa HH01C KĐT Thanh Hà</g, '>{hoSo.noi_o_chi_tiet || ""}<');

html = html.replace(/>12\/12</g, '>{hoSo.trinh_do_van_hoa || ""}<');
html = html.replace(/>Cao đẳng</g, '>{hoSo.trinh_do_dao_tao_cao_nhat || ""}<');
html = html.replace(/>Điều dưỡng</g, '>{hoSo.nganh_nghe_cao_nhat || ""}<');
html = html.replace(/>2018</g, '>{hoSo.nam_tot_nghiep_cao_nhat || ""}<');

const daoTaoRegex = /Quá trình đào tạo lại:.*?<tbody>.*?<\/tbody>/s;
const daoTaoMap = `Quá trình đào tạo lại:</div>
        <table>
            <thead>
                <tr>
                    <th className="w-16">Loại</th>
                    <th className="w-20">Bắt đầu</th>
                    <th className="w-20">Kết thúc</th>
                    <th className="w-32">Bậc đào tạo</th>
                    <th>Tên trường</th>
                </tr>
            </thead>
            <tbody>
                {safeDaoTao.length > 0 ? safeDaoTao.map((dt, i) => (
                    <tr key={i}>
                        <td className="text-center">{dt.loai_dao_tao}</td>
                        <td className="text-center">{dt.thoi_gian_bat_dau}</td>
                        <td className="text-center">{dt.thoi_gian_ket_thuc}</td>
                        <td className="text-center">{dt.bac_dao_tao}</td>
                        <td>{dt.ten_truong}</td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>`;
html = html.replace(daoTaoRegex, daoTaoMap);

const giaDinhRegex = /V\. Thông tin quan hệ gia đình.*?<tbody>.*?<\/tbody>/s;
const giaDinhMap = `V. Thông tin quan hệ gia đình</div>
        <table>
            <thead>
                <tr>
                    <th className="w-20">Mối quan hệ</th>
                    <th>Họ và tên / SĐT</th>
                    <th className="w-16">Năm sinh</th>
                    <th className="w-20">Nghề nghiệp</th>
                    <th className="w-16">Trạng thái</th>
                    <th>Nơi ở hiện tại</th>
                    <th>Nơi ở chi tiết</th>
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
                        <td>{gd.noiOHienTai || gd.noi_o_hien_tai}</td>
                        <td>{gd.noiOChiTiet || gd.noi_o_chi_tiet}</td>
                    </tr>
                )) : <tr><td colSpan="7" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>`;
html = html.replace(giaDinhRegex, giaDinhMap);

const khenRegex = /2\. Thông tin khen thưởng:.*?<tbody>.*?<\/tbody>/s;
const khenMap = `2. Thông tin khen thưởng:</div>
        <table>
            <thead>
                <tr>
                    <th className="w-24">Ngày tháng năm</th>
                    <th className="w-32">Đánh giá xếp loại</th>
                    <th>Lý do</th>
                    <th className="w-28">Loại</th>
                    <th className="w-32">Cấp</th>
                </tr>
            </thead>
            <tbody>
                {safeKhen.length > 0 ? safeKhen.map((kt, i) => (
                    <tr key={i}>
                        <td className="text-center">{formatDate(kt.ngayThangNam || kt.ngay)}</td>
                        <td className="text-center">{kt.danhGiaXepLoai || kt.danh_gia_xep_loai}</td>
                        <td>{kt.lyDo || kt.ly_do}</td>
                        <td className="text-center">{kt.loai}</td>
                        <td className="text-center">{kt.cap}</td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>`;
html = html.replace(khenRegex, khenMap);

const kyRegex = /3\. Thông tin kỷ luật:.*?<tbody>.*?<\/tbody>/s;
const kyMap = `3. Thông tin kỷ luật:</div>
        <table>
            <thead>
                <tr>
                    <th className="w-24">Ngày tháng năm</th>
                    <th className="w-32">Đánh giá xếp loại</th>
                    <th>Lý do</th>
                    <th className="w-28">Loại</th>
                    <th className="w-32">Cấp</th>
                </tr>
            </thead>
            <tbody>
                {safeKy.length > 0 ? safeKy.map((kl, i) => (
                    <tr key={i}>
                        <td className="text-center">{formatDate(kl.ngayThangNam || kl.ngay)}</td>
                        <td className="text-center">{kl.danhGiaXepLoai || kl.danh_gia_xep_loai}</td>
                        <td>{kl.lyDo || kl.ly_do}</td>
                        <td className="text-center">{kl.loai}</td>
                        <td className="text-center">{kl.cap}</td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center italic text-gray-500 py-4">Không có dữ liệu</td></tr>}
            </tbody>`;
html = html.replace(kyRegex, kyMap);

const xepLoaiRegex = /1\. Xếp loại hoàn thành nhiệm vụ các năm:.*?<\/div>\s*<\/div>/s;
const xepLoaiMap = `1. Xếp loại hoàn thành nhiệm vụ các năm:</div>
        <div className="grid grid-cols-12 gap-x-4 mb-4">
            <div className="col-span-12 field-group"><span className="field-label">Xuất sắc:</span><span className="field-value">{hoSo.nam_xep_loai_xuat_sac || hoSo.xep_loai_xuat_sac || ''}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Tốt:</span><span className="field-value">{hoSo.nam_xep_loai_tot || hoSo.xep_loai_tot || ''}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Hoàn thành:</span><span className="field-value">{hoSo.nam_xep_loai_hoan_thanh || hoSo.xep_loai_hoan_thanh || ''}</span></div>
            <div className="col-span-12 field-group"><span className="field-label">Không hoàn thành:</span><span className="field-value">{hoSo.nam_xep_loai_khong_hoan_thanh || hoSo.xep_loai_khong_hoan_thanh || ''}</span></div>
        </div>`;
html = html.replace(xepLoaiRegex, xepLoaiMap);


const componentCode = `import React from 'react';

export default function PrintForm({ data }) {
    if (!data || !data.hoSo) return null;
    const { hoSo, daoTao, giaDinh, khenThuong, kyLuat, luong, congTac } = data;

    const formatDate = (d) => {
        if (!d) return '';
        try {
            const date = new Date(d);
            if (isNaN(date.getTime())) return d;
            return date.toLocaleDateString('vi-VN');
        } catch { return d; }
    };

    const safeDaoTao = daoTao || [];
    const safeGiaDinh = giaDinh || [];
    const safeKhen = khenThuong || [];
    const safeKy = kyLuat || [];
    const safeLuong = luong || [];
    const safeCongTac = congTac || [];

    return (
        <div className="print-form-container bg-white text-black text-sm" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <style dangerouslySetInnerHTML={{ __html: \`
                .a4-page { width: 210mm; min-height: 297mm; background-color: white; margin-bottom: 20px; padding: 15mm 10mm 10mm 15mm; box-sizing: border-box; position: relative; }
                @media print {
                    body { background-color: white; padding: 0; }
                    .a4-page { box-shadow: none; margin: 0; padding: 15mm 10mm 10mm 15mm; page-break-after: always; }
                    .no-print { display: none !important; }
                }
                .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #000; margin-top: 15px; margin-bottom: 10px; padding-bottom: 3px; }
                .field-group { display: flex; align-items: baseline; margin-bottom: 6px; }
                .field-label { font-weight: bold; margin-right: 5px; white-space: nowrap; }
                .field-value { flex-grow: 1; border-bottom: 1px dotted #888; min-height: 18px; padding-left: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; font-size: 13px; }
                th, td { border: 1px solid #000; padding: 6px; vertical-align: middle; }
                th { background-color: #f3f4f6; font-weight: bold; text-align: center; }
                .bold { font-weight: bold; }
                .italic { font-style: italic; }
                .text-center { text-align: center; }
            \`}} />
            ${html}
        </div>
    );
}
`;

fs.writeFileSync('src/components/PrintForm.jsx', componentCode);
console.log('Done cleaning and writing');
