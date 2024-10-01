// document.addEventListener('DOMContentLoaded', function () {
//     const thresholdInput = document.getElementById('threshold-input');
//     const temperatureCountParagraph = document.getElementById('temperature-count');
//     const checkButton = document.getElementById('check-button');

//     // Xử lý sự kiện khi nhấn nút "OK"
//     checkButton.addEventListener('click', function () {
//         const threshold = thresholdInput.value;

//         // Kiểm tra nếu giá trị nhập vào hợp lệ
//         if (!threshold || isNaN(threshold)) {
//             temperatureCountParagraph.textContent = 'Vui lòng nhập một số hợp lệ!';
//             return;
//         }

//         // Lấy số lần vượt quá nhiệt độ qua API trong ngày hoom nay
//         fetch(`/api`)
//             .then(response => response.json())
//             .then(data => {
//                 const today = new Date().toISOString().split('T')[0];
//                 const count = data.filter(item => item.temperature > parseFloat(threshold) && item.time.startsWith(today)).length;
//                 temperatureCountParagraph.textContent = `Số lần vượt quá nhiệt độ ${threshold}ºC trong ngày hôm nay: ${count} lần`;
//             })
//             .catch(error => {
//                 console.error('Error fetching temperature stats:', error);
//                 temperatureCountParagraph.textContent = 'Lỗi khi lấy dữ liệu';
//             });
//     });
// });