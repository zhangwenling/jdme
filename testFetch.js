const fetch = require('node-fetch'); // 获取数据方法 忽略

async function getMenu(id) {
    const url = `https://zhuanlan.zhihu.com/api/${id}`
    const response = await fetch(url);
    return await response.json() // 把数据 转成json 形式 返回
}

//以下也叫串行 多个任务 按顺序执行  （执行时间长  是并行的一倍）
const showColumnInfo = async () => { // 表达式 写法 异步
    const feweekly = await getmenu('feweekly') // 用await 进行同步请求 第一个数据
    const toolingtips = await getmenu('toolingtips') // 用await 进行同步请求 第二个数据

    // 打印feweekly 数据结果
    console.log(`NAME:${feweekly.name}`)
    console.log(`INTRO:${feweekly.intro}`)

    // 打印toolingtips 数据结果
    console.log(`NAME:${toolingtips.name}`)
    console.log(`INTRO:${toolingtips.intro}`)
}
