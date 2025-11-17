<?php



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$userId = $_POST['userid'];
	$servername = "localhost";
	$username = "root";
	$password = "loulxgamecom";
	$dbname = "cdk";
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("连接失败: " . $conn->connect_error);
	}
    
    // 获取请求类型参数
    $requestType = isset($_POST['request_type']) ? $_POST['request_type'] : '';

    // 根据不同的请求类型执行不同的操作
    switch ($requestType) {
        case 'daijin':
            // 发代金
            $code = isset($_POST['code']) ? $_POST['code'] : '';
            $name = isset($_POST['userid']) ? $_POST['userid'] : '';
            daijin($conn,$code,$name);
            break;
        case 'mail':
            // 发送道具邮件
            $code = isset($_POST['code']) ? $_POST['code'] : '';
            $name = isset($_POST['userid']) ? $_POST['userid'] : '';
            senMail($conn,$code,$name);
            break;	
        default:
            $response = ['status' => 'error', 'message' => '未知请求类型'];
            http_response_code(400);
            break;
    }
} else {
    // 如果不是POST请求，返回错误
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}


function daijin($conn,$code,$name) {
		if(queryCdk($conn,$name)){
			$url = 'http://127.0.0.1:1544/gs/pushPlayerReplaceMoneyNum2';
			$result = sendPostRequest($url, $code);
			//判断一下result是否返回{"msg":"success","code":0}
			$response = ['status' => 'success', 'message' => '充值成功！', 'data' => null];
			echo json_encode($response);			
		}else{
			$response = ['status' => 'success', 'error' => '没有权限！', 'data' => null];
			echo json_encode($response);				
		}
}

function senMail($conn,$code,$name) {
	if(queryCdk($conn,$name)){
		
$data = [
    'uuid' => $name,  //角色id
    'token' => '000',
    'version' => '0.1.94',
    'time' => '1737438754',
    'params' => $code  //物品列表  类型，id，数量
];		
		
		$url = 'http://127.0.0.1:3030/mail/add';
		$result = sendPostRequest($url, $data);
		$response = ['status' => 'success', 'message' => '充值成功！', 'data' => null];
		echo json_encode($response);				
	}else {
		$response = ['status' => 'error', 'message' => '没有权限！', 'data' => null];
		echo json_encode($response);	
	}
}


function queryCdk($conn, $userid) {
	$sql = "SELECT * FROM user_cdk WHERE userid = '$userid'";
	$result = $conn->query($sql);
	if ($result === false) {
        die("查询失败: " . $conn->error);
	}
	if ($result->num_rows > 0) {
		return true;
	}else {
		return false;
	}
}


/**
 * 发送POST请求并返回结果
 * 
 * @param string $url 请求的URL
 * @param array $data 请求体数据json格式
 * @return mixed
 */
function sendPostRequest($url, $data) {
	
	// 初始化 cURL 会话
$ch = curl_init($url);

// 设置 cURL 选项
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // 返回响应体
curl_setopt($ch, CURLOPT_POST, true);            // 使用 POST 方法
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); // 设置 POST 数据

// 执行请求并获取响应
$response = curl_exec($ch);

// 关闭 cURL 会话
curl_close($ch);

return $response;
}

function queryUser($userId) {
	$servername = "localhost";
	$username = "root";
	$password = "f3kopfds2232a";
	$dbname = "game_7010544";
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("连接失败: " . $conn->connect_error);
	}
	$sql = "SELECT * FROM player WHERE id = $userId";
	$result = $conn->query($sql);
	if ($result === false) {
		return false;
	}
	if ($result->num_rows > 0) {
		return true;
	}else {
		return false;
	}
	
}

?>