"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable = exports.enable = exports.info = void 0;
const info = {
    name: "智能回复",
    author: "xxcyou",
    version: "1.1.0"
};
exports.info = info;
//导入
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const oim_1 = __importDefault(require("@vikiboss/oim"));
const oicq_1 = require("@vikiboss/oicq");
const setting_json = __importDefault(require("./setting.json"));
const axios_1 = __importDefault(require("axios"));
const md5 = __importDefault(require('md5-node'));
const QQ = this.uin;
let Objec ;
//let 局域变量
//var 全局变量
//const 静态不可改变变量


//数组结构
let structureData = {};
let botAdmins = [];
//配置
const structuredDataCreation = (group) => {
    //规定指定群
    if (!structureData[group]) {
        structureData[group] = {
            //文字
            replyText: [],
            //功能开关
            configureTheSwitch: {}
        };
    }
    //功能开关配置
    if (!structureData[group].configureTheSwitch[group]) {
        structureData[group].configureTheSwitch[group] = {
            //文字开关
            textSwitch: true
        };
    }
};
const nullInfo = {
    isOwner: false,
    isAdmin: false,
    owner_id: 0,
    admins: [],
    list: [],
    info: null
};
const fileExist = (filePath) => {
    try {
        return fs_1.default.statSync(filePath).isFile();
    }
    catch (_a) {
        return false;
    }
};
const dirExist = (dirPath) => {
    try {
        return fs_1.default.statSync(dirPath).isDirectory();
    }
    catch (_a) {
        return false;
    }
};
const nowForFileName = () => oim_1.default.format(new Date(), "MM月DD日HH时mm分ss秒");
function save(data) {
    try {
        const dir = path_1.default.join(__dirname, String(this.uin));
        const filePath = path_1.default.join(dir, `config.json`);
        if (!dirExist(dir))
            fs_1.default.mkdirSync(dir);
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    }
    catch (_a) {
        return false;
    }
}
function load(defaultData) {
    const dir = path_1.default.join(__dirname, String(this.uin));
    const filePath = path_1.default.join(dir, `config.json`);
    try {
        if (!dirExist(dir))
            fs_1.default.mkdirSync(dir);
        if (!fileExist(filePath)) {
            save.call(this, defaultData);
            return defaultData;
        }
        return JSON.parse(fs_1.default.readFileSync(filePath, { encoding: "utf-8" }));
    }
    catch (_a) {
        fs_1.default.copyFileSync(filePath, path_1.default.join(dir, `[${nowForFileName()}]-${namee}.json`));
        const msg = `配置读取失败，已尝试将原始数据备份到原目录`;
        console.log(msg);
        save.call(this, defaultData);
        return defaultData;
    }
}
function upload(name, group) {
    let _a, _b;
    return __awaiter(this, void 0, void 0, function* () {//yield
        try {
            const [qq, GFS] = [String(this.uin), this.acquireGfs(group)];
            const uploadFileName = `${name}-${nowForFileName()}-config.json`;
            let [qqDirExists, pid, ls] = [false, "", yield GFS.ls()];
            for (const l of ls) {
                if (l.name === qq && ((_a = l) === null || _a === void 0 ? void 0 : _a.is_dir)) {
                    qqDirExists = true;
                    pid = (_b = l) === null || _b === void 0 ? void 0 : _b.fid;
                }
            }
            if (!qqDirExists) {
                const state = yield GFS.mkdir(qq);
                pid = state.fid;
            }
            yield GFS.upload(path_1.default.join(__dirname, qq, `config.json`), pid, uploadFileName);
            return `✅ ${name}：已将配置文件上传至指定群`;
        }
        catch (e) {
            return `❎ ${name}：配置文件上传失败，错误信息：${e === null || e === void 0 ? void 0 : e.message}`;
        }
    });
}
let sleep = (n) => {
    let start = new Date().getTime();
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
}
function loadImg (imgUrl) {
    return __awaiter(this, void 0, void 0, function* () {//yield
        try {
            const dir1 = path_1.default.join(__dirname, String("video"));
            const filePath = path_1.default.join(dir1, `${md5.default(imgUrl)}`);
            if (!dirExist(dir1))
                fs_1.default.mkdirSync(dir1);
            let { data } = yield axios_1.default({
                url: imgUrl,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'arraybuffer',
            })
            fs_1.default.writeFileSync(filePath, data, 'binary');
            return filePath
        }
        catch (_a) {
            return "";
        }

    });
}
const getParenthesesStr = (text, start, end) => { //不支持内部交叉取中间 [a]cvc[a]kjk[/a]sdas[/a] 不支持转义\
    let fromIndex = 0;
    let anIntermediateArray = [];
    if (text.indexOf(start) === -1 || text.indexOf(end) === -1)
        return anIntermediateArray;
    while (text.indexOf(start,fromIndex) !== -1 && text.indexOf(end,text.indexOf(start,fromIndex) + start.length ) !== -1) {
        anIntermediateArray.push(text.substring(text.indexOf(start,fromIndex) + start.length,text.indexOf(end,text.indexOf(start,fromIndex) + start.length)));
        fromIndex = text.indexOf(end,text.indexOf(start,fromIndex) + start.length) + end.length;
    }
    return anIntermediateArray;
}

