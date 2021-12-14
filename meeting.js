function log(msg) {
    let timestamp = new Date(new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ")
    console.log(timestamp + " : " + msg)
}

//获取明天时间 yyyy-mm-dd
function getTomorrow() {
    //昨天的时间
    let nowDate = new Date();
    nowDate.setDate(nowDate.getDate() + 1);
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
        .getDate();
    let dateStr = year + "-" + month + "-" + day;
    return dateStr;
}

function convertDateFromString(dateString) {
    dateString = dateString.replace(/-/g, '/')
    return new Date(dateString)
}

function sendCreateMeeting(body) {
    const url = `https://jmrs.jd.com/meetingOrder/create`;
    const method = `POST`;
    const headers = {
        'Accept-Encoding': `gzip, deflate, br`,
        'Host': `jmrs.jd.com`,
        'jms-tenant-code': `CN.JD.GROUP`,
        'Origin': `https://jmrs.jd.com`,
        'jms-real-name': `%E5%BC%A0%E6%96%87%E9%A2%86`,
        'jms-entry-type': `me`,
        'Connection': `keep-alive`,
        'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
        'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Language/zh-Hans JDME/6.16.2 DeviceId/0C017FE1-DB8B-4D08-9F8A-2EB6B12E2166 Mobile/15E148JDME`,
        'Content-Type': `application/json;charset=UTF-8`,
        'Content-Language': `en`,
        'Referer': `https://jmrs.jd.com/saas/me?userName=zhangwenling5&theme=null&language=zh_CN&timestamp=1638858088543`,
        'jms-email': `zhangwenling1%40jd.com`,
        'Access-Control-Allow-Origin': `*`,
        'jms-user-name': `zhangwenling5`,
        'Accept': `application/json, text/plain, */*`,
        'jms-backup-cookie': `NUoyRkhycTg1dUVkdHFoamZRRFF3c2ZvVEpXTjN6Nmo5UUEzbldsRGRLS05xQ2pTaEl4VDJnPT07IGJhc2ljX2luZm89aU9TfHw2LjE2LjI7IHJlaW1iRnJvbVJOPTE7IHRoaXJkX2xhbmd1YWdlPXpoX0NOOyB0aGlyZF9uYW1lPXpoYW5nd2VubGluZzU7IHRoaXJkX3NhZmV0eVRva2VuPTQ1YjYwOTg4MzU0ZjAxMDBhMTAxOGEwYzJhMTEyOWU4ZTc5NTA4OyB0aGlyZF90ZW5hbnRDb2RlPUNOLkpELkdST1VQOyB0aGlyZF90ZW5hbnRDb2RlTGlzdD1beyJ0ZW5hbnRDb2RlIjoiQ04uSkQuR1JPVVAifV07IHRoaXJkX3RpbWVzdGFtcD0xNjM4ODU4MDg4NTQzOyB0aGlyZF90b2tlbj02MmFlYzYxODNmMTEwNjk2MTg1Njk1NWRjOTY4ZmUwYWU5NmRmMzsgUlQ9Ino9MSZkbT1qZC5jb20mc2k9aGI4YXdvZDE1Nmcmc3M9a3d2cDd3bnAmc2w9OSZ0dD00OGkmbGQ9a25rciZudT1kNDFkOGNkOThmMDBiMjA0ZTk4MDA5OThlY2Y4NDI3ZSZjbD1sZmc4IjsgNUoyRkhycTg1dUVkdHFoamZRRFF3c2ZvVEpXTjN6Nmo5UUEzbldsRGRLS05xQ2pTaEl4VDJnPT09OyBiYXNpY19pbmZvPWlPU3x8Ni4xNi4yOyByZWltYkZyb21STj0xOyB0aGlyZF9sYW5ndWFnZT16aF9DTjsgdGhpcmRfbmFtZT16aGFuZ3dlbmxpbmc1OyB0aGlyZF9zYWZldHlUb2tlbj00NWI2MDk4ODM1NGYwMTAwYTEwMThhMGMyYTExMjllOGU3OTUwODsgdGhpcmRfdGVuYW50Q29kZT1DTi5KRC5HUk9VUDsgdGhpcmRfdGVuYW50Q29kZUxpc3Q9W3sidGVuYW50Q29kZSI6IkNOLkpELkdST1VQIn1dOyB0aGlyZF90aW1lc3RhbXA9MTYzODg1ODA4ODU0MzsgdGhpcmRfdG9rZW49NjJhZWM2MTgzZjExMDY5NjE4NTY5NTVkYzk2OGZlMGFlOTZkZjM7IG1iYV9tdWlkPTE2MzcwMzI5MDY0NTExODY5Mjg0ODEzOyBfX2pkYT0xNjExMzE0OTEuMTYzNzAzMjkwNjQ1MTE4NjkyODQ4MTMuMTYzNzAzMjkwNi4xNjM4NDM5MjM2LjE2Mzg3ODkzNjIuMTE7IHB3ZHRfaWQ9MTMyMTMwMDU2NTA7IHNpZD1iN2M5M2YxZDFiMjhjYWNmZWY0ZjEwNDRmOGNkMWYydzsgX19qZHY9MTYxMTMxNDkxJTdDZGlyZWN0JTdDLSU3Q25vbmUlN0MtJTdDMTYzODQyMzM2NjQ3MDsgX19qZHU9MTYzNzAzMjkwNjQ1MTE4NjkyODQ4MTM7IGJhc2ljX2luZm89aU9TfHw2LjExLjM7IGxzTUpBeC9mZk91YVZqcnlFTDU4dDdOdG13c0Uvekh6Q3MwcEhjWnZ0T2d4VytZdDdwYkRQZz09PTsgcmVpbWJGcm9tUk49MTsgdGhpcmRfbGFuZ3VhZ2U9emhfQ047IHRoaXJkX25hbWU9emhhbmd3ZW5saW5nNTsgdGhpcmRfc2FmZXR5VG9rZW49M2FiNTQ0NGNmZmNiOTY5ZGMxMTVlM2NiNDA5MjJmYzU1ZjZmNGM7IHRoaXJkX3RlbmFudENvZGU9Q04uSkQuR1JPVVA7IHRoaXJkX3RlbmFudENvZGVMaXN0PVt7InRlbmFudENvZGUiOiJDTi5KRC5HUk9VUCJ9XTsgdGhpcmRfdGltZXN0YW1wPTE2MjI0NzUzODgzNTU7IHRoaXJkX3Rva2VuPTVjYzg5YjdhZGUxOWM3N2FlMGQwNTAyZGY0OTFkNDU5ZDJlNTU4`,
        'Cookie': `RT="z=1&dm=jd.com&si=hb8awod156g&ss=kwvp7wnp&sl=9&tt=48i&ld=knkr&nu=d41d8cd98f00b204e9800998ecf8427e&cl=lfg8"; 5J2FHrq85uEdtqhjfQDQwsfoTJWN3z6j9QA3nWlDdKKNqCjShIxT2g===; basic_info=iOS||6.16.2; reimbFromRN=1; third_language=zh_CN; third_name=zhangwenling5; third_safetyToken=45b60988354f0100a1018a0c2a1129e8e79508; third_tenantCode=CN.JD.GROUP; third_tenantCodeList=[{"tenantCode":"CN.JD.GROUP"}]; third_timestamp=1638858088543; third_token=62aec6183f1106961856955dc968fe0ae96df3; mba_muid=16370329064511869284813; __jda=161131491.16370329064511869284813.1637032906.1638439236.1638789362.11; pt_key=app_openAAJhrfDyADBwv622HuAdT4WCBLMplo8z3jYlZgkTOj05XMma6ijfO0-_1Wxj-_MWbHvwvJq_kRk; pt_pin=13213005650; pwdt_id=13213005650; sid=b7c93f1d1b28cacfef4f1044f8cd1f2w; __jdv=161131491%7Cdirect%7C-%7Cnone%7C-%7C1638423366470; __jdu=16370329064511869284813; basic_info=iOS||6.11.3; lsMJAx/ffOuaVjryEL58t7NtmwsE/zHzCs0pHcZvtOgxW+Yt7pbDPg===; reimbFromRN=1; third_language=zh_CN; third_name=zhangwenling5; third_safetyToken=3ab5444cffcb969dc115e3cb40922fc55f6f4c; third_tenantCode=CN.JD.GROUP; third_tenantCodeList=[{"tenantCode":"CN.JD.GROUP"}]; third_timestamp=1622475388355; third_token=5cc89b7ade19c77ae0d0502df491d459d2e558`,
        'jms-lang': `zh_CN`,
        'jms-tenant-code-list': `[{"tenantCode":"CN.JD.GROUP"}]`
    };
    // const body = `{"meetingName":"中华鲟","meetingCode":"2001001688","workplaceCode":"1001000053","districtCode":"13","meetingEstimateDate":"2021-12-08","meetingEstimateStime":1200,"meetingEstimateEtime":1300,"bookJoyMeeting":false,"joyMeetingParam":{"meeting":{"password":""}},"meetingSubject":"张文领预约了中华鲟会议室","lang":"zh"}`;

    log('开始预订会议室\n' + body)
    const myRequest = {
        url: url,
        method: method,
        headers: headers,
        body: body
    };

    $task.fetch(myRequest).then(response => {
        log(response.statusCode + "\n\n" + response.body);
    }, reason => {
        log(reason.error);
    });
}


function go() {
    const qinglong = `{
    "meetingName": "青龙",
    "meetingCode": "2001001714",
    "workplaceCode": "1001000053",
    "districtCode": "13",
    "meetingEstimateDate": "${tomorrowDate}",
    "meetingEstimateStime": 1600,
    "meetingEstimateEtime": 1700,
    "bookJoyMeeting": false,
    "joyMeetingParam": {
        "meeting": {
            "password": ""
        }
    },
    "meetingSubject": "张文领预约了青龙会议室",
    "lang": "zh"
}`;

    const zhuque1 = `{
    "meetingName": "朱雀",
    "meetingCode": "2001001717",
    "workplaceCode": "1001000053",
    "districtCode": "13",
    "meetingEstimateDate": "${tomorrowDate}",
    "meetingEstimateStime": 1700,
    "meetingEstimateEtime": 1800,
    "bookJoyMeeting": false,
    "joyMeetingParam": {
        "meeting": {
            "password": ""
        }
    },
    "meetingSubject": "张文领预约了朱雀会议室",
    "lang": "zh"
}`;

    const xiaojinku = `{
    "meetingName": "小金库",
    "meetingCode": "2001003746",
    "workplaceCode": "1001000052",
    "districtCode": "13",
    "meetingEstimateDate": "${tomorrowDate}",
    "meetingEstimateStime": 1500,
    "meetingEstimateEtime": 1600,
    "bookJoyMeeting": false,
    "joyMeetingParam": {
        "meeting": {
            "password": ""
        }
    },
    "meetingSubject": "张文领预约了小金库会议室",
    "lang": "zh"
}`;

    let meetingInfoArr = new Array()
    meetingInfoArr[0] = qinglong
    meetingInfoArr[1] = zhuque1
    meetingInfoArr[2] = xiaojinku
    for (let body of meetingInfoArr) {
        sendCreateMeeting(body);
    }
}


let tomorrowDate = getTomorrow();
log('开始执行任务: ' + tomorrowDate)
let dt = new Date(tomorrowDate);
if (dt.getDay() % 6 == 0) {
    log('tomorrowDate是双休日，无需执行')
    return false
}

let todayDate = new Date(new Date() + 8 * 3600 * 1000).toJSON().substr(0, 10)
log(todayDate)
const meetingTime = convertDateFromString(todayDate + " 09:00:00").getTime()
log(meetingTime)
const currentTime = new Date().getTime()
let betweenTime = Math.abs(meetingTime - currentTime)
log('betweenTime ' + betweenTime)
if (betweenTime > 5000) {
    log(betweenTime + 'ms时间过长')
    $done()
    return
}
log(betweenTime + 'ms后开始抢')
setTimeout(go, betweenTime)
setTimeout(go, betweenTime + 200)
setTimeout(go, betweenTime + 500)


setTimeout(() => $done(), betweenTime + 1000)

