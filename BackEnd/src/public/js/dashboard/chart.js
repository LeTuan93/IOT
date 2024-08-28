// Hàm này sẽ chuyển đổi dữ liệu từ API thành định dạng phù hợp với Chart.js
function transformData(apiData) {
    // Giới hạn số lượng điểm dữ liệu hiển thị
    const limitedData = apiData.slice(-10);

    // Khởi tạo các mảng cho nhãn thời gian và dữ liệu
    const labels = [];
    const temperatureData = [];
    const humidityData = [];
    const lightData = [];

    // Lặp qua dữ liệu API để đẩy dữ liệu vào các mảng
    limitedData.forEach(item => {
        const date = new Date(item.time);
        const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateLabel = date.toLocaleDateString();
        
        labels.push(`${timeLabel}\n${dateLabel}`); // Hiển thị giờ và ngày trên các dòng khác nhau
        temperatureData.push(item.temperature);
        humidityData.push(item.humidity);
        lightData.push(item.light);
    });

    // Trả về dữ liệu đã chuyển đổi phù hợp với định dạng Chart.js
    return {
        labels: labels,
        datasets: [
            {
                label: 'Temperature (ºC)',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Humidity (%)',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Light (lux)',
                data: lightData,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: false,
                tension: 0.4,
            }
        ]
    };
}


// Hàm này sẽ khởi tạo biểu đồ với dữ liệu lấy từ API
function createChart(ctx, chartData) {
    const chart = new Chart(ctx, {
        type: 'line', // Loại biểu đồ
        data: chartData, // Sử dụng dữ liệu từ API
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    intersect: false,
                },
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                    ticks: {
                        autoSkip: false, // Đảm bảo không tự động bỏ qua nhãn
                        maxTicksLimit: 10, // Chỉ hiển thị tối đa 10 nhãn
                        callback: function(value, index, values) {
                            // Hiển thị nhãn với ngày và giờ trên hai dòng
                            return this.getLabelForValue(value).split('\n');
                        }
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Values',
                    },
                    beginAtZero: true,
                    min: 0,
                }
            }
        }
    });

    return chart;
}

// Khi tài liệu đã được tải, khởi tạo biểu đồ với dữ liệu từ API
window.addEventListener('load', () => {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    
    // Gọi API để lấy dữ liệu biểu đồ
    fetch('/api')
        .then(response => response.json())
        .then(data => {
            // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với Chart.js
            const chartData = transformData(data);
            // Khởi tạo biểu đồ với dữ liệu từ API
            createChart(ctx, chartData);
        })
        .catch(error => {
            console.error('Error fetching chart data:', error);
            // Lỗi sẽ hiển thị một biểu đồ trống hoặc dữ liệu mặc định
            createChart(ctx, {
                labels: ['No data'],
                datasets: []
            });
        });
});
