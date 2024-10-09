let chart; // Khai báo biến chart toàn cục
let chart2; //..
let labels = [];
let labels2 = []; //..

let temperatureData = [];
let humidityData = [];
let lightData = [];
// let dashData = []; //..
let dashData2 = []; // ...


// Hàm này sẽ chuyển đổi dữ liệu từ API thành định dạng phù hợp với Chart.js
function transformData(apiData) {
    // Giới hạn số lượng điểm dữ liệu hiển thị
    const newData = apiData.slice(-1)[0]; // Chỉ lấy dữ liệu mới nhất

    // Chuyển đổi dữ liệu mới thành định dạng phù hợp
    const date = new Date(newData.time);
    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateLabel = date.toLocaleDateString();
    const newLabel = `${timeLabel}\n${dateLabel}`;

    // Thêm dữ liệu mới vào các mảng
    labels.push(newLabel);
    temperatureData.push(newData.temperature);
    humidityData.push(newData.humidity);
    lightData.push(newData.light);

    // dashData.push(newData.Dash); //..

    // // Kiểm tra nếu giá trị light vượt quá 700
    // if (newData.light > 500) {
    //     alert(`Cảnh báo: Mức ánh sáng cao (${newData.light}) tại ${timeLabel} ${dateLabel}`);
    // }

    // Giới hạn số lượng điểm dữ liệu hiển thị
    if (labels.length > 10) {
        labels.shift();
        temperatureData.shift();
        humidityData.shift();
        lightData.shift();

        // dashData.shift(); //..
        
    }

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
            // {
            //     label: 'Dash (µg/m³)', //..
            //     data: dashData,
            //     borderColor: 'rgba(75, 192, 192, 1)',
            //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
            //     fill: false,
            //     tension: 0.4,
            // }
        ]
    };
}

// ...
function transformData2(apiData) {
    // Giới hạn số lượng điểm dữ liệu hiển thị
    const newData = apiData.slice(-1)[0]; // Chỉ lấy dữ liệu mới nhất

    // Chuyển đổi dữ liệu mới thành định dạng phù hợp
    const date = new Date(newData.time);
    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateLabel = date.toLocaleDateString();
    const newLabel = `${timeLabel}\n${dateLabel}`;

    // Thêm dữ liệu mới vào các mảng
    labels2.push(newLabel);
    dashData2.push(newData.Dash);

    // // Kiểm tra nếu giá trị light vượt quá 700
    // if (newData.light > 500) {
    //     alert(`Cảnh báo: Mức ánh sáng cao (${newData.light}) tại ${timeLabel} ${dateLabel}`);
    // }

    // Giới hạn số lượng điểm dữ liệu hiển thị
    if (labels2.length > 10) {
        labels2.shift();
        dashData2.shift(); // Xóa điểm dữ liệu cũ nhất
        
    }

    // Trả về dữ liệu đã chuyển đổi phù hợp với định dạng Chart.js
    return {
        labels: labels,
        datasets: [
            {
                label: 'Dash (µg/m³)',
                data: dashData2,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.4,
            }
        ]
    };
}

// Hàm này sẽ khởi tạo biểu đồ với dữ liệu lấy từ API
function createChart(ctx, chartData) {
    return new Chart(ctx, {
        type: 'line', // Loại biểu đồ
        data: chartData, // Sử dụng dữ liệu từ API
        options: {
            responsive: true, // Biểu đồ tự động điều chỉnh kích thước
            plugins: { // Các plugin mở rộng
                tooltip: { // Hiển thị tooltip khi di chuột qua biểu đồ
                    enabled: true,
                    mode: 'nearest', // Hiển thị tooltip cho dữ liệu gần nhất
                    intersect: false, // Hiển thị tooltip cho mỗi dữ liệu
                },
                legend: {
                    display: true, // Hiển thị chú thích
                    position: 'top', // Đặt chú thích ở trên cùng
                }
            },
            scales: { // Cấu hình trục x và trục y
                x: {
                    title: { // Tiêu đề trục x
                        display: true,
                        text: 'Time',
                    },
                    ticks: { // Cấu hình nhãn trục x
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
}

// Hàm để cập nhật dữ liệu của biểu đồ
function updateChartData(chart, newData) {
    chart.data = newData;
    chart.update();
}

// Hàm để gọi API và cập nhật biểu đồ
function fetchDataAndUpdateChart() {
    fetch('/api')
        .then(response => response.json())
        .then(data => {
            const newChartData = transformData(data);
            const newChartDash = transformData2(data); // ...
            // Nếu biểu đồ đã tồn tại, cập nhật dữ liệu
            if (chart) {
                updateChartData(chart, newChartData);
                updateChartData(chart2, newChartDash); //...

            } else {
                // Nếu chưa có biểu đồ, khởi tạo mới
                const ctx = document.getElementById('chartCanvas').getContext('2d'); // Lấy context của canvas
                chart = createChart(ctx, newChartData);

                const ctx2 = document.getElementById('chartCanvas2').getContext('2d'); // Lấy context của canvas
                chart2 = createChart(ctx2, newChartDash); // for dash
            }
        })
        .catch(error => {
            console.error('Error fetching chart data:', error);
            // Nếu có lỗi, có thể tạo một biểu đồ trống hoặc dữ liệu mặc định
            if (chart) {
                updateChartData(chart, {
                    labels: ['No data'],
                    datasets: []
                });
            } else {
                const ctx = document.getElementById('chartCanvas').getContext('2d');
                chart = createChart(ctx, {
                    labels: ['No data'],
                    datasets: []
                });
            }

            if (chart2) {
                updateChartData(chart2, {
                    labels: ['No data'],
                    datasets: []
                });
            } else {
                const ctx2 = document.getElementById('chartCanvas2').getContext('2d');
                chart2 = createChart(ctx2, {
                    labels: ['No data'],
                    datasets: []
                });
            }
        });
}

// Khi tài liệu đã được tải, khởi tạo biểu đồ và bắt đầu cập nhật dữ liệu
window.addEventListener('load', () => {
    fetchDataAndUpdateChart(); // Khởi tạo biểu đồ lần đầu
    // Cập nhật dữ liệu sau mỗi 5 giây (5000 ms)
    setInterval(fetchDataAndUpdateChart, 5000);
});
