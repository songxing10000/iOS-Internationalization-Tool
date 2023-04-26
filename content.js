// 监听来自 popup.html 的请求消息，将输入和输出值发送回去
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  if (message.action === 'GET_VALUE') {

    let host = window.location.host.split('.')[1]
    let source, target
    switch (host) {
      case 'baidu':
        source = document.getElementsByClassName('source-output')
        target = document.getElementsByClassName('target-output')
        break;
      case 'youdao':
        if (document.getElementById('js_fanyi_input').getElementsByClassName('src').length > 0) {
          source = document.getElementById('js_fanyi_input').getElementsByClassName('src')
        } else {
          source = document.getElementById('js_fanyi_input').innerText.split('\n').map(item => {
            let el = document.createElement('div')
            el.textContent = item
            return el
          })
        }
        target = document.getElementById('js_fanyi_output_resultOutput').getElementsByTagName('span')
        break;
      default:
        break;
    }

    const getDomToArr = (elementArr) => {
      
      return [...elementArr].map(element =>{
        return element.textContent;
      }).filter(textContent => textContent != "\n")
    }

    sendResponse({
      input: getDomToArr(source),
      output: getDomToArr(target),
    });
  }
});