//主功能
//[I]图片|||https://www.baidu.com[/I] 图片
//[Vo]语音|||https://www.baidu.com[/Vo] 语音
//[Vi]视频|||https://www.baidu.com[/Vi] 视频 需要保存本地
//[T]问题|||我的回复[/T] 文字
//[W]问题[/W] 撤回
//[S]问题|||60[/S] 禁言 禁言60秒

function ruleTransformation(issue,reply5,msg_id,group_id) {//yield
    return __awaiter(this, void 0, void 0, function* () {
        reply5 = reply5.replace(/&#91;/g,"[");
        reply5 = reply5.replace(/&#93;/g,"]");
        reply5 = reply5.replace(/\\n/g,"\n")
        let replaceTheContent = reply5.replace(/amp;/g,"");
        let reply1 = ``;
        structuredDataCreation(group_id);
        if (structureData[group_id].replyText.find(function (value,index,arr) { if (value.issue === issue){ return true; }}) !== undefined)
            return false;
        if (structureData[group_id].configureTheSwitch[group_id].textSwitch){
            if (reply1 === ``){
                reply1 = replaceTheContent;
            }
        }
        if (reply1 !== ``){
            structureData[group_id].replyText.push({ issue:issue, reply1:reply1 });
        }
        yield save.call(this,structureData);
        yield this.deleteMsg(msg_id);
        return true;
    });
}
function CQZ(N) {
    let CQ = [];
    CQ["CQ"] = getParenthesesStr(N,"[CQ:",",file")[0]
    CQ["file"] = getParenthesesStr(N,"file=",",url=")[0]
    CQ["url"] = getParenthesesStr(N,",url=","]")[0]
    return CQ;
}
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].issue === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}
const fetchGroupInfo = (bot, group_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const info = (yield bot.getGroupInfo(group_id)).data;
    if (!info)
        return nullInfo;
    const isOwner = (info === void 0 ? void 0 : info.owner_id) === bot.uin;
    const owner_id = info.owner_id;
    const list = (yield bot.getGroupMemberList(group_id)).data;
    const admins = [];
    for (const groupId of list.keys()) {
        const roleIsAdmin = ((_a = list.get(groupId)) === null || _a === void 0 ? void 0 : _a.role) === "admin";
        if (roleIsAdmin && ((_b = list.get(groupId)) === null || _b === void 0 ? void 0 : _b.user_id)) {
            admins.push((_c = list.get(groupId)) === null || _c === void 0 ? void 0 : _c.user_id);
        }
    }
    const isAdmin = admins.includes(bot.uin);
    return { isOwner, isAdmin, owner_id, admins, list, info };
});

