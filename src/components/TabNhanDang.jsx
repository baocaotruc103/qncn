import React from 'react';

export default function TabNhanDang({ initialData = {} }) {
    return (
        <section id="tab5" className="tab-pane block">
            
                <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4"><i className="fas fa-fingerprint mr-2"></i>33 & 38. Đặc điểm nhận dạng & Sức khỏe</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">33.1 Cao (m)</label>
                        <input type="number" step="0.01" defaultValue={initialData?.chieu_cao_m || ''} className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">33.2 Sống mũi</label>
                        <input type="text" defaultValue={initialData?.song_mui || ''} className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">33.3 Nếp tai dưới</label>
                        <input type="text" defaultValue={initialData?.nep_tai_duoi || ''} className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">33.4 Dái tai</label>
                        <input type="text" defaultValue={initialData?.dai_tai || ''} className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">33.5 Dấu vết riêng <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(ghi giống dấu vết riêng trên CCCD)</em></label>
                        <input type="text" defaultValue={initialData?.dau_vet_rieng || ''} className="mt-1 block w-full rounded border p-2" placeholder="" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">33.6 Hạn dùng <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(Quân hàm trung tá CN trở xuống ghi đến tháng sinh khi đủ 56 tuổi; quân hàm Thượng tá CN đối với nam tháng sinh của năm đủ 58 tuổi, với nữ tháng sinh năm đủ 57 tuổi)</em></label>
                        <input type="text" defaultValue={initialData?.han_dung || ''} inputMode="numeric" placeholder="mm/yyyy" pattern="(0[1-9]|1[0-2])\/[0-9]{4}" data-month-year className="mt-1 block w-full rounded border p-2" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">38. Thông tin sức khỏe <em className="text-xs text-gray-500 font-normal block mt-0.5 italic">(loại 1, loại 2, ...Thông tin mắc bệnh hiểm nghèo/Bệnh cần chữa trị dài ngày căn cứ vào kết luận khám sức khỏe hàng năm)</em></label>
                        <input type="text" defaultValue={initialData?.thong_tin_suc_khoe || ''} className="mt-1 block w-full rounded border p-2" />
                    </div>
                </div>
            
        </section>
    );
}
