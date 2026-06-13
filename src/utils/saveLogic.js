import { supabase } from '../services/supabase';

function normalizeMonthYear(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    const yyyyMm = raw.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
    if (yyyyMm) return `${yyyyMm[2]}/${yyyyMm[1]}`;

    const mmYyyy = raw.match(/^(0?[1-9]|1[0-2])\/(\d{4})$/);
    if (mmYyyy) return `${mmYyyy[1].padStart(2, '0')}/${mmYyyy[2]}`;

    const compact = raw.replace(/\D/g, '');
    if (compact.length === 6) {
        const month = compact.slice(0, 2);
        const year = compact.slice(2);
        if (Number(month) >= 1 && Number(month) <= 12) return `${month}/${year}`;
    }
    return raw;
}

function getControls(sectionSelector) {
    return Array.from(document.querySelectorAll(`${sectionSelector} input, ${sectionSelector} select, ${sectionSelector} textarea`));
}

function getValueFromControls(controls, index) {
    const control = controls[index];
    if (!control) return null;
    if (control.type === 'file') return control.files?.[0] || null;
    if (control.dataset?.monthYear !== undefined) {
        control.value = normalizeMonthYear(control.value);
    }
    const value = String(control.value ?? '').trim();
    return value || null;
}

function numberOrNull(value) {
    if (value === null || value === undefined || value === '') return null;
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
}

function rowHasData(values) {
    return Object.values(values).some(value => value !== null && value !== undefined && value !== '');
}

function getRowInputValue(row, index) {
    const input = row.querySelectorAll('input, select, textarea')[index];
    if (!input) return null;
    if (input.dataset?.monthYear !== undefined) {
        input.value = normalizeMonthYear(input.value);
    }
    const value = String(input.value ?? '').trim();
    return value || null;
}

function collectHoSoPayload(hoSoId) {
    const tab1 = getControls('#tab1');
    const tab2 = getControls('#tab2');
    const tab4 = getControls('#tab4');
    const tab5 = getControls('#tab5');
    const tab6 = getControls('#tab6 > .grid');

    return {
        id: hoSoId,
        ho_ten_khai_sinh: getValueFromControls(tab1, 0),
        ngay_sinh: getValueFromControls(tab1, 1),
        don_vi: getValueFromControls(tab1, 2),
        thang_nam_vao_quan_doi: getValueFromControls(tab1, 3),
        so_cmqncn_cmsq: getValueFromControls(tab1, 4),
        ngay_cap_cmqncn_cmsq: getValueFromControls(tab1, 5),
        noi_cap_cmqncn_cmsq: getValueFromControls(tab1, 6),
        que_quan: getValueFromControls(tab1, 7),
        nhom_mau: getValueFromControls(tab1, 8),
        so_cccd: getValueFromControls(tab1, 9),
        ngay_cap_cccd: getValueFromControls(tab1, 10),
        noi_cap_cccd: getValueFromControls(tab1, 11),
        han_su_dung_cccd: getValueFromControls(tab1, 12),
        trinh_do_ngoai_ngu: getValueFromControls(tab1, 13),
        khoi_quan: getValueFromControls(tab1, 14),
        ho_ten_thuong_dung: getValueFromControls(tab1, 15),
        tinh_trang_hon_nhan: getValueFromControls(tab1, 16),
        noi_thuong_tru: getValueFromControls(tab1, 17),
        noi_thuong_tru_chi_tiet: getValueFromControls(tab1, 18),
        noi_tam_tru: getValueFromControls(tab1, 19),
        noi_tam_tru_chi_tiet: getValueFromControls(tab1, 20),
        noi_o_hien_tai: getValueFromControls(tab1, 21),
        noi_o_hien_tai_chi_tiet: getValueFromControls(tab1, 22),
        tn_tuyen_dung: getValueFromControls(tab1, 23),
        tn_nhap_ngu: getValueFromControls(tab1, 24),
        tn_xuat_ngu: getValueFromControls(tab1, 25),
        tn_tai_ngu: getValueFromControls(tab1, 26),
        ngay_vao_doan: getValueFromControls(tab1, 27),
        ngay_vao_dang: getValueFromControls(tab1, 28),
        ngay_chinh_thuc_dang: getValueFromControls(tab1, 29),

        trinh_do_van_hoa: getValueFromControls(tab2, 0),
        trinh_do_dao_tao_cao_nhat: getValueFromControls(tab2, 1),
        nganh_nghe_cao_nhat: getValueFromControls(tab2, 2),
        nam_tot_nghiep: numberOrNull(getValueFromControls(tab2, 3)),
        trinh_do_lien_quan_cnqs: getValueFromControls(tab2, 4),
        nganh_nghe_lien_quan_cnqs: getValueFromControls(tab2, 5),

        xep_loai_xuat_sac: getValueFromControls(tab4, 0),
        xep_loai_tot: getValueFromControls(tab4, 1),
        xep_loai_hoan_thanh: getValueFromControls(tab4, 2),
        xep_loai_khong_hoan_thanh: getValueFromControls(tab4, 3),

        chieu_cao_m: numberOrNull(getValueFromControls(tab5, 0)),
        song_mui: getValueFromControls(tab5, 1),
        nep_tai_duoi: getValueFromControls(tab5, 2),
        dai_tai: getValueFromControls(tab5, 3),
        dau_vet_rieng: getValueFromControls(tab5, 4),
        han_dung: getValueFromControls(tab5, 5),
        thong_tin_suc_khoe: getValueFromControls(tab5, 6),

        bat_dau_dong_bhxh: getValueFromControls(tab6, 0),
        so_so_bhxh: getValueFromControls(tab6, 1),
        theo_che_do: getValueFromControls(tab6, 2)
    };
}

