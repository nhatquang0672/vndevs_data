<?php

$servername = "localhost";
$username = "root";
$password = "loulxgamecom";
$dbname = "cdk";
$num = 100; // 需要生成的CDK数量

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

$existingCdks = [];
$sql = "SELECT cdk FROM cdk";
$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $existingCdks[] = $row['cdk'];
    }
}

for ($i = 0; $i < $num; $i++) {
    do {
        $cdk = generateCdk();
    } while (in_array($cdk, $existingCdks));
    
    $existingCdks[] = $cdk;

    $insertSql = "INSERT INTO cdk (cdk) VALUES (?)";
    $stmt = $conn->prepare($insertSql);
    $stmt->bind_param("s", $cdk);
    $stmt->execute();
    $stmt->close();
}

file_put_contents('cdks.txt', implode("\n", $existingCdks));

$conn->close();

function generateCdk() {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $cdk = '';
    for ($i = 0; $i < 10; $i++) {
        $cdk .= $characters[rand(0, $charactersLength - 1)];
    }
    return $cdk;
}

echo "共" . $num . "个CDK成功生成并插入数据库，且已保存到服务器的cdks.txt文件中";
?>