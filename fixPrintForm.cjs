const fs = require('fs');
let c = fs.readFileSync('src/components/PrintForm.jsx', 'utf8');

// ===== 1. CSS: reduce padding, smaller font, fixed layout =====
c = c.replace(
    "padding: 15mm 10mm 10mm 15mm; box-sizing: border-box; position: relative; }",
    "padding: 10mm 10mm 10mm 10mm; box-sizing: border-box; position: relative; }"
);
// Also in @media print
c = c.replace(
    "padding: 15mm 10mm 10mm 15mm; page-break-after: always; }",
    "padding: 10mm 10mm 10mm 10mm; page-break-after: always; }"
);
// Table global CSS
c = c.replace(
    "table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; font-size: 13px; }",
    "table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; font-size: 11px; table-layout: fixed; word-wrap: break-word; overflow-wrap: break-word; }"
);
c = c.replace(
    'th, td { border: 1px solid #000; padding: 6px; vertical-align: middle; }',
    'th, td { border: 1px solid #000; padding: 4px; vertical-align: middle; overflow: hidden; text-overflow: ellipsis; }'
);

// ===== 2. Fix name =====
c = c.replace(
    '<span className="field-value">Trần Thị Thu Huyền</span>',
    '<span className="field-value">{hoSo.ten_thuong_dung || hoSo.tenThuongDung || ""}</span>'
);

// ===== 3. Đào tạo table =====
c = c.replace('<th className="w-16">Loại</th>',        '<th style={{width: "12%"}}>Loại</th>');
c = c.replace('<th className="w-20">Bắt đầu</th>',     '<th style={{width: "14%"}}>Bắt đầu</th>');
c = c.replace('<th className="w-20">Kết thúc</th>',     '<th style={{width: "14%"}}>Kết thúc</th>');
c = c.replace('<th className="w-32">Bậc đào tạo</th>',  '<th style={{width: "25%"}}>Bậc đào tạo</th>');
c = c.replace('<th>Tên trường</th>',                     '<th style={{width: "35%"}}>Tên trường</th>');

// ===== 4. Gia đình table =====
c = c.replace('<th className="w-20">Mối quan hệ</th>',  '<th style={{width: "12%"}}>Mối quan hệ</th>');
c = c.replace('<th>Họ và tên / SĐT</th>',               '<th style={{width: "20%"}}>Họ và tên / SĐT</th>');
c = c.replace('<th className="w-16">Năm sinh</th>',     '<th style={{width: "8%"}}>Năm sinh</th>');
c = c.replace('<th className="w-20">Nghề nghiệp</th>',  '<th style={{width: "12%"}}>Nghề nghiệp</th>');
c = c.replace('<th className="w-16">Trạng thái</th>',   '<th style={{width: "8%"}}>Trạng thái</th>');
c = c.replace('<th>Nơi ở hiện tại</th>',                 '<th style={{width: "20%"}}>Nơi ở hiện tại</th>');
c = c.replace('<th>Nơi ở chi tiết</th>',                 '<th style={{width: "20%"}}>Nơi ở chi tiết</th>');

// ===== 5. Khen thưởng table (first occurrence) =====
c = c.replace(/<th className="w-24">Ngày tháng năm<\/th>/g, '<th style={{width: "12%"}}>Ngày tháng năm</th>');
c = c.replace(/<th className="w-32">Đánh giá xếp loại<\/th>/g, '<th style={{width: "12%"}}>Đánh giá xếp loại</th>');
c = c.replace(/<th>Lý do<\/th>/g, '<th style={{width: "46%"}}>Lý do</th>');
c = c.replace(/<th className="w-28">Loại<\/th>/g, '<th style={{width: "15%"}}>Loại</th>');
c = c.replace(/<th className="w-32">Cấp<\/th>/g, '<th style={{width: "15%"}}>Cấp</th>');

// ===== 6. Quá trình công tác table =====
c = c.replace(
    '<table className="text-[9px] w-full">',
    '<table className="text-[7px] w-full" style={{ tableLayout: "fixed", wordWrap: "break-word" }}>'
);

const oldHeaders = [
    ['<th className="p-1">Từ tháng</th>',           '<th className="p-1" style={{width: "5%"}}>Từ tháng</th>'],
    ['<th className="p-1">Đến tháng</th>',          '<th className="p-1" style={{width: "5%"}}>Đến tháng</th>'],
    ['<th className="p-1">ĐV trực thuộc</th>',      '<th className="p-1" style={{width: "8%"}}>ĐV trực thuộc</th>'],
    ['<th className="p-1">ĐV chi tiết</th>',        '<th className="p-1" style={{width: "8%"}}>ĐV chi tiết</th>'],
    ['<th className="p-1">Loại thay đổi</th>',      '<th className="p-1" style={{width: "7%"}}>Loại TĐ</th>'],
    ['<th className="p-1">Diện QL</th>',             '<th className="p-1" style={{width: "5%"}}>D.QL</th>'],
    ['<th className="p-1">Diện bố trí</th>',         '<th className="p-1" style={{width: "5%"}}>D.BT</th>'],
    ['<th className="p-1">Cấp bậc</th>',             '<th className="p-1" style={{width: "5%"}}>C.Bậc</th>'],
    ['<th className="p-1">Chức vụ, CNQS</th>',       '<th className="p-1" style={{width: "7%"}}>CV,CNQS</th>'],
    ['<th className="p-1">T.N đảm nhận CNQS</th>',   '<th className="p-1" style={{width: "5%"}}>TN CNQS</th>'],
    ['<th className="p-1">Loại (ngạch)</th>',         '<th className="p-1" style={{width: "5%"}}>Ngạch</th>'],
    ['<th className="p-1">Nhóm</th>',                 '<th className="p-1" style={{width: "4%"}}>Nhóm</th>'],
    ['<th className="p-1">Bậc</th>',                  '<th className="p-1" style={{width: "4%"}}>Bậc</th>'],
    ['<th className="p-1">Hệ số</th>',                '<th className="p-1" style={{width: "4%"}}>HS</th>'],
    ['<th className="p-1">PC VK(%)</th>',              '<th className="p-1" style={{width: "4%"}}>VK%</th>'],
    ['<th className="p-1">HS BL</th>',                 '<th className="p-1" style={{width: "4%"}}>BL</th>'],
    ['<th className="p-1">PC C.Vụ</th>',               '<th className="p-1" style={{width: "5%"}}>PC CV</th>'],
    ['<th className="p-1">PC TN Nghề</th>',            '<th className="p-1" style={{width: "5%"}}>TN Nghề</th>'],
    ['<th className="p-1">T.N bắt đầu nhận</th>',     '<th className="p-1" style={{width: "5%"}}>TN bđ nhận</th>'],
];

for (const [old, replacement] of oldHeaders) {
    c = c.replace(old, replacement);
}

// ===== 7. Quá trình công tác tbody: map safeLuong =====
c = c.replace(
    /<tbody>\s*<tr>\s*<td colSpan="19" className="text-center italic text-gray-500 py-6">Chưa có dữ liệu quá trình công tác<\/td>\s*<\/tr>\s*<\/tbody>/,
    `<tbody>
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
                </tbody>`
);

fs.writeFileSync('src/components/PrintForm.jsx', c);
