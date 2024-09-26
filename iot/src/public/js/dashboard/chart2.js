// let chart; // Khai báo biến chart toàn cục
// let labels = [];

// let dashData = [];

// // Hàm này sẽ chuyển đổi dữ liệu từ API thành định dạng phù hợp với Chart.js
// function transformData(apiData) {
//     // Giới hạn số lượng điểm dữ liệu hiển thị
//     const newData = apiData.slice(-1)[0]; // Chỉ lấy dữ liệu mới nhất

//     // Chuyển đổi dữ liệu mới thành định dạng phù hợp
//     const date = new Date(newData.time);  
//     const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//     const dateLabel = date.toLocaleDateString();
//     const newLabel = `${timeLabel}\n${dateLabel}`;

//     // Thêm dữ liệu mới vào các mảng
//     dashData.push(newData.Dash);


//     // Giới hạn số lượng điểm dữ liệu hiển thị
//     if (labels.length > 10) {
//         dashData.shift(); // Xóa điểm dữ liệu cũ nhất
        
//     }

//     // Trả về dữ liệu đã chuyển đổi phù hợp với định dạng Chart.js
//     return {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Dash',
//                 data: dashData,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 fill: false,
//                 tension: 0.4,
//             }
//         ]
//     };
// }

// // Hàm này sẽ khởi tạo biểu đồ với dữ liệu lấy từ API
// function createChart(ctx, chartData) {
//     return new Chart(ctx, {
//         type: 'line', // Loại biểu đồ
//         data: chartData, // Sử dụng dữ liệu từ API
//         options: {
//             responsive: true, // Biểu đồ tự động điều chỉnh kích thước
//             plugins: { // Các plugin mở rộng
//                 tooltip: { // Hiển thị tooltip khi di chuột qua biểu đồ
//                     enabled: true,
//                     mode: 'nearest', // Hiển thị tooltip cho dữ liệu gần nhất
//                     intersect: false, // Hiển thị tooltip cho mỗi dữ liệu
//                 },
//                 legend: {
//                     display: true, // Hiển thị chú thích
//                     position: 'top', // Đặt chú thích ở trên cùng
//                 }
//             },
//             scales: { // Cấu hình trục x và trục y
//                 x: {
//                     title: { // Tiêu đề trục x
//                         display: true,
//                         text: 'Time',
//                     },
//                     ticks: { // Cấu hình nhãn trục x
//                         autoSkip: false, // Đảm bảo không tự động bỏ qua nhãn
//                         maxTicksLimit: 10, // Chỉ hiển thị tối đa 10 nhãn
//                         callback: function(value, index, values) {
//                             // Hiển thị nhãn với ngày và giờ trên hai dòng
//                             return this.getLabelForValue(value).split('\n');
//                         }
//                     },
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Values',
//                     },
//                     beginAtZero: true,
//                     min: 0,
//                 }
//             }
//         }
//     });
// }

// // Hàm để cập nhật dữ liệu của biểu đồ
// function updateChartData(chart, newData) {
//     chart.data = newData;
//     chart.update();
// }

// // Hàm để gọi API và cập nhật biểu đồ
// function fetchDataAndUpdateChart() {
//     fetch('/api')
//         .then(response => response.json())
//         .then(data => {
//             const newChartData = transformData(data);
//             // Nếu biểu đồ đã tồn tại, cập nhật dữ liệu
//             if (chart) {
//                 updateChartData(chart, newChartData);
//             } else {
//                 // Nếu chưa có biểu đồ, khởi tạo mới
//                 const ctx = document.getElementById('chartCanvas2').getContext('2d'); // Lấy context của canvas
//                 chart = createChart(ctx, newChartData);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching chart data:', error);
//             // Nếu có lỗi, có thể tạo một biểu đồ trống hoặc dữ liệu mặc định
//             if (chart) {
//                 updateChartData(chart, {
//                     labels: ['No data'],
//                     datasets: []
//                 });
//             } else {
//                 const ctx = document.getElementById('chartCanvas2').getContext('2d');
//                 chart = createChart(ctx, {
//                     labels: ['No data'],
//                     datasets: []
//                 });
//             }
//         });
// }

// // Khi tài liệu đã được tải, khởi tạo biểu đồ và bắt đầu cập nhật dữ liệu
// window.addEventListener('load', () => {
//     fetchDataAndUpdateChart(); // Khởi tạo biểu đồ lần đầu
//     // Cập nhật dữ liệu sau mỗi 5 giây (5000 ms)
//     setInterval(fetchDataAndUpdateChart, 5000);
// });
