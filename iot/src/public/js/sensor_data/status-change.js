// document.addEventListener('DOMContentLoaded', function () {
//     // Xử lý sự kiện khi nhấn nút "Kiểm tra" cho số lần bật tắt
//     const deviceIdInput = document.getElementById('device-id-input');
//     const statusChangeCountParagraph = document.getElementById('status-change-count');
//     const countStatusButton = document.getElementById('count-status-button');

//     countStatusButton.addEventListener('click', function () {
//         const deviceName = deviceIdInput.value.trim();

//         // Kiểm tra nếu giá trị nhập vào hợp lệ
//         if (!deviceName) {
//             statusChangeCountParagraph.textContent = 'Vui lòng nhập tên thiết bị!';
//             return;
//         }

//         // Gọi API để lấy số lần bật tắt
//         fetch(`/api/action-history`)
//             .then(response => response.json())
//             .then(data => {
//                 // Lọc dữ liệu theo tên thiết bị (device_id)
//                 const deviceActions = data.filter(item => item.device_id.toLowerCase() === deviceName.toLowerCase());

//                 // Đếm số lần bật và tắt
//                 const countOn = deviceActions.filter(item => item.status === 'Turned On').length;
//                 const countOff = deviceActions.filter(item => item.status === 'Turned Off').length;
//                 const totalCount = countOn + countOff;

//                 // Cập nhật thông báo
//                 statusChangeCountParagraph.textContent = `
//                     Số lần bật thiết bị "${deviceName}": ${countOn} lần,
//                     Số lần tắt thiết bị "${deviceName}": ${countOff} lần, 
//                     Tổng số lần bật và tắt: ${totalCount} lần
//                 `;
//             })
//             .catch(error => {
//                 console.error('Error fetching status change count:', error);
//                 statusChangeCountParagraph.textContent = 'Lỗi khi lấy dữ liệu';
//             });
//     });
// });
