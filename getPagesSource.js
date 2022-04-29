
/**
 * 只把首字母进行大写，其余字字符串不改变之前的大小写样式
 * @param {string} str 
 */
function upperCaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);

}
/**
 * 只把首字母进行小写，其余字字符串不改变之前的大小写样式
 * @param {string} str 
 */
function lowerCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);

}

/// 通过 domcument 拼接相应 字符串
function DOMtoString(document_root) {
    var loadUrl = document.URL;
    if (loadUrl.includes('translate.google.cn') ||
        loadUrl.includes('fanyi.baidu.com')) {
        /// 考虑  's  Guarantor's vehicle information, guarantor's real estate information
        /// 谷歌翻译处理
        /// 待翻译的字符串
        var willTranslateStr = '';
        /// 翻译后的字符串 ,如  Daily trend chart
        var translatedStr = ''
        if (loadUrl.includes('translate.google.cn')) {
            // 谷歌翻译
            let divs = document.getElementsByTagName("div");
            for (let index = 0; index < divs.length; index++) {
                let div = divs[index]
                let lang = div.getAttribute("lang")
                if (lang === "zh-CN" && div.innerText != "...") {
                    willTranslateStr = div.innerText
                    break;
                }
                if (lang === "en") {
                    translatedStr = div.innerText
                    break;
                }
            }
            if (willTranslateStr.length <= 0) {
                let desDiv = document.getElementsByClassName('text-dummy')
                if (desDiv.length > 0) {
                    willTranslateStr = desDiv[0].innerHTML
                } else {
                    willTranslateStr = document.getElementsByClassName('hlJJmd')[0].textContent
                }
            }
            
            if (translatedStr.length <= 0) {
                let desDiv = document.getElementsByClassName('tlid-translation translation')
                if (desDiv.length > 0) {
                    translatedStr = desDiv[0].innerText
                } else {
                    translatedStr = document.getElementsByTagName('span')[87].innerText
                }
            }
        } 
        else if (loadUrl.includes('fanyi.baidu.com')) {
            // 百度翻译
            let willTranslateArr = document.getElementsByClassName("ordinary-output source-output");
            for (let index = 0; index < willTranslateArr.length; index++) {
                let desStr = willTranslateArr[index].innerText;
                if (desStr.length > 0) {
                    willTranslateStr += desStr + '\n';
                }
            }
            let translatedArr = document.getElementsByClassName("ordinary-output target-output clearfix");
            for (let index = 0; index < translatedArr.length; index++) {
                let desStr = translatedArr[index].innerText;
                if (desStr.length > 0) {

                    translatedStr += desStr + '\n';
                }
            }
        }
         

        // return  willTranslateStr + '\n' +  translatedStr;
        // 多个单词 如，Daily trend chart, monthly trend chart
        let willTranslateArray = willTranslateStr.split("\n")
        //translatedArray有道翻译后是这样的         Today,,,Tomorrow,
        // if (translatedStr.includes(",")) {
        // 可能是有道翻译
        // //去除换行 https://www.cnblogs.com/konghou/p/3819029.html
        // translatedStr = translatedStr.replace(/<\/?.+?>/g, "");
        // translatedStr = translatedStr.replace(/[\r\n]/g, "");
        // translatedStr = translatedStr.replace(',', "\n");
        // }
        let translatedArray = translatedStr.split("\n")
        willTranslateArray = willTranslateArray.filter(item => item != '')

        // translatedArray有可能是     day,,Late at night
        translatedArray = translatedArray.filter(item => item != '')
        let dict = {};
        for (let index = 0; index < willTranslateArray.length; index++) {
            const willTranslate = willTranslateArray[index];
            /// 国际化，第一个单词一定要大写
            let translated = upperCaseFirstLetter(translatedArray[index]);
            dict[willTranslate] = translated.replace(',', '');
        }

        return dict
    }
    else if (loadUrl.includes('zentao/bug')) {
        var bugTitle = document.getElementsByClassName('text')[0].innerText
        let strs = bugTitle.split('】')
        if (strs.length > 1) {
            bugTitle = strs[1]
        } else {
            bugTitle = strs[0]
        }
        return 'fix ' + loadUrl + ' ' + bugTitle;
    }
    else if (loadUrl.includes('/merge_requests/new')) {
        /// 提交代码时 ，自动抓提交记录文字
        var msgs = document.getElementsByClassName('commit-row-message');

        var msgStrs = []
        for (i = 0; i < msgs.length; i++) {
            var msgStr = document.getElementsByClassName('commit-row-message')[i].innerText;
            if (msgStr != 'Merge branch \'master\' of ') {
                msgStrs.push(msgStr)
            }
        }
        var des = msgStrs.join('、')
        document.getElementById('merge_request_title').innerText = des;
        document.getElementById('merge_request_description').innerText = des;
        document.getElementById('merge_request_title').value = des;
        document.getElementById('merge_request_description').value = des;
        return ''
    }
    else if (loadUrl.includes('csdn')) {
        // 移除csdn登录二维码
        document.getElementsByClassName('login-mark')[0].remove()
        document.getElementsByClassName('login-box')[0].remove()
    }
    else if (loadUrl.includes('cnblogs.com')) {
        // 把博客园的博客的发布日期放标题上来
        let titleElement = document.getElementById('cb_post_title_url')
        let dateElement = document.getElementById('post-date')
        let title = titleElement.innerText
        titleElement.innerText = title + ' 发布日期：' + dateElement.innerText
    }
    else if (loadUrl.includes('kancloud.cn')) {
        // 看云接口
        let apiStrs = document.getElementsByClassName('article-body kancloud-markdown-body')[0].innerText.split('\n')
        let apiDes = apiStrs[0]
        let apiMethod = apiStrs[1]
        let apiUrl = apiStrs[2]
        if (apiUrl === " 调试") {
            // 没有标题下的接口说明
            apiDes = document.getElementsByClassName('article-head')[0].innerText
            apiMethod = apiStrs[0]
            apiUrl = apiStrs[1]
        }
        // 请示参数
        let paramView = document.getElementsByClassName('ಠapi-body')[0]
        let paramStr = ''
        let paramDesStr = ''
        let paramMethodStr = ''

        if (typeof (paramView) != "undefined") {
            let strs = paramView.innerText.split('	')
            strs.forEach(function (obj, index) {
                if (index % 2 == 0 && obj.length > 0) {
                    // 参数字符串
                    // 移除所有换行 .replace(/[\n]/ig,'')

                    let rightVar = obj.replace('\nstring', '').replace(/[\n]/ig, '')


                    // 尾部 int 如 yidint
                    let lastThreeStr = rightVar.substring(rightVar.length - 3)
                    if (lastThreeStr === 'int') {
                        rightVar = rightVar.replace('int', '')
                        paramMethodStr += rightVar + ':(NSInteger)' + rightVar + '\n'
                        paramStr += 'dict[varNameToStr(' + rightVar + ')] = @(' + rightVar + ');\n'
                        paramDesStr += '\n/// @param ' + rightVar
                    } else {
                        paramMethodStr += rightVar + ':(NSString *)' + rightVar + '\n'
                        paramStr += 'dict[varNameToStr(' + rightVar + ')] = ' + rightVar + ';\n'
                        paramDesStr += '\n/// @param ' + rightVar
                    }

                }
            });
        }
        let dictValue = 'nil'
        if (paramStr.length > 0) {
            paramStr = '\nNSMutableDictionary *dict = [NSMutableDictionary dictionary];\n' + paramStr
            dictValue = 'dict'
        }
        let methodStr = apiMethod === 'GET' ? 'get' : 'post'
        // return `${paramStr}
        // // ${apiDes}
        // [[CKKNetManager manager] ${methodStr}:@"${apiUrl}" params:${dictValue} HUDString:@"加载中..." success:^(id  _Nullable responseObject) {
        //     NSLog(@"---%@---",responseObject);
        // } failure:^(NSString * _Nullable errorString) {
        //     NSLog(@"---%@---",errorString);
        //     [ASHUD showHudTipStr: errorString];
        // }];
        // `
        return `/// ${apiDes}${paramDesStr}
        - (void)createTheOrder${paramMethodStr}
                                success:(requestSuccessBlock)success
                              failure:(requestFailureBlock)failure  {
                                ${paramStr}
            [[CKKNetManager manager] ${methodStr}:@"${apiUrl}" params:${dictValue} HUDString:@"加载中..." success:success failure:failure];
        }
        `
    }
    else {
        // https://www.showdoc.cc/mingmiao?page_id=4089639825709213
        let returnStr = '';

        let des = document.getElementsByClassName('main-editor markdown-body editormd-html-preview')[0].innerText.split('\n')[4]
        returnStr += '/// ' + des + '\n';
        returnStr += '/// 文档地址：' + loadUrl + '\n';
        // 取表格
        let tableStr = document.getElementById("editor-md").getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].innerText;

        ///   /// @param pageNum     否    string    默认1
        let arrStrs = tableStr.split('\n');
        for (let arrStr of arrStrs) {
            returnStr += ' /// @param ' + arrStr + '\n ';
        }

        returnStr += '+ (void)  ';
        for (let arrStr of arrStrs) {
            let strs = arrStr.split('\t');
            let name = strs[0];
            let type = strs[2];
            /// 可空
            let nullStr = strs[1];
            if (nullStr === '否') {
                nullStr = 'nullable ';
            } else if (nullStr === '是') {
                nullStr = 'nonnull ';
            }
            if (type === 'string') {
                type = 'NSString *';
            } else if (type === 'int') {
                type = 'NSUInteger';
                nullStr = '';
            }
            returnStr += name + ':' + '(' + nullStr + type + ')' + name + '   ';
        }
        // success:(nullable successBlock)success failure:(failureBlock)failure;
        returnStr += ' success:(nullable successBlock)success failure:(failureBlock)failure {';

        let inUrls = document.getElementsByClassName('main-editor markdown-body editormd-html-preview')[0].innerText.split('\n')[8]

        // "http://dev.jingletong.com/api/user/address"
        returnStr += '\n\nNSString * urlStr = @\"' + inUrls.split('.com/')[1] + '\";\n';
        /**
         * NSMutableDictionary *muDict = @{}.mutableCopy;
         *   [muDict safeAddKey:@"recordId" value:recordId];
         */
        let canEmptyArr = [];
        let noEmptyArr = [];
        for (let arrStr of arrStrs) {
            let strs = arrStr.split('\t');
            let canEmpty = strs[1];
            if (canEmpty === '否') {
                canEmptyArr.push(arrStr);
            } else {
                noEmptyArr.push(arrStr);
            }
        }
        returnStr += 'NSMutableDictionary *muDict = @{}.mutableCopy;\n';
        for (let canEmptyStr of canEmptyArr) {
            let strs = canEmptyStr.split('\t');
            let name = strs[0];
            returnStr += '[muDict safeAddKey:@"' + name + '" value:' + name + '];\n';
        }



        /*
       addressName	否	string	收货地址别名
        prov	是	string	省
        city	是	string	市
        area	是	string	区 /县
        street	否	string	街道
        detail	是	string	详细地址
        contactName	是	string	联系人名称
        contactPhone	是	string	联系人电话
       */
        /* NSDictionary *dict = @{@"pageNum": @(MAX(1, pageNum)).stringValue,
                              @"pageSize": @(MAX(1, pageSize)).stringValue};
                              */

        returnStr += '\nNSDictionary *dict = @{\n';

        for (let index = 0; index < noEmptyArr.length; index++) {
            const arrStr = noEmptyArr[index];
            let strs = arrStr.split('\t');
            let name = strs[0];
            if (index == noEmptyArr.length - 1) {
                returnStr += '@\"' + name + '\": ' + name + '};\n\n\n';
            } else {
                returnStr += '@\"' + name + '\": ' + name + ',\n';
            }

        }
        //        [muDict addEntriesFromDictionary:dict];
        returnStr += '[muDict addEntriesFromDictionary:dict];\n';
        let methodStr = document.getElementsByClassName('main-editor markdown-body editormd-html-preview')[0].innerText.split('\n')[12]
        if (methodStr === 'POST') {
            returnStr += '[self requestUrlStr:urlStr dict:muDict method:MARequestMethodPOST success:success failure:failure];\n}'
        } else {
            returnStr += '[self requestUrlStr:urlStr dict:muDict method:MARequestMethodGET success:success failure:failure];\n}'
        }

        return returnStr;


    }
    /// 根据网页抓取property
    return "未处理的url";
}

// 注入脚本时，自动发送消息getSource，调用DOMtoString方法给返回值
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
