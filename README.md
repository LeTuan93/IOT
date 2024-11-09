Hướng dẫn sử dụng
Để sử dụng và hiểu dự án này bạn cần:
1. Xem chuỗi video về node.js tại  https://www.youtube.com/watch?v=jR-n-cQnpNI&list=PLncHg6Kn2JT4smWdJceM0bDg4YUF3yqLu (Khoảng 32-35 vid đầu tiên)
2. Tiếp theo bạn cần tìm hiểu về cách lắp phần cứng tại 
https://www.youtube.com/watch?v=xTqCU1iW2AQ&t=9s
https://www.youtube.com/watch?v=JA1cYRDVpQM&t=495s
https://www.youtube.com/watch?v=wB785GJUd6s&t=122s
https://www.youtube.com/watch?v=4SAcDS2ZBTM&t=127s
3. Học mosquitto bao gồm cài đặt, cấu hình , tạo tài khoản, kết nối pub sub tại https://cedalo.com/blog/how-to-install-mosquitto-mqtt-broker-on-windows/ (chú ý để chạy được cấu hình cài đặt chạy mosquitto -v -c mosquitto.conf tại /Program Files/mosquitto)
4. Clone project về 
4.1 Bước 1: Clone project về từ github, cd vào thư mục iot, chạy npm i.
4.2 Bước 2: Tải Dbeaver và Docker như trong chuỗi video tại node.js (vid 27 và 29)
Bước 3: Trong Deabver sử dụng các câu lệnh sau đẻ tạo bảng (lý do tạo vì trong code của project sử dụng 2 bảng này)
CREATE TABLE Actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    humidity FLOAT,
    temperature FLOAT,
    light FLOAT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Bước 4: Trong file mosquitto.conf cấu hình
listener 1993 172.20.10.3
password_file passwd
allow_anonymous false
listener 9001
protocol websockets
Với ip 172.20.10.3 thay đổi bằng ip của wifi bạn, cổng có thể thay đổi tùy thích,file passwd là file chứa tài khoản mật khẩu mà bạn đã tạo ở bước 3, ngoài ra ở đây tôi sử dụng 2 cổng 1993 và 9001, nó sẽ liên quan tới
việc config trong các file service, mqttClient và mqttServer.
Bước 5: Đọc hiểu file Requirement_Adding , đây là file chứa các tính năng thêm của project
ví dụ 1, abc : 2 ,3 ,4->5 (comment 9-11) nghĩa là tải file abc, mở comment 2,3,4->5 và comment lại các dòng từ 9-11
Oke tại project bạn tải về có một số tính năng tôi đã mở, nghĩa là bạn phải làm ngược lại điều trên thì mới có thể trả về web ban đầu (bạn cần làm điều này bởi hiện tại trong code đang có thêm chỉ số Dash và trong cơ s
sở dữ liệu không có, nên khi chạy bạn sẽ không lưu được vào cơ sở dữ liệu)
Lưu ý: trong project có file yaml.xml bạn có thể sử dụng file đó cho vid 29 
Bước 6: Oke đảm bảo bạn đã đọc cáo báo trong project clone về tại thư mục Report và file mqttServer => điều này giúp bạn cần phải mua những phần cứng nào và đảm bảo bạn đã lắp được phần cứng như trong code mqttServer.ino mô tả
Bước 7: Chạy npm start để bắt đầu, chạy mosquitto -v -c mosquitto.conf trong terminal để start mosquitto, nạp code vào phần cứng và chạy thế là done.
