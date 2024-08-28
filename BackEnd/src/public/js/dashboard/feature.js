// Helper function to save the state to local storage
function saveStateToLocalStorage(device, state) {
    localStorage.setItem(device, state);
}

// Helper function to load the state from local storage
function loadStateFromLocalStorage(device) {
    return localStorage.getItem(device);
}

// LED
function playLed() {
    document.getElementById('led').src = 'images/ledOn.png';
    saveStateToLocalStorage('led', 'on');
}

function stopLed() {
    document.getElementById('led').src = 'images/ledOff.png';
    saveStateToLocalStorage('led', 'off');
}

// Fan
function playFan() {
    document.getElementById('fan').src = 'images/fanOn.gif';
    saveStateToLocalStorage('fan', 'on');
}

function stopFan() {
    document.getElementById('fan').src = 'images/fanOff.png';
    saveStateToLocalStorage('fan', 'off');
}

// Air Conditioner
function playAC() {
    document.getElementById('ac').src = 'images/acOn.gif';
    saveStateToLocalStorage('ac', 'on');
}

function stopAC() {
    document.getElementById('ac').src = 'images/acOff.png';
    saveStateToLocalStorage('ac', 'off');
}

// Function to restore the state of the devices on page load
function restoreDeviceState() {
    // Restore LED
    const ledState = loadStateFromLocalStorage('led');
    if (ledState === 'on') {
        playLed();
    } else {
        stopLed();
    }

    // Restore Fan
    const fanState = loadStateFromLocalStorage('fan');
    if (fanState === 'on') {
        playFan();
    } else {
        stopFan();
    }

    // Restore Air Conditioner
    const acState = loadStateFromLocalStorage('ac');
    if (acState === 'on') {
        playAC();
    } else {
        stopAC();
    }
}

// Call the restore function when the page loads
window.onload = restoreDeviceState;



// Hàm để cập nhật màu sắc dựa trên giá trị
function updateColor(elementId, value, minValue, maxValue, baseHue) {
    const element = document.getElementById(elementId);
    
    if (value < minValue) {
        element.style.backgroundColor = `hsl(${baseHue}, 100%, 80%)`; // Màu nhạt hơn cho giá trị thấp
    } else if (value > maxValue) {
        element.style.backgroundColor = `hsl(${baseHue}, 100%, 30%)`; // Màu đậm hơn cho giá trị cao
    } else {
        const percentage = (value - minValue) / (maxValue - minValue);
        const lightness = 80 - (percentage * 50); // Điều chỉnh độ sáng từ 80% (nhạt) đến 30% (đậm)
        element.style.backgroundColor = `hsl(${baseHue}, 100%, ${lightness}%)`;
    }
}

async function fetchDataAndUpdateUI() {
    try {
        const response = await fetch('/api'); 
        const data = await response.json();

        const latestData = data[data.length - 1];

        document.getElementById('nhietdo').textContent = `${latestData.temperature}ºC`;
        document.getElementById('doam').textContent = `${latestData.humidity}%`;
        document.getElementById('anhsang').textContent = `${latestData.light} lux`;

        // Base hues: Red for temperature, Green for humidity, Yellow for light
        updateColor('tp', latestData.temperature, 0, 45, 0); // Red
        updateColor('hm', latestData.humidity, 30, 70, 240); // Green
        updateColor('lt', latestData.light, 0, 1500, 60);    // Yellow

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Gọi hàm fetchDataAndUpdateUI mỗi 5 giây để cập nhật giao diện
setInterval(fetchDataAndUpdateUI, 5000);

// Gọi lần đầu khi trang được tải
window.addEventListener('load', fetchDataAndUpdateUI);


