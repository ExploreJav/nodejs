const http = require('https');
// console.log(http)
const fs = require('fs');
const cheerio = require('cheerio')
const htmlparser2 = require('htmlparser2');
const request = require('request');
function downLoadImage(url){
    let arr = url.split('/');
    let imagePath = arr[arr.length-1];
    if(!url.startsWith('http')){
        url = "https:"+url;
    }
    http.get(url, function(res){
        console.log(url);
        var imgData = "";
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function(chunk){
            imgData+=chunk;
        });
        res.on("end", function(){
            fs.writeFile("./image/"+imagePath, imgData, "binary", function(err){
                if(err){
                    console.log("down fail");
                }
                console.log("down success");
            });
        });
    });
}
function getUrls(){
    let urls=[];
    http.get('https://tieba.baidu.com/index.html', res => {
    const {
        statusCode
    } = res;
    const contentType = res.headers['content-type'];
    let err = null;
    if (statusCode == !200) {
        error = new Error('请求失败\n' +
            `状态码: ${statusCode}`);
    }
    if(!/^text\/html/.test(contentType)){
        error = new Error('无效的 content-type.\n' +
        `期望的是text\/html但接收到的是 ${contentType}`);
    }
    if(err){
        console.error(error.message);
        // 响应数据来释放内存。
        res.resume();
        return;
    }
    let data = null;
    res.on('data',(chunk)=>{
        data += chunk.toString();
    })
    res.on('end',()=>{
        const dom = htmlparser2.parseDOM(data);
        const $ = cheerio.load(dom);
       $('img').each((index,el)=>{
            let url = $(el).attr('src');
            console.log(url);
            if(url.endsWith('png')){
                console.log("===================");
                downLoadImage(url);
            }

       })
        fs.writeFile('./baidu.html',data,()=>{
            console.log('数据下载完成')
        })
    })
}).on('error', () => {
    console.log('出错了')
})

}
getUrls();
