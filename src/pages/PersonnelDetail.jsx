import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import html2pdf from 'html2pdf.js';

export default function PersonnelDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [data, setData] = useState({
        hoSo: null,
        daoTao: [],
        giaDinh: [],
        khenThuong: [],
        kyLuat: [],
        luong: []
    });

    useEffect(() => {
        async function fetchPersonnelData() {
            try {
                const [
                    { data: hoSo },
                    { data: daoTao },
                    { data: giaDinh },
                    { data: khenThuong },
                    { data: kyLuat },
                    { data: luong }
                ] = await Promise.all([
                    supabase.from('ho_so_qncn').select('*').eq('id', id).single(),
                    supabase.from('dao_tao_lai').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                    supabase.from('gia_dinh').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                    supabase.from('khen_thuong').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                    supabase.from('ky_luat').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true }),
                    supabase.from('luong_qua_trinh').select('*').eq('ho_so_id', id).order('thu_tu', { ascending: true })
                ]);

                setData({
                    hoSo: hoSo || null,
                    daoTao: daoTao || [],
                    giaDinh: giaDinh || [],
                    khenThuong: khenThuong || [],
                    kyLuat: kyLuat || [],
                    luong: luong || []
                });
            } catch (err) {
                console.error("Lỗi tải chi tiết:", err);
                alert("Lỗi khi tải chi tiết hồ sơ.");
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchPersonnelData();
        }
    }, [id]);

    const handleExportPDF = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const element = document.getElementById('pdf-content');
            
            // html2pdf margin: [top, left, bottom, right] -> top 20, left 20, bottom 20, right 15
            const opt = {
                margin: [20, 20, 20, 15], 
                filename: `CV_${data.hoSo.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}.pdf`,
                image: { type: 'jpeg', quality: 0.8 }, // Giảm quality để nén ảnh
                html2canvas: { scale: 1.5, useCORS: true }, // scale 1.5 đủ sắc nét mà không quá nặng
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true } // compress: true để nén luồng PDF
            };

            // Tạo PDF dạng blob (chưa tải xuống ngay)
            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            
            // Upload lên Supabase
            const fileName = `CV_${data.hoSo.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}_${Date.now()}.pdf`;
            const filePath = `${id}/pdf/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('file_qncn')
                .upload(filePath, pdfBlob, {
                    contentType: 'application/pdf',
                    cacheControl: '3600',
                    upsert: false
                });
                
            if (uploadError) throw uploadError;

            // Tự động kích hoạt tải file về máy
            const { data: { publicUrl } } = supabase.storage.from('file_qncn').getPublicUrl(filePath);
            
            const link = document.createElement('a');
            link.href = publicUrl;
            link.download = fileName; // Bắt buộc tên file tải về
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Lỗi khi xuất PDF:', error);
            alert('Có lỗi xảy ra: ' + (error.message || JSON.stringify(error)));
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center text-blue-600">
                    <i className="fas fa-spinner fa-spin text-3xl mb-2"></i>
                    <p>Đang tải hồ sơ...</p>
                </div>
            </div>
        );
    }

    if (!data.hoSo) {
        return (
            <div className="text-center p-10">
                <p className="text-red-500 font-bold mb-4">Không tìm thấy hồ sơ.</p>
                <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Quay lại</button>
            </div>
        );
    }

    const { hoSo, daoTao, giaDinh, khenThuong, kyLuat, luong } = data;

    return (
        <div className="bg-slate-50 min-h-screen text-gray-800 antialiased pb-20 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

                .timeline-item relative::before {
                    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #e2e8f0;
                }

                @media print {
                    @page { margin: 2cm 1.5cm 2cm 2cm; size: A4; }
                    body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-break-avoid { break-inside: avoid; page-break-inside: avoid; }
                    .shadow-lg, .shadow-md, .shadow-sm { box-shadow: none !important; }
                    .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    
                    .grid-cols-12 { display: grid !important; grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
                    .col-span-4 { grid-column: span 4 / span 4 !important; }
                    .col-span-8 { grid-column: span 8 / span 8 !important; }
                    
                    .table-container { overflow: visible !important; }
                    .print-border { border: 1px solid #e2e8f0 !important; }
                    
                    /* Force hiding the AdminLayout sidebar and header in print */
                    #admin-sidebar, #admin-header { display: none !important; }
                    main { margin-left: 0 !important; padding: 0 !important; }
                }
            `}} />

            <div className="max-w-6xl mx-auto">
                
                <div className="flex justify-between items-center mb-6 no-print">
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm font-medium transition-colors flex items-center">
                        <i className="fas fa-arrow-left mr-2 text-gray-500"></i> Quay lại
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => navigate(`/personnel/edit/${id}`)} className="px-5 py-2 bg-yellow-500 rounded-lg text-white hover:bg-yellow-600 shadow-md font-medium transition-colors flex items-center">
                            <i className="fas fa-edit mr-2"></i> Sửa hồ sơ
                        </button>
                        <button onClick={handleExportPDF} disabled={isExporting} className={`px-5 py-2 rounded-lg text-white shadow-md font-medium transition-colors flex items-center ${isExporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'}`}>
                            {isExporting ? <><i className="fas fa-spinner fa-spin mr-2"></i> Đang nén & lưu PDF...</> : <><i className="fas fa-file-pdf mr-2"></i> Xuất PDF</>}
                        </button>
                    </div>
                </div>

                <div id="pdf-content" className="bg-white rounded-2xl shadow-lg print-border overflow-hidden">
                    
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                            <i className="fas fa-shield-alt" style={{ fontSize: '12rem' }}></i>
                        </div>
                        
                        <div className="w-24 h-24 bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center shrink-0 z-10 backdrop-blur-sm">
                            <i className="fas fa-user-tie text-4xl text-white"></i>
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left z-10">
                            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-1.5">{hoSo.ho_ten_khai_sinh}</h1>
                            <p className="text-blue-200 text-base font-medium mb-3 uppercase">{hoSo.nganh_nghe_cao_nhat || 'Chưa cập nhật'} • <span className="text-white">{hoSo.don_vi || 'Đơn vị'}</span></p>
                            
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm mt-2 text-blue-100">
                                <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-full"><i className="fas fa-id-card mr-2"></i>CMQNCN: {hoSo.so_cmqncn_cmsq || 'Chưa có'}</div>
                                <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-full"><i className="fas fa-users mr-2"></i>Khối: {hoSo.khoi_quan || 'Chưa cập nhật'}</div>
                                <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-full"><i className="fas fa-calendar-alt mr-2"></i>Nhập ngũ: {hoSo.tn_nhap_ngu || hoSo.tn_tuyen_dung || 'Chưa rõ'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        <div className="lg:col-span-4 space-y-8">
                            
                            <div className="print-break-avoid">
                                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i className="fas fa-info-circle w-4 h-4 flex items-center justify-center"></i></span> Thông tin cá nhân
                                </h2>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Ngày sinh</span>
                                        <span className="text-gray-900 font-medium">{hoSo.ngay_sinh || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Giới tính</span>
                                        <span className="text-gray-900 font-medium">Nam</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Nhóm máu</span>
                                        <span className="text-gray-900 font-medium text-red-500 font-bold">{hoSo.nhom_mau || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Hôn nhân</span>
                                        <span className="text-gray-900 font-medium">{hoSo.tinh_trang_hon_nhan || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Ngoại ngữ</span>
                                        <span className="text-gray-900 font-medium">{hoSo.trinh_do_ngoai_ngu || '-'}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="print-break-avoid">
                                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i className="fas fa-map-marker-alt w-4 h-4 flex items-center justify-center"></i></span> Địa chỉ liên hệ
                                </h2>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-500 mb-1"><i className="fas fa-home mr-1 opacity-50"></i> Quê quán</p>
                                        <p className="text-gray-900 font-medium">{hoSo.que_quan || '-'}</p>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="font-medium text-gray-500 mb-1"><i className="fas fa-map-pin mr-1 opacity-50"></i> Nơi ở hiện tại</p>
                                        <p className="text-gray-900 font-medium">{hoSo.noi_o_hien_tai_chi_tiet ? `${hoSo.noi_o_hien_tai_chi_tiet}, ` : ''}{hoSo.noi_o_hien_tai || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="print-break-avoid">
                                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i className="fas fa-id-badge w-4 h-4 flex items-center justify-center"></i></span> Giấy tờ tùy thân
                                </h2>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm">
                                    <p className="font-semibold text-gray-800 mb-1">Căn cước công dân</p>
                                    <p className="text-xl font-bold text-blue-800 tracking-wider mb-2">{hoSo.so_cccd || 'Chưa cập nhật'}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>Cấp: {hoSo.ngay_cap_cccd || '-'}</span>
                                        <span>Hết hạn: {hoSo.han_su_dung_cccd || '-'}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Nơi cấp: {hoSo.noi_cap_cccd || '-'}</p>
                                </div>
                            </div>

                            <div className="print-break-avoid">
                                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i className="fas fa-heartbeat w-4 h-4 flex items-center justify-center"></i></span> Nhận dạng & Sức khỏe
                                </h2>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Sức khỏe</span>
                                        <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">{hoSo.thong_tin_suc_khoe || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Chiều cao</span>
                                        <span className="text-gray-900 font-medium">{hoSo.chieu_cao_m ? `${hoSo.chieu_cao_m} m` : '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Dấu vết riêng</span>
                                        <span className="text-gray-900 font-medium text-right w-1/2">{hoSo.dau_vet_rieng || '-'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-medium text-gray-500">Hạn dùng (CMTQĐ)</span>
                                        <span className="text-gray-900 font-medium">{hoSo.han_dung || '-'}</span>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            
                            <div className="print-break-avoid">
                                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide">
                                    <i className="fas fa-flag text-blue-600 mr-2"></i> Trục thời gian Đảng / Đoàn
                                </h2>
                                <div className="relative pl-6 border-l-2 border-blue-200 space-y-6">
                                    {(hoSo.tn_tuyen_dung || hoSo.tn_nhap_ngu) && (
                                        <div className="relative">
                                            <div className="absolute -left-8 bg-blue-600 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                            <h3 className="font-bold text-gray-800">Tuyển dụng / Nhập ngũ</h3>
                                            <p className="text-sm text-gray-500">
                                                {hoSo.tn_tuyen_dung ? `Tuyển dụng: ${hoSo.tn_tuyen_dung}` : ''}
                                                {hoSo.tn_tuyen_dung && hoSo.tn_nhap_ngu ? ' | ' : ''}
                                                {hoSo.tn_nhap_ngu ? `Nhập ngũ: ${hoSo.tn_nhap_ngu}` : ''}
                                            </p>
                                        </div>
                                    )}
                                    {hoSo.ngay_vao_doan && (
                                        <div className="relative">
                                            <div className="absolute -left-8 bg-blue-400 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                            <h3 className="font-bold text-gray-800">Kết nạp Đoàn TNCS HCM</h3>
                                            <p className="text-sm text-gray-500">Ngày {hoSo.ngay_vao_doan}</p>
                                        </div>
                                    )}
                                    {(hoSo.ngay_vao_dang || hoSo.ngay_chinh_thuc_dang) && (
                                        <div className="relative">
                                            <div className="absolute -left-8 bg-red-500 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                            <h3 className="font-bold text-gray-800">Kết nạp Đảng CSVN</h3>
                                            <p className="text-sm text-gray-500">
                                                Dự bị: {hoSo.ngay_vao_dang || '-'} <span className="mx-2">|</span> Chính thức: {hoSo.ngay_chinh_thuc_dang || '-'}
                                            </p>
                                        </div>
                                    )}
                                    {(!hoSo.tn_tuyen_dung && !hoSo.tn_nhap_ngu && !hoSo.ngay_vao_doan && !hoSo.ngay_vao_dang && !hoSo.ngay_chinh_thuc_dang) && (
                                        <p className="text-sm text-gray-500 italic">Chưa có thông tin.</p>
                                    )}
                                </div>
                            </div>

                            <div className="print-break-avoid">
                                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                                    <i className="fas fa-graduation-cap text-blue-600 mr-2"></i> Quá trình Đào tạo
                                </h2>
                                
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                        <h3 className="font-bold text-blue-900 text-lg">{hoSo.trinh_do_dao_tao_cao_nhat || 'Chưa cập nhật'} - {hoSo.nganh_nghe_cao_nhat || ''}</h3>
                                        <span className="bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full w-max">Trình độ cao nhất</span>
                                    </div>
                                    <p className="text-sm text-gray-600"><i className="fas fa-calendar-check mr-2 opacity-50"></i>Năm tốt nghiệp: {hoSo.nam_tot_nghiep || '-'}</p>
                                </div>

                                <h4 className="font-semibold text-gray-700 text-sm mb-2 mt-4">Thông tin đào tạo lại / Bổ túc</h4>
                                {daoTao.length > 0 ? (
                                    <div className="overflow-x-auto custom-scrollbar border rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-600">
                                                <tr>
                                                    <th className="px-4 py-2 font-medium">Thời gian</th>
                                                    <th className="px-4 py-2 font-medium">Loại / Bậc</th>
                                                    <th className="px-4 py-2 font-medium">Cơ sở đào tạo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {daoTao.map((dt) => (
                                                    <tr key={dt.id} className="border-t border-gray-100">
                                                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">{dt.bat_dau || ''} - {dt.ket_thuc || ''}</td>
                                                        <td className="px-4 py-3"><span className="font-medium text-gray-800">{dt.loai || '-'}</span><br/><span className="text-xs text-gray-500">{dt.bac_dao_tao || '-'}</span></td>
                                                        <td className="px-4 py-3">{dt.ten_truong || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Không có dữ liệu đào tạo lại.</p>
                                )}
                            </div>

                            <div className="print-break-avoid">
                                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                                    <i className="fas fa-star text-yellow-500 mr-2"></i> Thành tích & Kỷ luật
                                </h2>
                                
                                <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
                                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                        <div className="text-2xl font-black text-blue-700">{hoSo.xep_loai_xuat_sac || 0}</div>
                                        <div className="text-[10px] sm:text-xs uppercase font-semibold text-gray-600 mt-1">Năm Xuất sắc</div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                                        <div className="text-2xl font-black text-green-600">{hoSo.xep_loai_tot || 0}</div>
                                        <div className="text-[10px] sm:text-xs uppercase font-semibold text-gray-600 mt-1">Năm Tốt</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                                        <div className="text-2xl font-black text-gray-600">{hoSo.xep_loai_hoan_thanh || 0}</div>
                                        <div className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 mt-1">Hoàn thành</div>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                                        <div className="text-2xl font-black text-red-500">{hoSo.xep_loai_khong_hoan_thanh || 0}</div>
                                        <div className="text-[10px] sm:text-xs uppercase font-semibold text-gray-600 mt-1">Không HT</div>
                                    </div>
                                </div>

                                {khenThuong.length > 0 ? (
                                    <div className="relative pl-6 border-l-2 border-green-200 space-y-4">
                                        {khenThuong.map((kt) => (
                                            <div key={kt.id} className="relative">
                                                <div className="absolute -left-[29px] bg-white text-green-500 h-6 w-6 rounded-full border-2 border-green-200 flex items-center justify-center"><i className="fas fa-trophy text-xs"></i></div>
                                                <h3 className="font-bold text-gray-800">{kt.danh_gia_xep_loai || 'Khen thưởng'} - {kt.cap || ''}</h3>
                                                <p className="text-xs text-gray-500 font-medium mb-1">{kt.ngay || ''}</p>
                                                <p className="text-sm text-gray-700">{kt.ly_do || ''}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic"><i className="fas fa-info-circle text-gray-400 mr-1"></i> Chưa có bản ghi khen thưởng.</p>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                    {kyLuat.length > 0 ? (
                                        <div className="relative pl-6 border-l-2 border-red-200 space-y-4">
                                            {kyLuat.map((kl) => (
                                                <div key={kl.id} className="relative">
                                                    <div className="absolute -left-[29px] bg-white text-red-500 h-6 w-6 rounded-full border-2 border-red-200 flex items-center justify-center"><i className="fas fa-exclamation-triangle text-xs"></i></div>
                                                    <h3 className="font-bold text-gray-800">{kl.danh_gia_xep_loai || 'Kỷ luật'} - {kl.cap || ''}</h3>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">{kl.ngay || ''}</p>
                                                    <p className="text-sm text-gray-700">{kl.ly_do || ''}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic"><i className="fas fa-check-circle text-green-500 mr-1"></i> Không có bản ghi kỷ luật.</p>
                                    )}
                                </div>
                            </div>

                            <div className="print-break-avoid">
                                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                                    <i className="fas fa-users text-blue-600 mr-2"></i> Quan hệ gia đình
                                </h2>
                                
                                {giaDinh.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {giaDinh.map((gd) => {
                                            const isDead = gd.trang_thai === 'Đã mất';
                                            return (
                                                <div key={gd.id} className={`border border-gray-200 p-3 rounded-xl hover:shadow-md transition-shadow ${isDead ? 'opacity-75' : ''}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`font-bold text-gray-800 text-sm ${isDead ? 'line-through' : ''}`}>{gd.ho_ten || '-'}</h4>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${gd.moi_quan_he === 'Vợ (chồng)' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-600'}`}>{gd.moi_quan_he || '-'}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-1">Sinh: {gd.nam_sinh || '-'} • {gd.nghe_nghiep || '-'} • <span className={isDead ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>{isDead ? `Đã mất (${gd.nam_chet || ''})` : 'Còn sống'}</span></p>
                                                    {gd.so_dien_thoai && <p className="text-xs text-gray-600"><i className="fas fa-phone mr-1 opacity-50"></i>{gd.so_dien_thoai}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Chưa có thông tin gia đình.</p>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100">
                        <div className="print-break-avoid">
                            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-5 flex items-center uppercase tracking-wide">
                                <i className="fas fa-money-check-alt text-blue-600 mr-2"></i> Quá trình công tác & Hưởng lương
                            </h2>
                            
                            <div className="flex flex-wrap gap-6 mb-6 text-sm">
                                <div className="flex items-center"><i className="fas fa-file-contract text-gray-400 mr-2 text-lg"></i> <div><p className="text-xs text-gray-500 font-medium">Theo chế độ</p><p className="font-bold text-gray-800">{hoSo.theo_che_do || '-'}</p></div></div>
                                <div className="flex items-center"><i className="fas fa-calendar-alt text-gray-400 mr-2 text-lg"></i> <div><p className="text-xs text-gray-500 font-medium">Bắt đầu BHXH</p><p className="font-bold text-gray-800">{hoSo.bat_dau_dong_bhxh || '-'}</p></div></div>
                                <div className="flex items-center"><i className="fas fa-book-medical text-gray-400 mr-2 text-lg"></i> <div><p className="text-xs text-gray-500 font-medium">Sổ BHXH/BHYT</p><p className="font-bold text-gray-800">{hoSo.so_so_bhxh || '-'}</p></div></div>
                            </div>

                            {luong.length > 0 ? (
                                <div className="overflow-x-auto custom-scrollbar bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <table className="w-full text-sm text-left whitespace-nowrap">
                                        <thead className="bg-blue-50 text-blue-900 border-b border-blue-100">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-center w-12">#</th>
                                                <th className="px-4 py-3 font-semibold">Thời gian</th>
                                                <th className="px-4 py-3 font-semibold">Đơn vị công tác</th>
                                                <th className="px-4 py-3 font-semibold">Cấp bậc / Chức vụ</th>
                                                <th className="px-4 py-3 font-semibold text-center">Ngạch/Bậc</th>
                                                <th className="px-4 py-3 font-semibold text-center rounded-tr-xl">Hệ số</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {luong.map((l, index) => {
                                                const isLatest = index === luong.length - 1;
                                                return (
                                                    <tr key={l.id} className={`hover:bg-gray-50 transition-colors ${isLatest ? 'bg-blue-50/30' : ''}`}>
                                                        <td className="px-4 py-3 text-center text-gray-400 font-medium">{index + 1}</td>
                                                        <td className={`px-4 py-3 ${isLatest ? 'text-gray-800 font-bold flex items-center' : 'text-gray-600 font-medium'}`}>
                                                            {isLatest && <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>}
                                                            {l.tu_thang || ''} - {l.den_thang || 'Nay'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-gray-800">{l.don_vi_cap_truc_thuoc || '-'}</p>
                                                            <p className="text-xs text-gray-500">{l.don_vi_chi_tiet || '-'}</p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-gray-800">{l.chuc_vu_cnqs || '-'}</p>
                                                            <p className="text-xs text-blue-600 font-medium">{l.cap_bac || '-'} {l.loai_thay_doi ? `(${l.loai_thay_doi})` : ''}</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{l.loai_ngach || '-'}</span><br/>
                                                            <span className="text-xs font-medium text-gray-500 mt-1 inline-block">{l.bac || '-'}/{l.nhom || '-'}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-bold text-lg text-blue-700">{l.he_so ? l.he_so.toFixed(2) : '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Chưa có quá trình công tác.</p>
                            )}
                        </div>
                    </div>

                </div>

                <div className="hidden print-header mt-12 px-10">
                    <div className="grid grid-cols-2 text-center text-gray-800">
                        <div>
                            <p className="font-bold text-sm uppercase">Người khai</p>
                            <p className="italic text-xs text-gray-500 mb-20">(Ký, ghi rõ họ tên)</p>
                            <p className="font-bold">{hoSo.ho_ten_khai_sinh}</p>
                        </div>
                        <div>
                            <p className="italic text-xs text-gray-500 mb-1">Ngày ..... tháng ..... năm 20.....</p>
                            <p className="font-bold text-sm uppercase">Thủ trưởng đơn vị</p>
                            <p className="italic text-xs text-gray-500 mb-20">(Ký, đóng dấu, ghi rõ họ tên)</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
