

chrome.tabs.query(
  { active: true, currentWindow: true },
  res1 => {
    chrome.tabs.sendMessage(res1[0].id, { action: 'GET_VALUE' }, res2 => {

      let str = '';
      for (let index = 0; index < res2.input.length; index++) {
        const input = res2.input[index];
        const output = res2.output[index];
        /*
        "生日"="Birthday";
        "今天"="Today";
        */
        str += `"${trimStr(input)}" = "${trimStr(output)}";\n`
      }
      document.getElementById('message').innerText =  str;

    });
  }
);
/// 去除传入字符串的首尾的空格
function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}



// 复制代码事件
document.getElementById('copyCode').addEventListener('click', function () {

  let codeStr = document.getElementById('message').innerText;
  copyStr(codeStr)

});
/// 复制字符串到粘贴板
function copyStr(str) {
  // 复制字符串到粘贴板 http://www.voidcn.com/article/p-effxpdwn-buc.html
  var input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = str;
  input.focus();
  input.select();
  document.execCommand('Copy');
  input.remove();
}
