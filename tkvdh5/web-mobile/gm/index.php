<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GM Tiên Kiếm H5 LouLx Game</title>
    <!-- 引入样式 -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }
        .form-group label {
            margin-bottom: 5px;
        }
        .form-group select,
        .form-group input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            width: 100%;
        }
        .form-group button {
            padding: 10px 20px;
            background-color: #5cb85c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .item-row:last-child {
            border-bottom: none;
        }
        .item-row button {
            padding: 5px 10px;
            background-color: #d9534f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="container">
            <div class="navbar">
                <h1>GM Tiên Kiếm H5</h1>
                <!-- 搜索功能 -->
                <div class="form-group">
                </div>
            </div>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="userId">ID Nhân Vật</label>
                    <input type="text" v-model="rechargeForm.userId" id="userId" placeholder="Nhập ID nhân vật, dạng 1000..">
                </div>
                <div class="form-group">
                    <label for="currency">Tìm Kiếm</label>
                    <input type="text" v-model="searchQuery" placeholder="Tìm kiếm...">
                    <select v-model="rechargeForm.currency" id="currency">
                        <option value="">Chọn vật phẩm...</option>
                        <option v-for="currency in filteredCurrencies" :key="currency.id" :value="currency.id">
                            {{ currency.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantity">Số Lượng</label>
                    <input type="number" v-model.number="rechargeForm.quantity" id="quantity" min="1" :max="maxQuantity" placeholder="Nhập số lượng">
                </div>
                <div>
                    <div v-for="(item, index) in rechargeForm.items" :key="index" class="item-row">
                        <span>{{ item.name }} (ID vật phẩm: {{ item.id }})</span>
                        <button type="button" @click="removeRechargeItem(index)">Xóa</button>
                    </div>
                </div>
                <div class="form-group">
                    <button type="button" @click="addRechargeItem">Thêm Vật Phẩm</button>
                    <button type="submit">Gửi</button>
                </div>
            </form>
        </div>
    </div>
    <!-- 引入 Vue -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
    <!-- 引入 Element UI -->
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        new Vue({
            el: '#app',
            data() {
                return {
                    rechargeForm: {
                        userId: '',
                        currency: '',
                        quantity: null,
                        items: []
                    },
                    searchQuery: '',
                    currencies: [],
                    lastSendTime: 0,
                    maxQuantity: 9999  //设置最大数量限制
                };
            },
            computed: {
                filteredCurrencies() {
                    if (!this.searchQuery) return this.currencies;
                    return this.currencies.filter(currency => {
                        return currency.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                    });
                }
            },
            methods: {
                addRechargeItem() {
                    if (!this.rechargeForm.currency || this.rechargeForm.quantity < 1 || this.rechargeForm.quantity > this.maxQuantity) {
                        this.$message.error('Vui lòng chọn sản phẩm và điền số lượng hợp lệ (1-' + this.maxQuantity + '）');
                        return;
                    }
                    const newItem = {
                        id: this.rechargeForm.currency,
                        num: this.rechargeForm.quantity + '',
                        name: this.getCurrencyNameById(this.rechargeForm.currency)
                    };
                    this.rechargeForm.items.push(newItem);
                    this.rechargeForm.currency = '';
                    this.rechargeForm.quantity = null;
                },
                removeRechargeItem(index) {
                    this.rechargeForm.items.splice(index, 1);
                },
                submitForm() {
                    const that = this;
                    if (!this.rechargeForm.userId) {
                        this.$message.error('Vui lòng nhập ID nhân vật của bạn');
                        return;
                    }
                    if (this.rechargeForm.items.length < 1) {
                        this.$message.error('Vui lòng thêm vật phẩm trước');
                        return;
                    }
                    const now = Date.now();
                    if (now - this.lastSendTime < 5000) {
                        this.$message.error('Vui lòng đợi 5 giây trước khi gửi');
                        return;
                    }
                    this.lastSendTime = now;

                    const result = this.rechargeForm.items.map(item => ([1, Number(item.id), Number(item.num)]));
                    const obj = {
                        code: JSON.stringify(result),
                        request_type: "mail",
                        userid: this.rechargeForm.userId
                    };

                    const queryString = Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

                    axios.post('gmPay.php', queryString, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(response => {
                        const data = response.data;
                        if (data.status === "success") {
                            that.$message.success(data.message);
                        } else {
                            that.$message.error(data.message);
                        }
                    })
                    .catch(error => {
                        console.error("请求出错", error);
                        that.$message.error("请求出错");
                    });

                    console.log(queryString);
                },
                getCurrencyNameById(id) {
                    const currency = this.currencies.find(c => c.id === id);
                    return currency ? currency.name : '';
                },
                loadAndProcessFile() {
                    const filePath = 'itemMoney.json';
                    fetch(filePath)
                    .then(response => response.text())
                    .then(text => {
                        var data1 = JSON.parse(text);
                        const result = data1.map(item => ({
                            id: item.id,
                            name: item.name,
                            type: 1
                        }));
                        this.currencies = result;
                    })
                    .catch(error => console.error('Error loading the file:', error));
                }
            },
            mounted() {
                this.loadAndProcessFile();
            }
        });
    </script>
</body>
</html>