function collectDaoTaoLaiRows(hoSoId) {
    return Array.from(document.querySelectorAll('#tableDaoTaoLai tbody tr'))
        .map((row, index) => ({
            ho_so_id: hoSoId,
            loai: getRowInputValue(row, 0),
            bat_dau: getRowInputValue(row, 1),
            ket_thuc: getRowInputValue(row, 2),
            bac_dao_tao: getRowInputValue(row, 3),
            ten_truong: getRowInputValue(row, 4),
            thu_tu: index + 1
        }))
        .filter(rowHasData);
}

function collectGiaDinhRows(hoSoId) {
    return Array.from(document.querySelectorAll('#tbodyGiaDinh tr'))
        .map((row, index) => {
            const relInput = row.children[0]?.querySelector('input, select');
            const relation = relInput ? relInput.value.trim() : row.children[0]?.textContent.trim() || null;
            const nameInputs = row.children[1]?.querySelectorAll('input') || [];
            const statusSelect = row.children[4]?.querySelector('select');
            const namChetInput = row.children[4]?.querySelector('input');
            const data = {
                ho_so_id: hoSoId,
                moi_quan_he: relation,
                ho_ten: nameInputs[0]?.value?.trim() || null,
                so_dien_thoai: nameInputs[1]?.value?.trim() || null,
                nam_sinh: numberOrNull(row.children[2]?.querySelector('input')?.value),
                nghe_nghiep: row.children[3]?.querySelector('input')?.value?.trim() || null,
                trang_thai: statusSelect?.value || null,
                nam_chet: numberOrNull(namChetInput?.value),
                noi_o_hien_tai: row.children[5]?.querySelector('input')?.value?.trim() || null,
                noi_o_chi_tiet: row.children[6]?.querySelector('input')?.value?.trim() || null,
                thu_tu: index + 1
            };
            return data;
        })
        .filter(row => row.moi_quan_he && row.ho_ten);
}

function sanitizeFileName(fileName) {
    return String(fileName || 'file')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'file';
}

async function uploadQncnFile(file, hoSoId, folderName, index) {
    if (!file) return null;

    const safeName = sanitizeFileName(file.name);
    const objectPath = `${hoSoId}/${folderName}/${String(index + 1).padStart(2, '0')}-${Date.now()}-${safeName}`;
    const { error } = await supabase
        .storage
        .from('file_qncn')
        .upload(objectPath, file, {
            cacheControl: '3600',
            contentType: file.type || 'application/octet-stream',
            upsert: false
        });

    if (error) throw error;
    return objectPath;
}

