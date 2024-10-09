const socket = io(); // Kết nối đến server Socket.IO

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('deviceStatus', (statusData) => {
    console.log('Received device status:', statusData);
    const ledImg = document.getElementById('led');
    if (statusData.device_id === 'Led') {
        const ledButtonOn = document.querySelector('#led-on');
        const ledButtonOff = document.querySelector('#led-off');
        const ledImg = document.getElementById('led');
        if (statusData.status === 'Turned On') {
            ledImg.src = 'images/ledOn.png';
            ledButtonOn.classList.add('active');
            ledButtonOff.classList.remove('active');
            saveStateToLocalStorage('led', 'on'); // Lưu trạng thái vào local storage
        } else {
            ledImg.src = 'images/ledOff.png';
            ledButtonOff.classList.add('active');
            ledButtonOn.classList.remove('active');
            saveStateToLocalStorage('led', 'off'); // Lưu trạng thái vào local storage
            }
    } else if (statusData.device_id === 'Fan') {
        const fanButtonOn = document.querySelector('#fan-on');
        const fanButtonOff = document.querySelector('#fan-off');
        const fanImg = document.getElementById('fan');
        if (statusData.status === 'Turned On') {
            fanImg.src = 'images/fanOn.gif';
            fanButtonOn.classList.add('active');
            fanButtonOff.classList.remove('active');
            saveStateToLocalStorage('fan', 'on'); // Lưu trạng thái vào local storage
        } else {
            fanImg.src = 'images/fanOff.png';
            fanButtonOff.classList.add('active');
            fanButtonOn.classList.remove('active');
            saveStateToLocalStorage('fan', 'off'); // Lưu trạng thái vào local storage
        }
    } else if (statusData.device_id === 'Air Conditioner') {
        const acButtonOn = document.querySelector('#ac-on');
        const acButtonOff = document.querySelector('#ac-off');
        const acImg = document.getElementById('ac');
        if (statusData.status === 'Turned On') {
            acImg.src = 'images/acOn.gif';
            acButtonOn.classList.add('active');
            acButtonOff.classList.remove('active');
            saveStateToLocalStorage('ac', 'on'); // Lưu trạng thái vào local storage
        } else {
            acImg.src = 'images/acOff.png';
            acButtonOff.classList.add('active');
            acButtonOn.classList.remove('active');
            saveStateToLocalStorage('ac', 'off'); // Lưu trạng thái vào local storage
        }
    } else if (statusData.device_id === 'Louder Speaker') {
        const lpButtonOn = document.querySelector('#lp-on');
        const lpButtonOff = document.querySelector('#lp-off');
        const lpImg = document.getElementById('lp');
        if (statusData.status === 'Turned On') {
            lpImg.src = 'images/ledOn.png';
            lpButtonOn.classList.add('active');
            lpButtonOff.classList.remove('active');
            saveStateToLocalStorage('lp', 'on'); // Lưu trạng thái vào local storage
        } else {
            lpImg.src = 'images/ledOff.png';
            lpButtonOff.classList.add('active');
            lpButtonOn.classList.remove('active');
            saveStateToLocalStorage('lp', 'off'); // Lưu trạng thái vào local storage
        }
    }
});