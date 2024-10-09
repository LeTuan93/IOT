document.addEventListener('DOMContentLoaded', function () {
    const thresholdInput = document.getElementById('threshold-input');
    const dashCountParagraph = document.getElementById('dash-count');
    const checkButton = document.getElementById('check-button');

    // Xử lý sự kiện khi nhấn nút "OK"
    checkButton.addEventListener('click', function () {
        const threshold = thresholdInput.value;

        // Kiểm tra nếu giá trị nhập vào hợp lệ
        if (!threshold || isNaN(threshold)) {
            dashCountParagraph.textContent = 'Vui lòng nhập một số hợp lệ!';
            return;
        }

        // Lấy số lần vượt quá độ bụi qua API
        fetch(`/api`)
            .then(response => response.json())
            .then(data => {
                // const today = new Date().toISOString().split('T')[0];
                // const count = data.filter(item => item.temperature > parseFloat(threshold) && item.time.startsWith(today)).length;
                // dashCountParagraph.textContent = `Số lần vượt quá độ bụi ${threshold}ºC: ${count} lần`;
                // Lấy số lần vượt quá độ bụi qua API
                const count = data.filter(item => (item.Dash!=null && item.Dash  > parseFloat(threshold))).length;
                dashCountParagraph.textContent = `Số lần vượt quá độ bụi ${threshold} µg/m³: ${count} lần`;
                
            })
            .catch(error => {
                console.error('Error fetching temperature stats:', error);
                dashCountParagraph.textContent = 'Lỗi khi lấy dữ liệu';
            });
    });
});