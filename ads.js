const axios = require('axios');
const puppeteer = require('puppeteer-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');


async function changeBrowser() {
  const url = "http://local.adspower.com:50325/api/v1/user/update";  // 请将URL替换为实际的API端点

  // 设置请求头
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"  // 如果需要身份验证，请提供访问令牌或其他凭据
  };

  // 构建请求体
  const payload = {
    "user_id": "jdsual8",  // 用户ID
    "ignore_cookie_error": 0,  // 校验Cookie错误处理方式
    "remark": "这是一条说明",  // 账号说明信息
  };

  try {
    // 发送HTTP POST请求
    const response = await axios.post(url, payload, { headers });

    // 解析响应
    if (response.status === 200) {
      console.log("账号信息已成功更新");
    } else {
      console.log(`请求失败，状态码：${response.status}`);
      console.log("响应内容：");
      console.log(response.data);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

const textFile = path.join(__dirname, 'D://U2U.txt');

async function openBrowser(address) {

  axios.get('http://local.adspower.net:50325/api/v1/browser/start?user_id=jdsual8').then(async (res) => {
    console.log(res.data);
    if(res.data.code === 0 && res.data.data.ws && res.data.data.ws.puppeteer) {
      try{
        const browser = await puppeteer.connect(
          {browserWSEndpoint: res.data.data.ws.puppeteer, defaultViewport:null});
          const page = await browser.newPage();
          await page.goto('https://faucet.uniultra.xyz/');
          const inputElement = await page.$('input.home__form-input');
          await inputElement.click();
          await inputElement.type(address);

          await page.waitForTimeout(65000); // 等待 65 秒
         
          const buttonElement = await page.$('.el-button.home__form-btn');
          await buttonElement.click();
          
          await page.waitForTimeout(5000 + Math.random() * 10000); // 等待 5-15 秒

          await browser.close();

      } catch(err){
          console.log(err.message);
      }
    }
  }).catch((err) => {
    console.log(err)
  })
}

async function main() {
  let count = 0;

  while (true) {
    try {
      if (count % 3 === 0) {
        // 调用打开浏览器函数
        await changeBrowser();
      }
      const addresses = fs.readFileSync(textFile, 'utf8').split('\n');

      for (const address of addresses) {
        console.log(address.trim());
        await openBrowser(address.trim());
      }
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    } finally {
      count++;
    }
  }
}

// 调用主函数
main();