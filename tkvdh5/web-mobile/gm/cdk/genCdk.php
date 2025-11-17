<?php
$servername = "localhost";
$username = "root";
$password = "loulxgamecom"; 
$dbname = "cdk";
$gmpwd = "loulxgame";// GM码

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['password']) && isset($_POST['quantity'])) {
    $inputPassword = $_POST['password'];
    $quantity = (int)$_POST['quantity'];

    if ($quantity <= 0) {
        die("无效的CDK数量，请输入一个大于0的数。<a href='your_form_page.php'>返回表单</a>");
    }

    if ($inputPassword !== $gmpwd) {
        die("密码验证失败，无法生成CDK。<a href='log.php'>返回登录页面</a>");
    }

    $existingCdks = [];
    $sql = "SELECT cdk FROM cdk";
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $existingCdks[] = $row['cdk'];
        }
        $result->free();
    }

    $newCdks = [];
    for ($i = 0; $i < $quantity; $i++) {
        do {
            $cdk = generateCdk();
        } while (in_array($cdk, $existingCdks));
        $newCdks[] = $cdk;
        $insertSql = "INSERT INTO cdk (cdk) VALUES (?)";
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("s", $cdk);
        $stmt->execute();
        $stmt->close();
    }

    echo "<!DOCTYPE html>";
    echo "<html lang='zh-CN'>";
    echo "<head>";
    echo "<meta charset='UTF-8'>";
    echo "<title>生成的CDK</title>";
    echo "<style>";
    echo "body { font-family: Arial, sans-serif; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }";
    echo ".cdk-container { text-align: center; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }";
    echo "h2 { color: #333; }";
    echo "ul { list-style-type: none; padding: 0; margin: 0; }";
    echo "li { padding: 8px; color: #555; font-weight: bold; }";
    echo ".copy-button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px; cursor: pointer; }";
    echo ".copy-button:hover { background-color: #218838; }";
    echo "</style>";
    echo "</head>";
    echo "<body>";
    echo "<div class='cdk-container'>";
    echo "<h2>生成的CDK列表:</h2>";
    echo "<ul id='cdk-list'>";
    $cdkListForCopy = '';
    foreach ($newCdks as $cdk) {
    echo "<li>" . htmlspecialchars($cdk) . "</li>";
    $cdkListForCopy .= htmlspecialchars($cdk) . "\n";
}
    echo "</ul>";
    echo "<button class='copy-button' onclick='copyCdksToClipboard()'>全部复制</button>";
    echo "</div>";
    echo "<script>";
    echo "function copyCdksToClipboard() {";
    echo "    var cdkList = document.getElementById('cdk-list');";
    echo "    var range = document.createRange();";
    echo "    range.selectNodeContents(cdkList);";
    echo "    var selection = window.getSelection();";
    echo "    selection.removeAllRanges();";
    echo "    selection.addRange(range);";
    echo "    document.execCommand('copy');";
    echo "    selection.removeAllRanges();";
    echo "    alert('CDK列表已复制到剪贴板');";
    echo "}";
    echo "</script>";
    echo "</body>";
    echo "</html>";
    $conn->close();

} else {
    header("Location: log.php");
    exit();
}
function generateCdk() {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $cdk = '';
    for ($i = 0; $i < 10; $i++) {
        $cdk .= $characters[rand(0, $charactersLength - 1)];
    }
    return $cdk;
}
?>