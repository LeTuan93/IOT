const options = {
    host: '192.168.1.211',
    port: 9001,
    username: 'B21DCAT205',
    password: '123'
};

const client = mqtt.connect(options);

// Xử lý sự kiện kết nối
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Function to publish MQTT messages
function sendMQTTMessage(topic, message) {
    client.publish(topic, message, (err) => {
        if (err) {
            console.error('Publish error:', err);
        } else {
            console.log(`Message sent to ${topic}: ${message}`);
        }
    });
}


// Helper function to save the state to local storage
function saveStateToLocalStorage(device, state) {
    localStorage.setItem(device, state);
}

// Helper function to load the state from local storage
function loadStateFromLocalStorage(device) {
    return localStorage.getItem(device);
}

// Function to handle LED button clicks
function toggleLed(state) {
    const ledButtonOn = document.querySelector('#led-on');
    const ledButtonOff = document.querySelector('#led-off');
    const ledImg = document.getElementById('led');

    if (state === 'on') {
        ledImg.src = 'images/ledOn.png';
        ledButtonOn.classList.add('active');
        ledButtonOff.classList.remove('active');
        saveStateToLocalStorage('led', 'on');
        sendMQTTMessage('home/devices/den', 'ON');
    } else {
        ledImg.src = 'images/ledOff.png';
        ledButtonOff.classList.add('active');
        ledButtonOn.classList.remove('active');
        saveStateToLocalStorage('led', 'off');
        sendMQTTMessage('home/devices/den', 'OFF');
    }
}

// Function to handle Fan button clicks
function toggleFan(state) {
    const fanButtonOn = document.querySelector('#fan-on');
    const fanButtonOff = document.querySelector('#fan-off');
    const fanImg = document.getElementById('fan');

    if (state === 'on') {
        fanImg.src = 'images/fanOn.gif';
        fanButtonOn.classList.add('active');
        fanButtonOff.classList.remove('active');
        saveStateToLocalStorage('fan', 'on');
        sendMQTTMessage('home/devices/quat', 'ON');
    } else {
        fanImg.src = 'images/fanOff.png';
        fanButtonOff.classList.add('active');
        fanButtonOn.classList.remove('active');
        saveStateToLocalStorage('fan', 'off');
        sendMQTTMessage('home/devices/quat', 'OFF');
    }
}

// Function to handle Air Conditioner button clicks
function toggleAC(state) {
    const acButtonOn = document.querySelector('#ac-on');
    const acButtonOff = document.querySelector('#ac-off');
    const acImg = document.getElementById('ac');

    if (state === 'on') {
        acImg.src = 'images/acOn.gif';
        acButtonOn.classList.add('active');
        acButtonOff.classList.remove('active');
        saveStateToLocalStorage('ac', 'on');
        sendMQTTMessage('home/devices/dieuhoa', 'ON');
    } else {
        acImg.src = 'images/acOff.png';
        acButtonOff.classList.add('active');
        acButtonOn.classList.remove('active');
        saveStateToLocalStorage('ac', 'off');
        sendMQTTMessage('home/devices/dieuhoa', 'OFF');
    }
}

// Update functions for the state restoration
function restoreDeviceState() {
    const ledState = loadStateFromLocalStorage('led');
    toggleLed(ledState === 'on' ? 'on' : 'off');

    const fanState = loadStateFromLocalStorage('fan');
    toggleFan(fanState === 'on' ? 'on' : 'off');

    const acState = loadStateFromLocalStorage('ac');
    toggleAC(acState === 'on' ? 'on' : 'off');
}


// Call the restore function when the page loads
window.onload = restoreDeviceState;

function updateColor(elementId, value, minValue, maxValue, baseHue) {
    const element = document.getElementById(elementId);
    
    if (value < minValue) {
        element.style.backgroundColor = `hsl(${baseHue}, 100%, 20%)`; // Màu tối hơn nhiều cho giá trị rất thấp
    } else if (value > maxValue) {
        element.style.backgroundColor = `hsl(${baseHue}, 100%, 90%)`; // Màu sáng hơn nhiều cho giá trị rất cao
    } else {
        const percentage = (value - minValue) / (maxValue - minValue);
        // Điều chỉnh độ sáng từ 20% (tối) đến 90% (sáng) cho dải màu rộng hơn
        const lightness = 20 + (percentage * 70); // Sáng hơn khi giá trị cao hơn
        const saturation = 70 + (percentage * 30); // Độ bão hòa tăng khi giá trị cao hơn
        
        element.style.backgroundColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
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

        // Base hues: Red for temperature, Blue for humidity, Yellow for light
        updateColor('tp', latestData.temperature, 0, 45, 0); // Red
        updateColor('hm', latestData.humidity, 30, 70, 240); // Blue
        updateColor('lt', latestData.light, 0, 1500, 60);    // Yellow

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call fetchDataAndUpdateUI every 5 seconds to update the UI
setInterval(fetchDataAndUpdateUI, 5000);

// Call it initially when the page loads
window.addEventListener('load', fetchDataAndUpdateUI);
