import yaml

# Nội dung bạn muốn ghi vào file YAML
mysql_config = {
    'version': '3.8',
    'services': {
        'db-mysql': {  # Chỉ định tên service là "mysql"
            'image': 'mysql:5.7.40',
            'restart': 'always',
            'environment': [
                'MYSQL_DATABASE=iot',
                'MYSQL_ROOT_PASSWORD=123456'
            ],
            'ports': [
                "3307:3306"
            ]
        }
    }
}

# Tạo file mysql.yml và ghi nội dung vào
with open('mysql.yml', 'w') as file:
    yaml.dump(mysql_config, file, default_flow_style=False)

print("File mysql.yml đã được tạo thành công!")
