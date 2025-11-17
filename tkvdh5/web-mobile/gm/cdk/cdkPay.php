<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	//每人一次的兑换码在这里设置
	$map = array(
		'vip666' => 6666666,
		'vip123' => 66666666,
		'vip888' => 8888888,
		'vip999' => 9999999,
		'vip555' => "388=500;389=500;390=500;391=500;383=500;384=500;371=500;372=500;373=500;380=500;381=500;382=500;293=500;294=500;295=500;331=500;332=500;333=500;416=500;417=500;418=500;419=500;420=500;421=500;425=500;426=500;427=500;428=500;429=500;433=500;434=500;435=500;436=500;437=500;442=500;443=500;444=500;445=500;449=500;450=500;451=500;452=500;453=500;457=500;458=500;459=500;460=500;461=500;465=500;466=500;467=500;468=500;469=500;473=500;474=500;475=500;476=500;477=500;481=500;482=500;483=500;484=500;485=500;53=10",
		'vip444' => 9999999,
		'vip333' => "130101=1;130102=1;130103=1;130201=1;130202=1;130203=1;130301=1;130302=1;130303=1;130401=1;130402=1;130403=1;130501=1;130502=1;130503=1;130601=1;130602=1;130603=1",
		'vip222' => "416=100;417=100;418=100;419=100;420=100;421=100;425=100;426=100;427=100;428=100;429=100;433=100;434=100;435=100;436=100;437=100;442=100;443=100;444=100;445=100;449=100;450=100;451=100;452=100;453=100;457=100;458=100;459=100;460=100;461=100;465=100;466=100;467=100;468=100;469=100;473=100;474=100;475=100;476=100;477=100;481=100;482=100;483=100;484=100;485=100",
		'vip111' => "3501=100;3502=100;3503=100;3504=100;3505=100;3507=100;3508=100;3509=100;3510=100;3511=100;3513=100;3514=100;3515=100;3516=100;3517=100;3519=100;3520=100;3521=100;3522=100;3523=100;3525=100;3526=100;3527=100;3528=100;3529=100;3531=100;3532=100;3533=100;3534=100;3535=100;3537=100;3538=100;3539=100;3540=100;3541=100;3542=100;3543=100;3544=100;3545=100;3546=100;1501=1;1502=1;1503=1;1504=1;1505=1;1506=1;1507=1;1508=1;1509=1;1510=1;1511=1;1512=1;1513=1;1514=1;1515=1;1516=1;1517=1;1518=1;1519=1;1520=1;1521=1;1522=1;1523=1;1524=1;1525=1;1526=1;1527=1;1528=1;1529=1;1530=1;1531=1;1532=1;1533=1;1534=1;1535=1;1536=1;1537=1;1538=1;1539=1;1540=1;1541=1;1542=1;1543=1;1544=1;1545=1;1546=1;1547=1;1548=1;1549=1;1550=1;1551=1;1552=1;1553=1;1554=1;1555=1;1556=1;1557=1;1558=1;1559=1;1560=1;1561=1;1562=1;1563=1;1564=1;1565=1;1566=1;1567=1;1568=1;1569=1;1570=1;1571=1;1572=1;1573=1;1574=1;1575=1;1576=1;1577=1;1578=1;1579=1;1580=1;1581=1;1582=1;1583=1;1584=1;1585=1;1586=1;1587=1;1588=1;1589=1;1590=1;1591=1;1592=1;1593=1;1594=1;1595=1;1596=1;1597=1;1598=1;1599=1;1600=1;1601=1;1602=1;1603=1;1604=1;1605=1;1606=1;1607=1;1608=1;1609=1;1610=1;1611=1;1612=1;1613=1;1614=1;1615=1;1616=1;1617=1;1618=1;1619=1;1620=1;1621=1;1622=1;1623=1;1624=1;1625=1;1626=1;1627=1;1628=1;1629=1;1630=1;1631=1;1632=1;1633=1;1634=1;1635=1;1636=1;1637=1;1638=1;1639=1;1640=1;1641=1;1642=1;1643=1;1644=1;1645=1;1646=1;1647=1;1648=1;1649=1;1650=1;1651=1;1652=1;1653=1;1654=1;1655=1;1656=1;1657=1;1658=1;1659=1;1701=1;1702=1;1703=1;1704=1;1705=1;1706=1;1707=1;1708=1;1709=1;1710=1;1711=1;1712=1;1713=1;1714=1;1715=1;1716=1;1717=1;1718=1;1719=1;1720=1;1721=1;1722=1;1723=1;1724=1;1725=1;1726=1;1727=1;1728=1;1729=1;1730=1;1731=1;1732=1;1733=1;1734=1;1735=1;1736=1;1737=1;1738=1;1739=1;1740=1;1741=1;1742=1;1743=1;1744=1;1745=1;1746=1;1747=1;1748=1;1749=1;1750=1;1751=1;1752=1"
	);
	
	$userId = $_POST['userId'];
	$cdk = $_POST['cdk'];
	$servername = "localhost";
	$username = "root";
	$password = "loulxgamecom";
	$dbname = "cdk";
	#if (!queryUser($userId)) {
	#	echo "用户id不存在，请确认！";
	#	exit;
	#}
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("连接失败: " . $conn->connect_error);
	}

	if (array_key_exists($cdk, $map)) {
		$code = $map[$cdk];

		if(getCdk($conn, $cdk, $userId)){
			if(updateCdk($conn, $cdk, $userId)){
				if($cdk == "vip111" || $cdk == "vip222" || $cdk == "vip333" || $cdk == "vip555"){
					cdkPay($conn, "超级大礼包", $code, $userId);
					exit;
				}
				tongbaoPay($conn, $code, $userId);
			}			
		}else {
			echo "已使用过此cdk！！！";			
		}
		exit;
	}

	$arr = queryCdk($conn, $cdk);
	if ($arr) {
		$boo = deleteCdk($conn, $cdk);
		if($boo) {
			cdkPay1($conn,$userId,$cdk);				
		}		
	}else {
		echo "cdk无效！！！";
	}
}