async function collectKhenKyRows(tableId, hoSoId) {
    const folderName = tableId === 'tableKhenThuong' ? 'khen_thuong' : 'ky_luat';
    const rows = Array.from(document.querySelectorAll(`#${tableId} tbody tr`));
    const results = [];

    for (const [index, row] of rows.entries()) {
        const file = row.querySelector('input[type="file"]')?.files?.[0] || null;
        const oldFilePath = row.querySelector('.old-file-path')?.value || null;
        const oldFileName = row.querySelector('.old-file-name')?.value || null;
        const ngay = getRowInputValue(row, 0);
        if (!ngay) continue;

        let filePath = oldFilePath;
        let fileName = oldFileName;
        let fileType = null;
        let fileSize = null;

        if (file) {
            filePath = await uploadQncnFile(file, hoSoId, folderName, index);
            fileName = file.name;
            fileType = file.type;
            fileSize = file.size;
        }

        results.push({
            ho_so_id: hoSoId,
            ngay,
            danh_gia_xep_loai: getRowInputValue(row, 1),
            ly_do: getRowInputValue(row, 2),
            loai: getRowInputValue(row, 3),
            cap: getRowInputValue(row, 4),
            file_dinh_kem: filePath,
            file_ten_goc: fileName,
            file_mime_type: fileType,
            file_size: fileSize,
            thu_tu: index + 1
        });
    }

    return results;
}

function collectLuongRows(hoSoId) {
    return Array.from(document.querySelectorAll('#tbodyLuong .luong-row'))
        .map((row, index) => {
            const data = {
                ho_so_id: hoSoId,
                tu_thang: getRowInputValue(row, 0),
                den_thang: getRowInputValue(row, 1),
                don_vi_cap_truc_thuoc: getRowInputValue(row, 2),
                don_vi_chi_tiet: getRowInputValue(row, 3),
                loai_thay_doi: getRowInputValue(row, 4),
                dien_quan_ly: getRowInputValue(row, 5),
                dien_bo_tri: getRowInputValue(row, 6),
                cap_bac: getRowInputValue(row, 7),
                chuc_vu_cnqs: getRowInputValue(row, 8),
                tn_dam_nhan_cnqs: getRowInputValue(row, 9),
                loai_ngach: getRowInputValue(row, 10),
                nhom: getRowInputValue(row, 11),
                bac: getRowInputValue(row, 12),
                he_so: numberOrNull(getRowInputValue(row, 13)),
                pc_vk: numberOrNull(getRowInputValue(row, 14)),
                he_so_bl: numberOrNull(getRowInputValue(row, 15)),
                pc_chuc_vu: numberOrNull(getRowInputValue(row, 16)),
                pc_tn_nghe: numberOrNull(getRowInputValue(row, 17)),
                tn_bat_dau_dam_nhan: getRowInputValue(row, 18),
                thu_tu: index + 1
            };
            return data;
        })
        .filter(row => row.tu_thang || row.dien_bo_tri || row.cap_bac || row.he_so !== null);
}

async function insertRows(tableName, rows) {
    if (!rows.length) return;
    const { error } = await supabase.from(tableName).insert(rows);
    if (error) throw error;
}

export async function processAndSaveHoSo(existingId = null) {
    const isUpdate = !!existingId;
    const hoSoId = existingId || crypto.randomUUID();
    const hoSo = collectHoSoPayload(hoSoId);

    if (!hoSo.ho_ten_khai_sinh || !hoSo.ngay_sinh) {
        throw new Error('Vui lòng nhập Họ tên khai sinh và Ngày tháng năm sinh.');
    }

    if (isUpdate) {
        const { error: hoSoError } = await supabase.from('ho_so_qncn').update(hoSo).eq('id', hoSoId);
        if (hoSoError) throw hoSoError;

        await supabase.from('dao_tao_lai').delete().eq('ho_so_id', hoSoId);
        await supabase.from('gia_dinh').delete().eq('ho_so_id', hoSoId);
        await supabase.from('khen_thuong').delete().eq('ho_so_id', hoSoId);
        await supabase.from('ky_luat').delete().eq('ho_so_id', hoSoId);
        await supabase.from('luong_qua_trinh').delete().eq('ho_so_id', hoSoId);
    } else {
        const { error: hoSoError } = await supabase.from('ho_so_qncn').insert(hoSo);
        if (hoSoError) throw hoSoError;
    }

    await insertRows('dao_tao_lai', collectDaoTaoLaiRows(hoSoId));
    await insertRows('gia_dinh', collectGiaDinhRows(hoSoId));
    await insertRows('khen_thuong', await collectKhenKyRows('tableKhenThuong', hoSoId));
    await insertRows('ky_luat', await collectKhenKyRows('tableKyLuat', hoSoId));
    await insertRows('luong_qua_trinh', collectLuongRows(hoSoId));

    return hoSoId;
}
