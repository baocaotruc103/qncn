import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import html2pdf from 'html2pdf.js';
import TabThongTinChung from '../components/TabThongTinChung';
import TabDaoTao from '../components/TabDaoTao';
import TabGiaDinh from '../components/TabGiaDinh';
import TabKhenKyLuat from '../components/TabKhenKyLuat';
import TabNhanDang from '../components/TabNhanDang';
import TabLuong from '../components/TabLuong';
import PrintForm from '../components/PrintForm';
import { useAuth } from '../contexts/authContextBase';

const SALARY_EXPORT_WIDTH_PX = 1046;

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
};

export default function PersonnelDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const pdfRef = useRef(null);
    const pdfFormRef = useRef(null);
    const pdfLuongRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingForm, setIsExportingForm] = useState(false);
    const [isExportingLuong, setIsExportingLuong] = useState(false);
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

    const patchHtml2Canvas = () => {
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function(el, pseudo) {
            const style = originalGetComputedStyle(el, pseudo);
            return new Proxy(style, {
                get(target, prop) {
                    if (prop === 'getPropertyValue') {
                        return function(name) {
                            let val = target.getPropertyValue(name);
                            if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
                                if (name.includes('background')) return 'rgb(255, 255, 255)';
                                if (name.includes('color')) return 'rgb(0, 0, 0)';
                                if (name.includes('border')) return 'rgb(200, 200, 200)';
                                return 'none';
                            }
                            return val;
                        };
                    }
                    let val = target[prop];
                    if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
                        const propString = String(prop).toLowerCase();
                        if (propString.includes('background')) return 'rgb(255, 255, 255)';
                        if (propString.includes('color')) return 'rgb(0, 0, 0)';
                        if (propString.includes('border')) return 'rgb(200, 200, 200)';
                        return 'none';
                    }
                    if (typeof val === 'function') {
                        return val.bind(target);
                    }
                    return val;
                }
            });
        };
        return () => { window.getComputedStyle = originalGetComputedStyle; };
    };

    const handleExportPDF = async () => {
        if (!window.confirm("Bạn có chắc muốn xuất lý lịch không")) return;
        if (isExporting) return;
        setIsExporting(true);
        const unpatch = patchHtml2Canvas();
        try {
            const element = pdfRef.current;
            if (!element) throw new Error("Không tìm thấy nội dung PDF.");
            
            // html2pdf margin: [top, left, bottom, right] -> top 1cm, left 1cm, bottom 1cm, right 0.5cm
            const opt = {
                margin: [10, 10, 10, 10], 
                filename: `CV_${data.hoSo.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}.pdf`,
                image: { type: 'jpeg', quality: 0.8 }, // Giảm quality để nén ảnh
                html2canvas: { scale: 1.5, useCORS: true }, // scale 1.5 đủ sắc nét mà không quá nặng
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }, // compress: true để nén luồng PDF
                pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', 'thead', '.print-break-avoid', 'h2', 'h3', '.section-title'] }
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
                
            if (uploadError) {
                console.warn('Lỗi khi upload lên Supabase:', uploadError);
            }

            // Tự động kích hoạt tải file về máy từ blob
            const blobUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName; // Bắt buộc tên file tải về
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            
        } catch (error) {
            console.error('Lỗi khi xuất PDF:', error);
            alert('Có lỗi xảy ra: ' + (error.message || JSON.stringify(error)));
        } finally {
            unpatch();
            setIsExporting(false);
        }
    };

    const handleExportPDFForm = async () => {
        if (!window.confirm("Bạn có chắc muốn xuất lý lịch không")) return;
        if (isExportingForm) return;
        setIsExportingForm(true);
        const unpatch = patchHtml2Canvas();
        let replacements = [];
        let hiddenElements = [];
        
        try {
            const element = pdfFormRef.current;
            if (!element) throw new Error("Không tìm thấy nội dung PDF Form.");
            
            // 1. Chuyển input, textarea, select thành thẻ div
            const inputs = element.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                const span = document.createElement('div');
                let text = input.value;
                if (input.tagName === 'SELECT') {
                    text = input.options[input.selectedIndex]?.text || '';
                    if (text.includes('Chọn')) text = '';
                } else if (input.type === 'date' && text) {
                    const parts = text.split('-');
                    if (parts.length === 3) {
                        text = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                }
                span.textContent = text || '';
                span.className = input.className;
                span.style.height = 'auto';
                span.style.minHeight = '30px';
                span.style.wordBreak = 'break-word';
                span.style.whiteSpace = 'pre-wrap';
                span.style.border = 'none';
                span.style.borderBottom = '0.6px dashed #000';
                span.style.background = 'transparent';
                span.style.padding = '6px 0 0';
                span.style.lineHeight = '1.15';
                span.style.display = 'block';
                span.style.color = '#000';
                
                input.parentNode.insertBefore(span, input);
                input.style.display = 'none';
                replacements.push({ input, span });
            });

            // 2. Ẩn tất cả các nút (button)
            const buttons = element.querySelectorAll('button');
            buttons.forEach(btn => {
                hiddenElements.push({ el: btn, display: btn.style.display });
                btn.style.display = 'none';
            });

            // 3. Ẩn cột "Thao tác" và ép bảng vừa màn hình
            const tables = element.querySelectorAll('table');
            tables.forEach(table => {
                const isSalaryTable = table.classList.contains('salary-table');
                table.style.setProperty('width', '100%', 'important');
                table.style.setProperty('max-width', '100%', 'important');
                table.style.setProperty('table-layout', 'fixed', 'important');
                table.style.setProperty('border-collapse', 'collapse', 'important');
                table.style.setProperty('font-size', isSalaryTable ? '6.2px' : '11px', 'important');
                table.style.setProperty('line-height', isSalaryTable ? '1.25' : '1.35', 'important');
                
                // Bỏ min-width để bảng không bị tràn
                const cells = table.querySelectorAll('th, td');
                cells.forEach(cell => {
                    cell.style.setProperty('min-width', '0', 'important');
                    cell.style.setProperty('white-space', 'normal', 'important');
                    cell.style.setProperty('word-break', 'break-word', 'important');
                    cell.style.setProperty('overflow-wrap', 'anywhere', 'important');
                    cell.style.setProperty('vertical-align', 'middle', 'important');
                    cell.style.setProperty('border', '0.6px solid #000', 'important');
                    cell.style.setProperty('padding', isSalaryTable ? '3px' : '7px 5px', 'important');
                    cell.style.setProperty('line-height', isSalaryTable ? '1.25' : '1.35', 'important');
                    cell.style.setProperty('text-align', cell.tagName === 'TH' || cell.classList.contains('text-center') ? 'center' : 'left', 'important');
                });
                
                // Tìm cột Thao tác
                const ths = table.querySelectorAll('th');
                ths.forEach(th => {
                    if (th.textContent.toLowerCase().includes('thao tác')) {
                        const index = Array.from(th.parentNode.children).indexOf(th);
                        hiddenElements.push({ el: th, display: th.style.display });
                        th.style.display = 'none';
                        
                        const trs = table.querySelectorAll('tr');
                        trs.forEach(tr => {
                            const td = tr.children[index];
                            if (td) {
                                hiddenElements.push({ el: td, display: td.style.display });
                                td.style.display = 'none';
                            }
                        });
                    }
                });
            });

            // 3.5 Gộp cột cho bảng Khen thưởng & Kỷ luật
            const khenKyLuatTables = [
                element.querySelector('#tableKhenThuong'),
                element.querySelector('#tableKyLuat')
            ];
            khenKyLuatTables.forEach(table => {
                if (!table) return;
                const ths = table.querySelectorAll('th');
                if (ths.length >= 5) {
                    const thDate = ths[0];
                    const thEval = ths[1];
                    const thType = ths[3];
                    const thLevel = ths[4];

                    hiddenElements.push({ el: thDate, isTextContent: true, textContent: thDate.textContent });
                    hiddenElements.push({ el: thType, isTextContent: true, textContent: thType.textContent });
                    hiddenElements.push({ el: thEval, display: thEval.style.display });
                    hiddenElements.push({ el: thLevel, display: thLevel.style.display });

                    thDate.textContent = 'Ngày tháng năm / Đánh giá';
                    thType.textContent = 'Loại / Cấp';
                    thEval.style.display = 'none';
                    thLevel.style.display = 'none';

                    const trs = table.querySelectorAll('tbody tr');
                    trs.forEach(tr => {
                        const tds = tr.querySelectorAll('td');
                        if (tds.length >= 5 && !tds[0].hasAttribute('colspan')) {
                            const tdDate = tds[0];
                            const tdEval = tds[1];
                            const tdType = tds[3];
                            const tdLevel = tds[4];

                            hiddenElements.push({ el: tdEval, display: tdEval.style.display });
                            hiddenElements.push({ el: tdLevel, display: tdLevel.style.display });

                            const wrapper1 = document.createElement('div');
                            wrapper1.style.marginTop = '4px';
                            while(tdEval.firstChild) wrapper1.appendChild(tdEval.firstChild);
                            tdDate.appendChild(wrapper1);
                            
                            const wrapper2 = document.createElement('div');
                            wrapper2.style.marginTop = '4px';
                            while(tdLevel.firstChild) wrapper2.appendChild(tdLevel.firstChild);
                            tdType.appendChild(wrapper2);

                            tdEval.style.display = 'none';
                            tdLevel.style.display = 'none';

                            hiddenElements.push({ type: 'restoreNodes', source: wrapper1, destination: tdEval });
                            hiddenElements.push({ type: 'restoreNodes', source: wrapper2, destination: tdLevel });
                        }
                    });
                }
            });

            // 4. Bỏ overflow để html2canvas không bị cắt ngang bảng
            const scrollableDivs = element.querySelectorAll('.overflow-x-auto, .overflow-hidden, .table-container');
            scrollableDivs.forEach(div => {
                const oldCss = div.style.cssText;
                hiddenElements.push({ el: div, isCssText: true, cssText: oldCss });
                div.style.setProperty('overflow', 'visible', 'important');
                div.style.setProperty('overflow-x', 'visible', 'important');
            });

            // Chuẩn hóa trang form theo vùng in A4 sau khi trừ lề PDF.
            const a4Pages = element.querySelectorAll('.a4-page');
            a4Pages.forEach(p => {
                hiddenElements.push({ el: p, isCssText: true, cssText: p.style.cssText });
                p.style.setProperty('width', '196mm', 'important');
                p.style.setProperty('max-width', '196mm', 'important');
                p.style.setProperty('padding', '4mm 5mm', 'important');
                p.style.setProperty('overflow', 'hidden', 'important');
            });

            const opt = {
                margin: [7, 7, 7, 7], 
                filename: `Form_${data.hoSo.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 740 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
                pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', 'thead', '.print-break-avoid', '.section-title', '.field-group'] }
            };

            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            
            const fileName = `Form_${data.hoSo.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}_${Date.now()}.pdf`;
            const filePath = `${id}/pdf/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('file_qncn')
                .upload(filePath, pdfBlob, {
                    contentType: 'application/pdf',
                    cacheControl: '3600',
                    upsert: false
                });
                
            if (uploadError) {
                console.warn('Lỗi khi upload lên Supabase:', uploadError);
            }

            const blobUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            
        } catch (error) {
            console.error('Lỗi khi xuất PDF Form:', error);
            alert('Có lỗi xảy ra: ' + (error.message || JSON.stringify(error)));
        } finally {
            replacements.forEach(({ input, span }) => {
                span.remove();
                input.style.display = '';
            });
            hiddenElements.forEach(item => {
                if (item.type === 'restoreNodes') {
                    while (item.source.firstChild) {
                        item.destination.appendChild(item.source.firstChild);
                    }
                    item.source.remove();
                } else if (item.isCssText) {
                    item.el.style.cssText = item.cssText;
                } else if (item.isTextContent) {
                    item.el.textContent = item.textContent;
                } else {
                    item.el.style.display = item.display;
                }
            });
            unpatch();
            setIsExportingForm(false);
        }
    };

    const handleExportWordForm = () => {
        if (!window.confirm("Bạn có chắc muốn xuất Word Form Lý lịch không?")) return;
        
        const element = pdfFormRef.current;
        if (!element) {
            alert("Không tìm thấy nội dung để xuất.");
            return;
        }
        
        const clone = element.cloneNode(true);
        const grids = clone.querySelectorAll('.grid');
        grids.forEach(grid => {
            const container = document.createElement('div');
            
            let currentTable = document.createElement('table');
            currentTable.style.width = '100%';
            currentTable.style.borderCollapse = 'collapse';
            currentTable.style.border = 'none';
            currentTable.style.marginBottom = '5px';
            let tr = document.createElement('tr');
            let currentCols = 0;
            
            Array.from(grid.children).forEach(child => {
                let span = 12;
                const match = child.className.match(/col-span-(\d+)/);
                if (match) span = parseInt(match[1]);
                
                if (currentCols > 0 && currentCols + span > 12) {
                    currentTable.appendChild(tr);
                    container.appendChild(currentTable);
                    
                    currentTable = document.createElement('table');
                    currentTable.style.width = '100%';
                    currentTable.style.borderCollapse = 'collapse';
                    currentTable.style.border = 'none';
                    currentTable.style.marginBottom = '5px';
                    tr = document.createElement('tr');
                    currentCols = 0;
                }
                
                const td = document.createElement('td');
                td.style.width = `${(span / 12) * 100}%`;
                td.style.verticalAlign = 'bottom';
                td.style.padding = '2px 6px 2px 0'; // Slightly smaller padding
                td.style.border = 'none';
                
                if (child.classList.contains('field-group')) {
                    const label = child.querySelector('.field-label');
                    const value = child.querySelector('.field-value');
                    
                    if (label && value) {
                        const labelHtml = label.innerHTML;
                        const valueHtml = value.innerHTML;
                        const align = value.classList.contains('text-center') ? 'center' : 'left';
                        
                        let valueStyles = `border-bottom: 1px dotted black; text-align: ${align}; vertical-align: bottom;`;
                        if (value.classList.contains('bold')) valueStyles += ' font-weight: bold;';
                        if (value.classList.contains('uppercase')) valueStyles += ' text-transform: uppercase;';
                        if (value.classList.contains('italic')) valueStyles += ' font-style: italic;';
                        if (value.classList.contains('text-xs')) valueStyles += ' font-size: 10pt;';
                        
                        let labelStyles = `width: 1%; white-space: nowrap; font-weight: bold; padding-right: 4px; vertical-align: bottom;`;
                        if (label.classList.contains('italic')) labelStyles += ' font-style: italic;';
                        if (label.classList.contains('underline')) labelStyles += ' text-decoration: underline;';

                        td.innerHTML = `
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0; padding: 0; border: none;">
                                <tr>
                                    <td style="${labelStyles}">${labelHtml}</td>
                                    <td style="${valueStyles}">${valueHtml}</td>
                                </tr>
                            </table>
                        `;
                    } else if (label && !value) {
                        let labelStyles = `font-weight: bold;`;
                        if (label.classList.contains('italic')) labelStyles += ' font-style: italic;';
                        if (label.classList.contains('underline')) labelStyles += ' text-decoration: underline;';
                        td.innerHTML = `<span style="${labelStyles}">${label.innerHTML}</span>`;
                    } else {
                        td.innerHTML = child.innerHTML;
                    }
                } else {
                    td.innerHTML = child.innerHTML;
                }
                
                tr.appendChild(td);
                currentCols += span;
            });
            
            if (currentCols > 0) {
                currentTable.appendChild(tr);
                container.appendChild(currentTable);
            }
            
            grid.parentNode.replaceChild(container, grid);
        });

        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Export HTML To Doc</title>
                <style>
                    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
                    th, td { border: 1px solid black; padding: 5px; text-align: left; vertical-align: top; }
                    th { font-weight: bold; background-color: #f7f7f7; text-align: center; border-style: solid; }
                    .section-title { font-size: 14pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid black; margin-top: 15px; margin-bottom: 10px; padding-bottom: 2px; }
                    .field-group { margin-bottom: 5px; }
                    .field-label { font-weight: bold; margin-right: 5px; }
                    .field-value { display: inline-block; border-bottom: 1px dotted black; min-width: 50px; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                    .uppercase { text-transform: uppercase; }
                    .italic { font-style: italic; }
                    .underline { text-decoration: underline; }
                </style>
            </head>
            <body>
                ${clone.innerHTML}
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        
        const fileName = `Form_${data?.hoSo?.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}.doc`;
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleExportLuongTable = async () => {
        if (!window.confirm("Bạn có chắc muốn xuất Bảng quá trình công tác và hưởng lương không?")) return;
        if (isExportingLuong) return;
        setIsExportingLuong(true);
        const unpatch = patchHtml2Canvas();
        try {
            const element = pdfLuongRef.current;
            if (!element) throw new Error("Không tìm thấy dữ liệu.");
            
            const parent = element.parentElement;
            parent.classList.remove('hidden');

            const opt = {
                margin: [10, 10, 10, 10], 
                filename: `BangLuong_${data?.hoSo?.ho_ten_khai_sinh?.replace(/[^a-zA-Z0-9]/g, '_') || 'CanBo'}_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    windowWidth: SALARY_EXPORT_WIDTH_PX,
                    width: SALARY_EXPORT_WIDTH_PX,
                    scrollX: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true },
            };

            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            
            const fileName = opt.filename;
            const blobUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            
            parent.classList.add('hidden');
        } catch (error) {
            console.error('Lỗi khi xuất PDF Bảng lương:', error);
            alert('Có lỗi xảy ra: ' + (error.message || JSON.stringify(error)));
        } finally {
            unpatch();
            setIsExportingLuong(false);
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

                .pdf-form-mode button, 
                .pdf-form-mode a, 
                .pdf-form-mode .fa-trash, 
                .pdf-form-mode .fa-plus {
                    display: none !important;
                }
                .pdf-form-mode input, 
                .pdf-form-mode select, 
                .pdf-form-mode textarea {
                    border: none !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    -webkit-appearance: none !important;
                    -moz-appearance: none !important;
                    appearance: none !important;
                    pointer-events: none !important;
                    color: black !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    border-bottom: 1px dashed #9ca3af !important;
                    border-radius: 0 !important;
                }
                .pdf-form-mode {
                    color: black !important;
                }
                .pdf-form-mode label {
                    color: black !important;
                    font-weight: 600;
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
                
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6 no-print">
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm font-medium transition-colors flex items-center justify-center sm:justify-start">
                        <i className="fas fa-arrow-left mr-2 text-gray-500"></i> Quay lại
                    </button>
                    <div className="flex gap-2 sm:gap-3">
                        <button onClick={() => navigate(`/personnel/edit/${id}`)} className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 bg-yellow-500 rounded-lg text-white hover:bg-yellow-600 shadow-md font-medium transition-colors flex items-center text-sm sm:text-base">
                            <i className="fas fa-edit mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Sửa hồ sơ</span><span className="sm:hidden">Sửa hồ sơ</span>
                        </button>
                        {currentUser?.role === 'admin' && (
                            <button onClick={handleExportWordForm} className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 shadow-md font-medium transition-colors flex items-center text-sm sm:text-base">
                                <i className="fas fa-file-word mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Xuất Word Form</span><span className="sm:hidden">Xuất Word</span>
                            </button>
                        )}
                        {currentUser && currentUser.role === 'admin' && (
                            <button onClick={handleExportLuongTable} disabled={isExportingLuong} className={`flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 rounded-lg text-white shadow-md font-medium transition-colors flex items-center text-sm sm:text-base ${isExportingLuong ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}>
                                {isExportingLuong ? <><i className="fas fa-spinner fa-spin mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Đang xuất Bảng lương...</span><span className="sm:hidden">Đang xuất</span></> : <><i className="fas fa-file-invoice-dollar mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Xuất Bảng Lương</span><span className="sm:hidden">Xuất Lương</span></>}
                            </button>
                        )}
                        <button onClick={handleExportPDFForm} disabled={isExportingForm} className={`flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 rounded-lg text-white shadow-md font-medium transition-colors flex items-center text-sm sm:text-base ${isExportingForm ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            {isExportingForm ? <><i className="fas fa-spinner fa-spin mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Đang xuất PDF Form...</span><span className="sm:hidden">Đang xuất</span></> : <><i className="fas fa-file-invoice mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Xuất PDF Form</span><span className="sm:hidden">Xuất Form</span></>}
                        </button>
                        <button onClick={handleExportPDF} disabled={isExporting} className={`flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 rounded-lg text-white shadow-md font-medium transition-colors flex items-center text-sm sm:text-base ${isExporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'}`}>
                            {isExporting ? <><i className="fas fa-spinner fa-spin mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Đang xuất PDF...</span><span className="sm:hidden">Đang xuất</span></> : <><i className="fas fa-file-pdf mr-1.5 sm:mr-2"></i> <span className="hidden sm:inline">Xuất PDF</span><span className="sm:hidden">Xuất PDF</span></>}
                        </button>
                    </div>
                </div>

                <div ref={pdfRef} id="pdf-content" className="bg-white rounded-2xl shadow-lg print-border overflow-hidden">
                    
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-6 sm:py-8 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                            <i className="fas fa-shield-alt" style={{ fontSize: '12rem' }}></i>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-widest relative z-10 text-white drop-shadow-md">
                            THÔNG TIN QUÂN NHÂN
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        <div className="lg:col-span-4 space-y-8">
                            
                            <div className="print-break-avoid">
                                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i className="fas fa-info-circle w-4 h-4 flex items-center justify-center"></i></span> Thông tin cá nhân
                                </h2>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Họ và tên khai sinh</span>
                                        <span className="text-gray-900 font-bold text-base uppercase">{hoSo.ho_ten_khai_sinh || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Chức vụ / Đơn vị</span>
                                        <span className="text-gray-900 font-medium text-right ml-4">{hoSo.nganh_nghe_cao_nhat || '-'} - {hoSo.don_vi || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Tên thường dùng</span>
                                        <span className="text-gray-900 font-medium">{hoSo.ho_ten_thuong_dung || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Ngày sinh</span>
                                        <span className="text-gray-900 font-medium">{formatDate(hoSo.ngay_sinh)}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Giới tính</span>
                                        <span className="text-gray-900 font-medium">{hoSo.gioi_tinh || '-'}</span>
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
                                        <span className="font-medium text-gray-500">Khối quân</span>
                                        <span className="text-gray-900 font-medium">{hoSo.khoi_quan || '-'}</span>
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
                                        <p className="font-medium text-gray-500 mb-1"><i className="fas fa-id-card mr-1 opacity-50"></i> Nơi thường trú</p>
                                        <p className="text-gray-900 font-medium">{hoSo.noi_thuong_tru_chi_tiet ? `${hoSo.noi_thuong_tru_chi_tiet}, ` : ''}{hoSo.noi_thuong_tru || '-'}</p>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="font-medium text-gray-500 mb-1"><i className="fas fa-building mr-1 opacity-50"></i> Nơi tạm trú</p>
                                        <p className="text-gray-900 font-medium">{hoSo.noi_tam_tru_chi_tiet ? `${hoSo.noi_tam_tru_chi_tiet}, ` : ''}{hoSo.noi_tam_tru || '-'}</p>
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
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm mb-4">
                                    <p className="font-semibold text-gray-800 mb-1">Căn cước công dân</p>
                                    <p className="text-xl font-bold text-blue-800 tracking-wider mb-2">{hoSo.so_cccd || '...'}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
                                        <div>Cấp: <span className="text-gray-900 font-medium">{formatDate(hoSo.ngay_cap_cccd)}</span></div>
                                        <div>Hết hạn: <span className="text-gray-900 font-medium">{formatDate(hoSo.han_su_dung_cccd)}</span></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Nơi cấp: {hoSo.noi_cap_cccd || '-'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm">
                                    <p className="font-semibold text-gray-800 mb-1">CMQNCN / CMSQ</p>
                                    <p className="text-xl font-bold text-green-700 tracking-wider mb-2">{hoSo.so_cmqncn_cmsq || '...'}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
                                        <div>Cấp: <span className="text-gray-900 font-medium">{formatDate(hoSo.ngay_cap_cmqncn_cmsq)}</span></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Nơi cấp: {hoSo.noi_cap_cmqncn_cmsq || '-'}</p>
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
                                        <span className="font-medium text-gray-500">Sống mũi</span>
                                        <span className="text-gray-900 font-medium">{hoSo.song_mui || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Nếp tai dưới</span>
                                        <span className="text-gray-900 font-medium">{hoSo.nep_tai_duoi || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="font-medium text-gray-500">Dái tai</span>
                                        <span className="text-gray-900 font-medium">{hoSo.dai_tai || '-'}</span>
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
                                    <div className="relative">
                                        <div className="absolute -left-8 bg-blue-600 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                        <h3 className="font-bold text-gray-800 mb-1">Cột mốc Quân đội</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-1">
                                            <div>Tháng năm VQĐ: <span className="text-gray-900 font-medium">{hoSo.thang_nam_vao_quan_doi || '-'}</span></div>
                                            <div>Tuyển dụng: <span className="text-gray-900 font-medium">{hoSo.tn_tuyen_dung || '-'}</span></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-1">
                                            <div>Nhập ngũ: <span className="text-gray-900 font-medium">{hoSo.tn_nhap_ngu || '-'}</span></div>
                                            <div>Xuất ngũ: <span className="text-gray-900 font-medium">{hoSo.tn_xuat_ngu || '-'}</span></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-1">
                                            <div>Tái ngũ: <span className="text-gray-900 font-medium">{hoSo.tn_tai_ngu || '-'}</span></div>
                                            <div>HSQ-BS sang QNCN: <span className="text-gray-900 font-medium">{hoSo.tn_hsq_bs_sang_qncn || '-'}</span></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-1">
                                            <div>HSQ-BS sang CNVQP: <span className="text-gray-900 font-medium">{hoSo.tn_hsq_bs_sang_cnvqp || '-'}</span></div>
                                            <div>CNVQP sang QNCN: <span className="text-gray-900 font-medium">{hoSo.tn_cnvqp_sang_qncn || '-'}</span></div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-8 bg-blue-400 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                        <h3 className="font-bold text-gray-800 mb-1">Kết nạp Đoàn TNCS HCM</h3>
                                        <p className="text-sm text-gray-500">Ngày <span className="text-gray-900 font-medium">{formatDate(hoSo.ngay_vao_doan)}</span></p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-8 bg-red-500 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                        <h3 className="font-bold text-gray-800 mb-1">Kết nạp Đảng CSVN</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                            <div>Dự bị: <span className="text-gray-900 font-medium">{formatDate(hoSo.ngay_vao_dang)}</span></div>
                                            <div>Chính thức: <span className="text-gray-900 font-medium">{formatDate(hoSo.ngay_chinh_thuc_dang)}</span></div>
                                        </div>
                                    </div>
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
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <p><i className="fas fa-calendar-check mr-2 opacity-50"></i>Năm tốt nghiệp: {hoSo.nam_tot_nghiep || '-'}</p>
                                        <p><i className="fas fa-book mr-2 opacity-50"></i>Trình độ văn hóa: {hoSo.trinh_do_van_hoa || '-'}</p>
                                    </div>
                                </div>
                                
                                {hoSo.trinh_do_lien_quan_cnqs && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                            <h3 className="font-bold text-gray-800 text-lg">{hoSo.trinh_do_lien_quan_cnqs} - {hoSo.nganh_nghe_lien_quan_cnqs || ''}</h3>
                                            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full w-max">Liên quan CNQS</span>
                                        </div>
                                    </div>
                                )}

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
                                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100 flex flex-col justify-start">
                                        <div className="text-[10px] sm:text-xs uppercase font-bold text-gray-600 mb-1">Năm HTXSNV</div>
                                        <div className="text-xs sm:text-sm text-blue-700 break-words">{hoSo.xep_loai_xuat_sac ? String(hoSo.xep_loai_xuat_sac).replace(/,\s*/g, ', ') : 0}</div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100 flex flex-col justify-start">
                                        <div className="text-[10px] sm:text-xs uppercase font-bold text-gray-600 mb-1">Năm HTTNV</div>
                                        <div className="text-xs sm:text-sm text-green-600 break-words">{hoSo.xep_loai_tot ? String(hoSo.xep_loai_tot).replace(/,\s*/g, ', ') : 0}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200 flex flex-col justify-start">
                                        <div className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 mb-1">Năm HTNV</div>
                                        <div className="text-xs sm:text-sm text-gray-600 break-words">{hoSo.xep_loai_hoan_thanh ? String(hoSo.xep_loai_hoan_thanh).replace(/,\s*/g, ', ') : 0}</div>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100 flex flex-col justify-start">
                                        <div className="text-[10px] sm:text-xs uppercase font-bold text-gray-600 mb-1">Năm KHTNV</div>
                                        <div className="text-xs sm:text-sm text-red-500 break-words">{hoSo.xep_loai_khong_hoan_thanh ? String(hoSo.xep_loai_khong_hoan_thanh).replace(/,\s*/g, ', ') : 0}</div>
                                    </div>
                                </div>

                                {khenThuong.length > 0 ? (
                                    <div className="relative pl-6 border-l-2 border-green-200 space-y-4">
                                        {khenThuong.map((kt) => {
                                            const formattedDate = formatDate(kt.ngay);
                                            const subTitle = [formattedDate !== '-' ? formattedDate : '', kt.danh_gia_xep_loai].filter(Boolean).join(' • ');
                                            
                                            return (
                                                <div key={kt.id} className="relative">
                                                    <div className="absolute -left-[29px] bg-white text-green-500 h-6 w-6 rounded-full border-2 border-green-200 flex items-center justify-center"><i className="fas fa-trophy text-xs"></i></div>
                                                    <h3 className="font-bold text-gray-800">{[kt.loai, kt.cap].filter(Boolean).join(' - ') || 'Khen thưởng'}</h3>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">{subTitle}</p>
                                                    <p className="text-sm text-gray-700">{kt.ly_do || ''}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic"><i className="fas fa-info-circle text-gray-400 mr-1"></i> Chưa có bản ghi khen thưởng.</p>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                    {kyLuat.length > 0 ? (
                                        <div className="relative pl-6 border-l-2 border-red-200 space-y-4">
                                            {kyLuat.map((kl) => {
                                                const formattedDate = formatDate(kl.ngay);
                                                const subTitle = [formattedDate !== '-' ? formattedDate : '', kl.danh_gia_xep_loai].filter(Boolean).join(' • ');
                                                
                                                return (
                                                    <div key={kl.id} className="relative">
                                                        <div className="absolute -left-[29px] bg-white text-red-500 h-6 w-6 rounded-full border-2 border-red-200 flex items-center justify-center"><i className="fas fa-exclamation-triangle text-xs"></i></div>
                                                        <h3 className="font-bold text-gray-800">{[kl.loai, kl.cap].filter(Boolean).join(' - ') || 'Kỷ luật'}</h3>
                                                        <p className="text-xs text-gray-500 font-medium mb-1">{subTitle}</p>
                                                        <p className="text-sm text-gray-700">{kl.ly_do || ''}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic"><i className="fas fa-check-circle text-green-500 mr-1"></i> Không có bản ghi kỷ luật.</p>
                                    )}
                                </div>
                            </div>

                            <div className="print-break-avoid" style={{ pageBreakBefore: 'always' }}>
                                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                                    <i className="fas fa-users text-blue-600 mr-2"></i> Quan hệ gia đình
                                </h2>
                                
                                {giaDinh.length > 0 ? (
                                    <div className="overflow-x-auto custom-scrollbar border rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-600">
                                                <tr>
                                                    <th className="px-4 py-2 font-medium">Mối quan hệ</th>
                                                    <th className="px-4 py-2 font-medium">Họ và tên</th>
                                                    <th className="px-4 py-2 font-medium">Năm sinh</th>
                                                    <th className="px-4 py-2 font-medium">Nghề nghiệp</th>
                                                    <th className="px-4 py-2 font-medium">Trạng thái</th>
                                                    <th className="px-4 py-2 font-medium">Nơi ở</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {giaDinh.map((gd) => {
                                                    const isDead = gd.trang_thai === 'Đã mất' || gd.trang_thai === 'Đã chết';
                                                    return (
                                                        <tr key={gd.id} className={`border-t border-gray-100 ${isDead ? 'opacity-75 bg-gray-50' : 'bg-white'}`}>
                                                            <td className="px-4 py-3 font-bold">{gd.moi_quan_he || '-'}</td>
                                                            <td className={`px-4 py-3 ${isDead ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                                {gd.ho_ten || '-'} 
                                                                {gd.so_dien_thoai ? <span className="block text-xs text-gray-500 mt-1"><i className="fas fa-phone mr-1 opacity-50"></i>{gd.so_dien_thoai}</span> : ''}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">{gd.nam_sinh || '-'}</td>
                                                            <td className="px-4 py-3 text-gray-600">{gd.nghe_nghiep || '-'}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={isDead ? 'text-red-500 font-medium text-xs bg-red-50 px-2 py-1 rounded' : 'text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded'}>
                                                                    {isDead ? `Đã mất ${gd.nam_chet ? `(${gd.nam_chet})` : ''}` : 'Còn sống'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                                {[gd.noi_o_chi_tiet, gd.noi_o_hien_tai].filter(Boolean).join(', ') || '-'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
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
                                                        <td className={`px-4 py-3 ${isLatest ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'}`}>
                                                            <div className="flex items-center">
                                                                {isLatest && <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0 animate-pulse"></span>}
                                                                <span>{l.tu_thang || ''} - {l.den_thang || 'Nay'}</span>
                                                            </div>
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
                            <p className="font-bold uppercase">{hoSo.ho_ten_khai_sinh}</p>
                        </div>
                        <div>
                            <p className="italic text-xs text-gray-500 mb-1">Ngày ..... tháng ..... năm 20.....</p>
                            <p className="font-bold text-sm uppercase">Thủ trưởng đơn vị</p>
                            <p className="italic text-xs text-gray-500 mb-20">(Ký, đóng dấu, ghi rõ họ tên)</p>
                        </div>
                    </div>
                </div>

            </div>

            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <div ref={pdfFormRef} id="pdf-form-content" className="bg-white pdf-form-mode" style={{ width: '196mm', minHeight: '283mm', color: '#000' }}>
                    <PrintForm data={data} />
                </div>
                
                {/* Bảng lương để in */}
                <div ref={pdfLuongRef} className="p-4 bg-white text-black" style={{ width: `${SALARY_EXPORT_WIDTH_PX}px`, color: 'black', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <h1 className="text-center text-xl font-bold uppercase mb-4">BẢNG QUÁ TRÌNH CÔNG TÁC VÀ HƯỞNG LƯƠNG</h1>
                    <div className="flex justify-between mb-4 text-sm">
                        <p><span className="font-bold">Họ và tên:</span> {hoSo?.ho_ten_khai_sinh}</p>
                        <p><span className="font-bold">Đơn vị:</span> {hoSo?.don_vi}</p>
                    </div>
                    <table className="w-full text-left border-collapse" style={{ border: '1px solid black', tableLayout: 'fixed', wordWrap: 'break-word', fontSize: '9px', lineHeight: '1.2' }}>
                        <thead className="bg-gray-100 text-center" style={{ backgroundColor: '#f3f4f6' }}>
                            <tr>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '6%' }}>Từ tháng</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '6%' }}>Đến tháng</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '7%' }}>Đơn vị CTT</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '7%' }}>Đơn vị CT</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '6%' }}>L.thay đổi</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '5%' }}>Diện QL</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '5%' }}>Diện BT</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '5%' }}>Cấp bậc</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '7%' }}>Chức vụ, CNQS</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '6%' }}>TN CNQS</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '5%' }}>L.Ngạch</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>Nhóm</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>Bậc</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>Hệ số</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>PC VK</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>HS BL</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>PC CV</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '3.5%' }}>PC TN</th>
                                <th className="px-1 py-1 font-bold border" style={{ border: '1px solid black', width: '5.5%' }}>TN B.Đầu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {luong && luong.map((l, index) => (
                                <tr key={l.id}>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.tu_thang || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.den_thang || '-'}</td>
                                    <td className="px-1 py-1 border" style={{ border: '1px solid black' }}>{l.don_vi_cap_truc_thuoc || '-'}</td>
                                    <td className="px-1 py-1 border" style={{ border: '1px solid black' }}>{l.don_vi_chi_tiet || '-'}</td>
                                    <td className="px-1 py-1 border" style={{ border: '1px solid black' }}>{l.loai_thay_doi || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.dien_quan_ly || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.dien_bo_tri || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.cap_bac || '-'}</td>
                                    <td className="px-1 py-1 border" style={{ border: '1px solid black' }}>{l.chuc_vu_cnqs || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.tn_dam_nhan_cnqs || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.loai_ngach || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.nhom || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.bac || '-'}</td>
                                    <td className="px-1 py-1 text-center font-bold border" style={{ border: '1px solid black' }}>{l.he_so ? Number(l.he_so).toFixed(2) : '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.pc_vk || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.he_so_bl || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.pc_chuc_vu || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.pc_tn_nghe || '-'}</td>
                                    <td className="px-1 py-1 text-center border" style={{ border: '1px solid black' }}>{l.tn_bat_dau_dam_nhan || '-'}</td>
                                </tr>
                            ))}
                            {(!luong || luong.length === 0) && (
                                <tr>
                                    <td colSpan="19" className="px-1 py-4 text-center italic border" style={{ border: '1px solid black' }}>Chưa có quá trình công tác.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