function updateCdk($conn, $code, $userId) {
	$sql = "INSERT INTO cdk1 (userid, code) VALUES (?, ?)";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param("ss", $userId, $code);
	$result = $stmt->execute();

	if ($result === false) {
		die("查询失败: " . $conn->error);
	}
	$affected_rows = $stmt->affected_rows;

	if ($affected_rows > 0) {
		return true;
	} else {
		die("Đổi thưởng không thành công, vui lòng liên hệ với người quản lý!");
	}
}

function queryCdk($conn, $cdk) {
	$sql = "SELECT * FROM cdk WHERE cdk = '$cdk'";
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

function getCdk($conn, $code, $userId){
	$sql = "SELECT * FROM cdk1 WHERE userid = ? AND code = ?";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param("ss", $userId, $code);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {
		return false; 
	} else {
		return true; 
	}
}

function deleteCdk($conn, $cdk) {
	$sql = "DELETE FROM cdk WHERE cdk = '$cdk'";
	$result = $conn->query($sql);

	if ($result === false) {
		die("查询失败: " . $conn->error);
	}
	$affected_rows = $conn->affected_rows;

	if ($affected_rows > 0) {
		return true;
	} else {
		die("兑换失败，联系管理员！111");
	}
}

function tongbaoPay($conn, $info, $userId) {
	
	$num = intval($info);
	$data = array(
		"playerId" => $userId,
		"num" => strval($num),
		"type" => 0
	);
	$jsonData = json_encode($data);
	
	$url = "http://127.0.0.1:1544/gs/pushPlayerReplaceMoneyNum2";
	$result = sendPostRequest($url, $jsonData);
	if('{"msg":"success","code":0}' == $result){
			echo "Việc trao đổi đã thành công, vui lòng kiểm tra!";
	}else {
		echo "Đổi thưởng không thành công, mã đổi thưởng đã bị trừ, vui lòng liên hệ với quản trị viên để được bù tiền!";
	}	
}


function cdkPay($conn, $name, $info, $userId) {

	$pairs = explode(';', $info);
	$items = array();
	foreach ($pairs as $pair) {
		if (strpos($pair, '=') !== false) {
			list($key, $value) = explode('=', $pair);
			$items[] = array(
				"id" => intval($key),
				"num" => $value
			);
		}
	}
	$data = array(
		"user_id" => array($userId),
		"title" => "CDK兑换",
		"content" => "CDK兑换成功，请查收！",
		"exTime" => 1440,
		"packge" => $items,
		"groupId" => 100
	);
	$jsonData = json_encode($data);
	$url = "http://127.0.0.1:1544/gs/sendMail";
	$result = sendPostRequest($url, $jsonData);
	if('{"msg":"success","code":0}' == $result){
			echo "兑换" . $name . "成功，请查收！";
	}else {
		echo "Đổi thưởng không thành công, mã đổi thưởng đã bị trừ, vui lòng liên hệ với quản trị viên để được bù tiền!";
	}
}

function cdkPay1($conn,$userId,$cdk) {
	$sql = "INSERT INTO user_cdk (userid, cdk) VALUES (?, ?)";
	$stmt = $conn->prepare($sql);

	$stmt->bind_param("ss", $userId, $cdk);

	$result = $stmt->execute();

	if ($result === false) {
		die("查询失败: " . $conn->error);
	}

	$affected_rows = $stmt->affected_rows;

	if ($affected_rows > 0) {
		echo "Quyền truy cập ở phần phụ trợ đã được mở thành công! ! !";
	} else {
		die("兑换失败，联系管理员！22");
	}
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

function sendPostRequest($url, $jsonData) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($jsonData)
    ]);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}