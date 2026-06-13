<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hồ Sơ Cá Nhân - CV Layout</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        /* Timeline styles */
        .timeline-item relative::before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #e2e8f0;
        }

        /* Print & PDF Export Optimizations */
        @media print {
            @page { margin: 10mm; size: A4; }
            body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .print-break-avoid { break-inside: avoid; page-break-inside: avoid; }
            .shadow-lg, .shadow-md, .shadow-sm { box-shadow: none !important; }
            .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
            
            /* Ensure grid works in print */
            .grid-cols-12 { display: grid !important; grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
            .col-span-4 { grid-column: span 4 / span 4 !important; }
            .col-span-8 { grid-column: span 8 / span 8 !important; }
            
            .table-container { overflow: visible !important; }
            .print-border { border: 1px solid #e2e8f0 !important; }
        }
    </style>
</head>
<body class="text-gray-800 antialiased pb-20">

    <div class="max-w-6xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        
        <!-- Action Buttons (Hidden on PDF) -->
        <div class="flex justify-between items-center mb-6 no-print">
            <button onclick="history.back()" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm font-medium transition-colors flex items-center">
                <i class="fas fa-arrow-left mr-2 text-gray-500"></i> Quay lại
            </button>
            <button onclick="window.print()" class="px-5 py-2 bg-blue-800 rounded-lg text-white hover:bg-blue-900 shadow-md font-medium transition-colors flex items-center">
                <i class="fas fa-file-pdf mr-2"></i> Xuất PDF
            </button>
        </div>

        <!-- MAIN CV CONTAINER -->
        <div class="bg-white rounded-2xl shadow-lg print-border overflow-hidden">
            
            <!-- CV HEADER (Hero Section) -->
            <div class="bg-gradient-to-r from-blue-900 to-blue-700 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <i class="fas fa-shield-alt" style="font-size: 15rem;"></i>
                </div>
                
                <!-- Avatar placeholder -->
                <div class="w-32 h-32 bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center shrink-0 z-10 backdrop-blur-sm">
                    <i class="fas fa-user-tie text-5xl text-white"></i>
                </div>
                
                <div class="flex-1 text-center sm:text-left z-10">
                    <h1 class="text-3xl sm:text-4xl font-bold uppercase tracking-wide mb-2">Nguyễn Văn A</h1>
                    <p class="text-blue-200 text-lg font-medium mb-4 uppercase">Điều dưỡng • <span class="text-white">Khoa Hồi sức ngoại</span></p>
                    
                    <div class="flex flex-wrap justify-center sm:justify-start gap-4 text-sm mt-4 text-blue-100">
                        <div class="flex items-center bg-black/20 px-3 py-1.5 rounded-full"><i class="fas fa-id-card mr-2"></i>CMQNCN: 987654321</div>
                        <div class="flex items-center bg-black/20 px-3 py-1.5 rounded-full"><i class="fas fa-hospital-user mr-2"></i>Khối: Dự toán</div>
                        <div class="flex items-center bg-black/20 px-3 py-1.5 rounded-full"><i class="fas fa-calendar-alt mr-2"></i>Nhập ngũ: 09/2008</div>
                    </div>
                </div>
            </div>

            <!-- CV CONTENT (2 Columns) -->
            <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <!-- LEFT COLUMN (Sidebar info) -->
                <div class="lg:col-span-4 space-y-8">
                    
                    <!-- Giới thiệu -->
                    <div class="print-break-avoid">
                        <h2 class="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                            <span class="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i class="fas fa-info-circle w-4 h-4 flex items-center justify-center"></i></span> Thông tin cá nhân
                        </h2>
                        <ul class="space-y-3 text-sm text-gray-600">
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Ngày sinh</span>
                                <span class="text-gray-900 font-medium">01/05/1990</span>
                            </li>
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Giới tính</span>
                                <span class="text-gray-900 font-medium">Nam</span>
                            </li>
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Nhóm máu</span>
                                <span class="text-gray-900 font-medium text-red-500 font-bold">O</span>
                            </li>
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Hôn nhân</span>
                                <span class="text-gray-900 font-medium">Đã kết hôn</span>
                            </li>
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Ngoại ngữ</span>
                                <span class="text-gray-900 font-medium">Tiếng Anh B1</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Liên hệ -->
                    <div class="print-break-avoid">
                        <h2 class="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                            <span class="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i class="fas fa-map-marker-alt w-4 h-4 flex items-center justify-center"></i></span> Địa chỉ liên hệ
                        </h2>
                        <div class="space-y-4 text-sm">
                            <div>
                                <p class="font-medium text-gray-500 mb-1"><i class="fas fa-home mr-1 opacity-50"></i> Quê quán</p>
                                <p class="text-gray-900 font-medium">Xã Tiên Kiên, Huyện Lâm Thao, Tỉnh Phú Thọ</p>
                            </div>
                            <div class="pt-2 border-t border-gray-100">
                                <p class="font-medium text-gray-500 mb-1"><i class="fas fa-map-pin mr-1 opacity-50"></i> Nơi thường trú / Chỗ ở</p>
                                <p class="text-gray-900 font-medium">Số 10, Ngõ 20, Phường Phúc La, Quận Hà Đông, TP Hà Nội</p>
                            </div>
                        </div>
                    </div>

                    <!-- Giấy tờ -->
                    <div class="print-break-avoid">
                        <h2 class="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                            <span class="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i class="fas fa-id-badge w-4 h-4 flex items-center justify-center"></i></span> Giấy tờ tùy thân
                        </h2>
                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm">
                            <p class="font-semibold text-gray-800 mb-1">Căn cước công dân</p>
                            <p class="text-xl font-bold text-blue-800 tracking-wider mb-2">001090123456</p>
                            <div class="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Cấp: 20/05/2021</span>
                                <span>Hết hạn: 01/05/2030</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Nơi cấp: Cục CSQLHC về TTXH</p>
                        </div>
                    </div>

                    <!-- Nhận dạng & Sức khỏe -->
                    <div class="print-break-avoid">
                        <h2 class="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center">
                            <span class="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3"><i class="fas fa-heartbeat w-4 h-4 flex items-center justify-center"></i></span> Nhận dạng & Sức khỏe
                        </h2>
                        <ul class="space-y-3 text-sm text-gray-600">
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Sức khỏe</span>
                                <span class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Loại 1 (Tốt)</span>
                            </li>
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Chiều cao</span>
                                <span class="text-gray-900 font-medium">1.70 m</span>
                            </li>
                            <li class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500">Dấu vết riêng</span>
                                <span class="text-gray-900 font-medium text-right w-1/2">Sẹo nhỏ 1cm dưới cằm</span>
                            </li>
                            <li class="flex justify-between">
                                <span class="font-medium text-gray-500">Hạn dùng (CMTQĐ)</span>
                                <span class="text-gray-900 font-medium">05/2046</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <!-- RIGHT COLUMN (Main Content) -->
                <div class="lg:col-span-8 space-y-8">
                    
                    <!-- Các mốc thời gian (Timeline) -->
                    <div class="print-break-avoid">
                        <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide">
                            <i class="fas fa-flag text-blue-600 mr-2"></i> Trục thời gian Đảng / Đoàn
                        </h2>
                        <div class="relative pl-6 border-l-2 border-blue-200 space-y-6">
                            <div class="relative">
                                <div class="absolute -left-8 bg-blue-600 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                <h3 class="font-bold text-gray-800">Tuyển dụng / Nhập ngũ</h3>
                                <p class="text-sm text-gray-500">Tháng 09/2008 (Tuyển dụng) - Tháng 02/2009 (Nhập ngũ)</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-8 bg-blue-400 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                <h3 class="font-bold text-gray-800">Kết nạp Đoàn TNCS HCM</h3>
                                <p class="text-sm text-gray-500">Ngày 26/03/2006</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-8 bg-red-500 h-4 w-4 rounded-full border-4 border-white shadow"></div>
                                <h3 class="font-bold text-gray-800">Kết nạp Đảng CSVN</h3>
                                <p class="text-sm text-gray-500">Dự bị: 03/02/2012 <span class="mx-2">|</span> Chính thức: 03/02/2013</p>
                            </div>
                        </div>
                    </div>

                    <!-- Đào tạo -->
                    <div class="print-break-avoid">
                        <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                            <i class="fas fa-graduation-cap text-blue-600 mr-2"></i> Quá trình Đào tạo
                        </h2>
                        
                        <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
                            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                <h3 class="font-bold text-blue-900 text-lg">Đại học - Điều dưỡng</h3>
                                <span class="bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full w-max">Trình độ cao nhất</span>
                            </div>
                            <p class="text-sm text-gray-600"><i class="fas fa-calendar-check mr-2 opacity-50"></i>Năm tốt nghiệp: 2012</p>
                        </div>

                        <h4 class="font-semibold text-gray-700 text-sm mb-2 mt-4">Thông tin đào tạo lại / Bổ túc</h4>
                        <div class="overflow-x-auto custom-scrollbar border rounded-lg">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th class="px-4 py-2 font-medium">Thời gian</th>
                                        <th class="px-4 py-2 font-medium">Loại / Bậc</th>
                                        <th class="px-4 py-2 font-medium">Cơ sở đào tạo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-t border-gray-100">
                                        <td class="px-4 py-3 whitespace-nowrap text-gray-600">05/2015 - 08/2015</td>
                                        <td class="px-4 py-3"><span class="font-medium text-gray-800">Bổ túc</span><br><span class="text-xs text-gray-500">Chứng chỉ</span></td>
                                        <td class="px-4 py-3">Học viện Quân y</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Đánh giá, Khen thưởng -->
                    <div class="print-break-avoid">
                        <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                            <i class="fas fa-star text-yellow-500 mr-2"></i> Thành tích & Kỷ luật
                        </h2>
                        
                        <div class="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
                            <div class="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                <div class="text-2xl font-black text-blue-700">3</div>
                                <div class="text-[10px] sm:text-xs uppercase font-semibold text-gray-600 mt-1">Năm Xuất sắc</div>
                            </div>
                            <div class="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                                <div class="text-2xl font-black text-green-600">5</div>
                                <div class="text-[10px] sm:text-xs uppercase font-semibold text-gray-600 mt-1">Năm Tốt</div>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                                <div class="text-2xl font-black text-gray-600">0</div>
                                <div class="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 mt-1">Hoàn thành</div>
                            </div>
                            <div class="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                                <div class="text-2xl font-black text-red-500">0</div>
                                <div class="text-[10px] sm:text-xs uppercase font-semibold text-gray-600 mt-1">Không HT</div>
                            </div>
                        </div>

                        <!-- Timeline khen thưởng -->
                        <div class="relative pl-6 border-l-2 border-green-200 space-y-4">
                            <div class="relative">
                                <div class="absolute -left-[29px] bg-white text-green-500 h-6 w-6 rounded-full border-2 border-green-200 flex items-center justify-center"><i class="fas fa-trophy text-xs"></i></div>
                                <h3 class="font-bold text-gray-800">Bằng khen - Bộ Quốc phòng</h3>
                                <p class="text-xs text-gray-500 font-medium mb-1">22/12/2022</p>
                                <p class="text-sm text-gray-700">Hoàn thành xuất sắc nhiệm vụ phòng chống dịch.</p>
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-4 border-t border-dashed border-gray-200">
                            <p class="text-sm text-gray-500 italic"><i class="fas fa-check-circle text-green-500 mr-1"></i> Không có bản ghi kỷ luật.</p>
                        </div>
                    </div>

                    <!-- Gia đình -->
                    <div class="print-break-avoid">
                        <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-2 mb-5 flex items-center uppercase tracking-wide mt-8">
                            <i class="fas fa-users text-blue-600 mr-2"></i> Quan hệ gia đình
                        </h2>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Card gia đình -->
                            <div class="border border-gray-200 p-3 rounded-xl hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="font-bold text-gray-800 text-sm">Lê Thị D</h4>
                                    <span class="bg-pink-100 text-pink-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Vợ (chồng)</span>
                                </div>
                                <p class="text-xs text-gray-500 mb-2">Sinh: 1992 • Giáo viên • <span class="text-green-600 font-medium">Còn sống</span></p>
                                <p class="text-xs text-gray-600"><i class="fas fa-phone mr-1 opacity-50"></i>0987654321</p>
                            </div>
                            
                            <div class="border border-gray-200 p-3 rounded-xl hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="font-bold text-gray-800 text-sm">Nguyễn Văn B</h4>
                                    <span class="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Cha đẻ</span>
                                </div>
                                <p class="text-xs text-gray-500">Sinh: 1960 • Hưu trí • <span class="text-green-600 font-medium">Còn sống</span></p>
                            </div>

                            <div class="border border-gray-200 p-3 rounded-xl hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="font-bold text-gray-800 text-sm">Trần Thị C</h4>
                                    <span class="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Mẹ đẻ</span>
                                </div>
                                <p class="text-xs text-gray-500">Sinh: 1965 • Nội trợ • <span class="text-green-600 font-medium">Còn sống</span></p>
                            </div>

                            <div class="border border-gray-200 p-3 rounded-xl opacity-75">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="font-bold text-gray-800 text-sm line-through">Nguyễn Văn E</h4>
                                    <span class="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Ông nội</span>
                                </div>
                                <p class="text-xs text-gray-500">Sinh: 1935 • Nông dân • <span class="text-red-500 font-medium">Đã mất (2010)</span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- FULL WIDTH BOTTOM (Salary & Process) -->
            <div class="p-6 sm:p-8 bg-gray-50 border-t border-gray-100">
                <div class="print-break-avoid">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-5 flex items-center uppercase tracking-wide">
                        <i class="fas fa-money-check-alt text-blue-600 mr-2"></i> Quá trình công tác & Hưởng lương
                    </h2>
                    
                    <div class="flex flex-wrap gap-6 mb-6 text-sm">
                        <div class="flex items-center"><i class="fas fa-file-contract text-gray-400 mr-2 text-lg"></i> <div><p class="text-xs text-gray-500 font-medium">Theo chế độ</p><p class="font-bold text-gray-800">Tuyển dụng QNCN</p></div></div>
                        <div class="flex items-center"><i class="fas fa-calendar-alt text-gray-400 mr-2 text-lg"></i> <div><p class="text-xs text-gray-500 font-medium">Bắt đầu BHXH</p><p class="font-bold text-gray-800">01/2009</p></div></div>
                        <div class="flex items-center"><i class="fas fa-book-medical text-gray-400 mr-2 text-lg"></i> <div><p class="text-xs text-gray-500 font-medium">Sổ BHXH/BHYT</p><p class="font-bold text-gray-800">1234567890</p></div></div>
                    </div>

                    <div class="overflow-x-auto custom-scrollbar bg-white rounded-xl border border-gray-200 shadow-sm">
                        <table class="w-full text-sm text-left whitespace-nowrap">
                            <thead class="bg-blue-50 text-blue-900 border-b border-blue-100">
                                <tr>
                                    <th class="px-4 py-3 font-semibold text-center w-12">#</th>
                                    <th class="px-4 py-3 font-semibold">Thời gian</th>
                                    <th class="px-4 py-3 font-semibold">Đơn vị công tác</th>
                                    <th class="px-4 py-3 font-semibold">Cấp bậc / Chức vụ</th>
                                    <th class="px-4 py-3 font-semibold text-center">Ngạch/Bậc</th>
                                    <th class="px-4 py-3 font-semibold text-center rounded-tr-xl">Hệ số</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 text-center text-gray-400 font-medium">1</td>
                                    <td class="px-4 py-3 text-gray-600 font-medium">01/2009 - 09/2010</td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-gray-800">Học viện Quân y</p>
                                        <p class="text-xs text-gray-500">Khoa Hồi sức ngoại</p>
                                    </td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-gray-800">Điều dưỡng</p>
                                        <p class="text-xs text-blue-600 font-medium">VCQP (Chuyển diện bố trí)</p>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Trung cấp</span><br>
                                        <span class="text-xs font-medium text-gray-500 mt-1 inline-block">1/10</span>
                                    </td>
                                    <td class="px-4 py-3 text-center font-bold text-lg text-blue-700">1.86</td>
                                </tr>
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 text-center text-gray-400 font-medium">2</td>
                                    <td class="px-4 py-3 text-gray-600 font-medium">10/2010 - 12/2011</td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-gray-800">Học viện Quân y</p>
                                        <p class="text-xs text-gray-500">Khoa Hồi sức ngoại</p>
                                    </td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-gray-800">Điều dưỡng</p>
                                        <p class="text-xs text-blue-600 font-medium">QNCN 1/ CN (Chuyển diện ĐT)</p>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Trung cấp</span><br>
                                        <span class="text-xs font-medium text-gray-500 mt-1 inline-block">1/10</span>
                                    </td>
                                    <td class="px-4 py-3 text-center font-bold text-lg text-blue-700">3.50</td>
                                </tr>
                                <tr class="hover:bg-gray-50 transition-colors bg-blue-50/30">
                                    <td class="px-4 py-3 text-center text-gray-400 font-medium">3</td>
                                    <td class="px-4 py-3 text-gray-800 font-bold flex items-center"><span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>01/2012 - Nay</td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-gray-800">Học viện Quân y</p>
                                        <p class="text-xs text-gray-500">Khoa Hồi sức ngoại</p>
                                    </td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-gray-800">Điều dưỡng</p>
                                        <p class="text-xs text-blue-600 font-medium">QNCN 1/ CN (Nâng lương ĐH)</p>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Trung cấp</span><br>
                                        <span class="text-xs font-medium text-gray-500 mt-1 inline-block">2/10</span>
                                    </td>
                                    <td class="px-4 py-3 text-center font-bold text-lg text-blue-700">3.80</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <!-- END MAIN CV CONTAINER -->

        <!-- Chữ ký in ấn (Chỉ hiện khi lưu PDF) -->
        <div class="hidden print-header mt-12 px-10">
            <div class="grid grid-cols-2 text-center text-gray-800">
                <div>
                    <p class="font-bold text-sm uppercase">Người khai</p>
                    <p class="italic text-xs text-gray-500 mb-20">(Ký, ghi rõ họ tên)</p>
                    <p class="font-bold">Nguyễn Văn A</p>
                </div>
                <div>
                    <p class="italic text-xs text-gray-500 mb-1">Ngày ..... tháng ..... năm 20.....</p>
                    <p class="font-bold text-sm uppercase">Thủ trưởng đơn vị</p>
                    <p class="italic text-xs text-gray-500 mb-20">(Ký, đóng dấu, ghi rõ họ tên)</p>
                </div>
            </div>
        </div>

    </div>

</body>
</html>