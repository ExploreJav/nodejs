const fs = require('fs');
const http = require('https');
const cheerio = require('cheerio');
const request = require('request');

function getImage(url) {
    http.get(url, (res) => {
        let {
            statusCode
        } = res;
        let header = res.headers['content-type'];
        let error = null;
        if (statusCode !== 200) {
            error = new Error(`状态码是：${statusCode}`);
        }
        if (!/^text\/html/.test(header)) {
            error = new Error(`获取到的文件格式类型不对${header}`);
        }
        if (error) {
            res.resume();
            console.log(error);
            return;
        }
        let data = null;
        res.on('data', (chunk) => {
            data += chunk;
        })
        res.on('end', () => {
            //用来读取html
            const $ = cheerio.load(data);
            $('img').each((index, item) => {
                let url = $(item).attr('src');

                downImage(url);
            })

            fs.writeFile('./baidu.html', data, () => {
                console.log('写入文件完毕');
            })
        })
    }).on('error', (err) => {
        console.log("出错了" + err);
    })
}
getImage('https://www.sina.com.cn/')

function downImage(strPath) {
    if (!(strPath.endsWith('jpg') || strPath.endsWith('png'))) {
        return;
    }
    if (!strPath.startsWith('http')) {
        strPath = "https:" + strPath
    }
    let arr = strPath.split('/');
    let fileName = arr[arr.length - 1];
    let savePath = "./image/" + fileName;
    // console.log(strPath);
    // request(strPath).pipe(fs.createReadStream(savePath))
    http.get(strPath, function (res) {
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        let {
            statusCode
        } = res;
        let error = null;
        if (statusCode !== 200) {
            error = new Error(`状态码是：${statusCode}`);
        }
        // if (!/^text\/html/.test(header)) {
        //     error = new Error(`获取到的文件格式类型不对${header}`);
        // }
        var imgData = "";

        res.on("data", function (chunk) {
            imgData += chunk;
        });

        res.on("end", function () {
            fs.writeFile(savePath, imgData, "binary", function (err) {
                if (err) {
                    console.log(err)
                }
            });
        });
    });

}

function aaa() {
    http.get("https://src.leju.com/imp/imp/deal/21/73/4/b9c2fca46bcd7416c69b892b108_p24_mk24.jpg", function (req, res) { //path为网络图片地址
        var imgData = '';
        req.setEncoding('binary');
        req.on('data', function (chunk) {
            imgData += chunk
        })
        req.on('end', function () {
            fs.writeFile('./image/aaa.png', imgData, 'binary', function (err) { //path为本地路径例如public/logo.png
                if (err) {
                    console.log('保存出错！')
                } else {
                    console.log('保存成功!')
                }
            })
        })
    })
}