function canadmin(group_id, qq) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isOwner, isAdmin, owner_id, admins } = yield fetchGroupInfo(this, group_id);
        return [...admins, owner_id].includes(qq);
    });
}
function listener(data) {
    let _a;
    return __awaiter(this, void 0, void 0, function* () {
        Objec = this;
        const { raw_message: _message, user_id, message_type: type, message_id: msg_id, reply } = data;
        const { group_id } = data;

        const prefix = setting_json.default.prefix
        const message = _message.trim();
        const rep = type === "group" ? oicq_1.cqcode.reply(msg_id) : "";
        let message1,message2,message01;
        //主代码
        if (type !== "group")
            return ;
        if (setting_json.default.gban.includes(group_id))
            return ;
        structuredDataCreation(group_id);
        if (structureData[group_id].replyText[structureData[group_id].replyText.length - 1] != null && structureData[group_id].configureTheSwitch[group_id].textSwitch) {
            for (const item of structureData[group_id].replyText) {
                let matched = false;
                let reply1 = "";
                reply1 = item.reply1;
                if (item.reply1.indexOf("[J]") !== -1) {
                    matched = message === item.issue;
                    reply1 = reply1.replace(/\[J]/g,"");
                } else {
                    matched = message.indexOf(item.issue) !== -1;
                }
                if (matched) {
                    if (reply1.indexOf("[admins]") !== -1)
                        if (botAdmins.includes(user_id))
                            reply1 = reply1.replace(/\[admins]/g,"");
                        else
                            return;
                    if (reply1.indexOf("[admin]") !== -1)
                        if (yield canadmin.call(this, group_id, user_id))
                            reply1 = reply1.replace(/\[admin]/g,"");
                        else
                            return;


                    if (reply1.indexOf('[A64]')!== -1 && reply1.indexOf('[/A64]')!== -1 ) {
                        reply1 = reply1.replace(/\[A64](.*?)\[\/A64]/g, function (word) {
                            const buff = Buffer.from(getParenthesesStr(word, "[A64]", "[/A64]")[0],'base64');
                            return  buff.toString('utf-8');
                        })
                    }
                    message01 = message.replace(/&#91;/g,"[");
                    message01 = message01.replace(/&#93;/g,"]");
                    message01 = message01.replace(/\\n/g,"\n")
                    message01 = message01.replace(/amp;/g,"");
                    if(reply1.indexOf("[JS]") !== -1 && reply1.indexOf("[/JS]") !== -1) {
                        let reply2 = getParenthesesStr(reply1,"[JS]","[/JS]")[0]
                        message1 = message01.replace(item.issue,"");
                        const title1 = message1.split(' ');
                        let gett = "";
                        //let yun = `const data = [${user_id},"${type}","${msg_id}",${group_id}]; `;
                        if (title1.length < 1) {
                            gett = `["${message1}"]`
                        } else {
                            for (let a = 0; a < title1.length; a++){
                                if ( (a + 1) <  title1.length) {
                                    gett += `"${title1[a]}",`
                                }else {
                                    gett += `"${title1[a]}"`
                                }
                            }
                            gett = `[${gett}]`
                        }
                        reply2 = reply2.replace("[parameter]",gett)
                        try {
                            reply2 = eval.call(this,reply2)
                        } catch (e) {
                            reply2 = e.message;
                        }
                        reply1 = reply1.replace(/\[JS](.*?)\[\/JS]/g,reply2);
                    }
                    if (reply1.indexOf('[64]')!== -1 && reply1.indexOf('[/64]')!== -1) {
                        reply1 = reply1.replace(/\[64](.*?)\[\/64]/g, function (word) {
                            const buff = Buffer.from(getParenthesesStr(word, "[64]", "[/64]")[0],'base64');
                            return  buff.toString('utf-8');
                        })
                    }
                    if (reply1.indexOf('[I]')!== -1 && reply1.indexOf('[/I]')!== -1) {
                        reply1 = reply1.replace(/\[I](.*?)\[\/I]/g,function(word){
                            return oicq_1.cqcode.image(getParenthesesStr(word,"[I]","[/I]")[0]);
                        })
                    }
                    if (reply1.indexOf('[A]')!== -1 && reply1.indexOf('[/A]')!== -1 ) {
                        reply1 = reply1.replace(/\[A](.*?)\[\/A]/g, function (word) {
                            return oicq_1.cqcode.at(Number(getParenthesesStr(word, "[A]", "[/A]")[0]));
                        })
                    }
                    if (reply1.indexOf('[Vo]')!== -1 && reply1.indexOf('[/Vo]')!== -1) {
                        reply1 = reply1.replace(/\[Vo](.*?)\[\/Vo]/g,function(word){
                            return oicq_1.cqcode.record(getParenthesesStr(word,"[Vo]","[/Vo]")[0]);
                        })
                    }
                    if (reply1.indexOf('[Vi]')!== -1 && reply1.indexOf('[/Vi]')!== -1) {
                        reply1 = reply1.replace(/\[Vi](.*?)\[\/Vi]/g,function(word){
                            const dir1 = path_1.default.join(__dirname, String("video"));
                            const filePath = path_1.default.join(dir1, `${md5.default(getParenthesesStr(word,"[Vi]","[/Vi]")[0])}`);
                            loadImg(getParenthesesStr(word,"[Vi]","[/Vi]")[0])
                            return oicq_1.cqcode.video(filePath);
                        })
                    }
                    if (reply1.indexOf("[a]") !== -1) {
                        reply1 = reply1.replace(/\[a]/g, function (word) {
                            return oicq_1.cqcode.at(Number(user_id));
                        })
                    }
                    if(reply1.indexOf("[W]") !== -1) {
                        reply1 = reply1.replace(/\[W]/g,"");
                        yield this.deleteMsg(msg_id);
                    }
                    if(reply1.indexOf("[S]") !== -1 && reply1.indexOf("[/S]") !== -1) {
                        let reply2 = getParenthesesStr(reply1,"[S]","[/S]")[0]
                        reply1 = reply1.replace(/\[S](.*?)\[\/S]/g,"");
                        yield this.setGroupBan(group_id, user_id, Number(reply2));
                    }
                    if(reply1.indexOf("[G]") !== -1) {
                        reply1 = reply1.replace(/\[G]/g,"");
                        yield this.setGroupWholeBan(group_id, true);
                    }
                    if(reply1.indexOf("[g]") !== -1) {
                        reply1 = reply1.replace(/\[g]/g,"");
                        yield this.deleteMsg(msg_id);
                        yield this.setGroupWholeBan(group_id, false);
                    }
                    if(reply1.indexOf("[rep]") !== -1) {
                        reply1 = reply1.replace(/\[rep]/g,rep);
                    }

                    if (reply1 !== "")
                        yield reply(reply1.replace(/amp;/g,""));
                }

            }
        }

        if (!botAdmins.includes(user_id)){//判断是否是管理人员
            return;
        }
        if (message === "#备份智能回复"){
            return yield reply(yield upload.call(this, info.name, setting_json.default.group));
        }
        if (message === "#载入配置"){
            structureData = load.call(this, {});
            let data1 = yield reply(`${rep} ${prefix.success} 载入成功`);
            sleep(6000);
            yield this.deleteMsg(data1.data.message_id);
            return ;
        }
        if (message === "#关闭回复"){
            structuredDataCreation(group_id);
            structureData[group_id].configureTheSwitch[group_id].textSwitch = false;
            save.call(this,structureData);
            let data1 = yield reply(`${rep} ${prefix.success} 设置成功`);
            sleep(6000);
            yield this.deleteMsg(data1.data.message_id);
            return ;
        }
        if (message === "#开启回复"){
            structuredDataCreation(group_id);
            structureData[group_id].configureTheSwitch[group_id].textSwitch = true;
            save.call(this,structureData);
            let data1 = yield reply(`${rep} ${prefix.success} 设置成功`);
            sleep(6000);
            yield this.deleteMsg(data1.data.message_id);
            return ;
        }
        if (message.indexOf(`查看关键`) !== -1){
            structuredDataCreation(group_id);
            message1 = message.replace(`查看关键`,"");
            let id = 1;
            let msg = "------------查看关键------------\n";
            if (message1 !== "")
                id = Number(message1);
            if (structureData[group_id].replyText[structureData[group_id].replyText.length - 1] != null){
                let sx = Math.ceil(structureData[group_id].replyText.length / 10);
                if ( id > sx){
                    let data1 = yield reply(`${rep} ${prefix.failed} 页数大于`);
                    sleep(6000);
                    yield this.deleteMsg(data1.data.message_id);
                    return ;

                }
                let  ss = (structureData[group_id].replyText.length - ((id - 1) * 10)) <= 10 ? (structureData[group_id].replyText.length - ((id - 1) * 10)) : 10;
                for (let a = 0; a < ss; a++){
                    let ll = structureData[group_id].replyText[a + ((id -1) * 10)].reply1.indexOf("[admin]") !== -1 ? "[管理员]" : ""
                    let lll = structureData[group_id].replyText[a + ((id -1) * 10)].reply1.indexOf("[admins]") !== -1 ? "[Bot管理]" : ""
                    let llll = structureData[group_id].replyText[a + ((id -1) * 10)].reply1.indexOf("[JS]") !== -1 ? "[JS]" : ""
                    msg += `关键字：${structureData[group_id].replyText[a + ((id -1) * 10)].issue} ${llll}${ll}${lll}\n`
                }
                msg += `------------${id} / ${sx}页------------`
                let data1 = yield reply(`${rep}\n${msg}`);
                return ;
            }
        }
        if (message.indexOf(`删除关键`) !== -1){
            structuredDataCreation(group_id);
            message1 = message.replace(`删除关键`,"");
            if (structureData[group_id].replyText[structureData[group_id].replyText.length - 1] != null){
                structureData[group_id].replyText.removeByValue(message1);
                save.call(this,structureData)
                let data1 = yield reply(`${rep}删除关键字: ${message1}\n${prefix.success} 设置成功`);
                sleep(6000);
                yield this.deleteMsg(data1.data.message_id);
                return ;
            }
        }
        if (message.indexOf(`回复表情`) !== -1){
            message1 = message.replace(`回复表情`,"");
            const title1 = message1.split(' ');
            message2 = message1.replace(`${title1[0]} `,"");
            let msg = "";
            if (title1.length <= 1)
                return yield reply(`${rep}\n ${prefix.failed} 参数错误`);
            msg = message2.replace(/\[CQ:(.*?)]/g,function(word){
                return `[I]${getParenthesesStr(word,",url=","]")[0]}[/I]`
            })
            let re = yield ruleTransformation.call(this, title1[0], msg, msg_id, group_id);
            let data1 ;
            if (re)
                data1 = yield reply(`${rep}关键字: ${title1[0]}\n回复: ${msg}\n${prefix.success} 设置成功`);
            else
                data1 = yield reply(`${rep}关键字: ${title1[0]}\n回复: ${msg}\n${prefix.failed} 已经有该关键字`);
            sleep(6000);
            yield this.deleteMsg(data1.data.message_id);
            return ;
        }
        if (message.indexOf(`关键字`) !== -1){
            message1 = message.replace(`关键字`,"");
            const title1 = message1.split(' ');
            if (title1.length <= 1)
                return yield reply(`${rep}\n ${prefix.failed} 参数错误`);
            message2 = message1.replace(`${title1[0]} `,"");
            let re = yield ruleTransformation.call(this, title1[0], message2, msg_id, group_id);
            let data1 ;
            if (re)
                data1 = yield reply(`${rep}关键字: ${title1[0]}\n回复: ${message2}\n${prefix.success} 设置成功`);
            else
                data1 = yield reply(`${rep}关键字: ${title1[0]}\n回复: ${message2}\n${prefix.failed} 已经有该关键字`);
            sleep(6000);
            yield this.deleteMsg(data1.data.message_id);
        }
    })
}


function adminListener(admins) {
    botAdmins = admins;
}
const enable = (bot) => {
    structureData = load.call(bot, {});
    bot.on("message", listener);
    bot.on("kivibot.admin", adminListener);
};
exports.enable = enable;
const disable = (bot) => {
    bot.off("message", listener);
    bot.off("kivibot.admin", adminListener);
};
exports.disable = disable;