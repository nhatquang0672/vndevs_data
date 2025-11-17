
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tạo Mã CDK</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="login-container">
        <h2>Tạo Mã CDK</h2>
        <form action="genCdk.php" method="post">
            <div class="form-group">
                <label for="password">Mã GM: loulxgame</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <label for="quantity">Số lượng</label>
                <input type="number" id="quantity" name="quantity" min="1" value="100" required>
            </div>
            <button type="submit" class="submit-btn">Tạo CDK</button>
        </form>
    </div>
</body>
</html>