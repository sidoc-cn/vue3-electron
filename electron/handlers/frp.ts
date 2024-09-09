// frp内网穿透相关操作
import os from "os";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import iconv from "iconv-lite";
import { BrowserWindow, ipcMain, dialog, app } from "electron";

let mainWindow: BrowserWindow | null = null;
let interval = null;

// 注册需要暴露给渲染进程的函数（通过ipcMain.handle注册的函数是异步执行的，其执行时会返回一个Promise）
export const registerHandlersFrp = (win: BrowserWindow) => {
    mainWindow = win;

    // 1.0> frp - 启动
    ipcMain.handle("start-frp", async (event, args) => {
        frpWriteConfig(event, args, function () {
            frpStart(event);
        });
    });

    // 1.1> frp - 停止
    ipcMain.handle("stop-frp", async (event, args) => {
        frpStop(event);
    });

    // 1.2> frp - 重启
    ipcMain.handle("restart-frp", async (event, args) => {
        frpWriteConfig(event, args, function () {
            frpRestart(event);
        });
    });

    // 2.0> frp - 导出配置文件
    ipcMain.handle("export-config-frp", async (event, args) => {
        const options = {
            title: "导出配置",
            defaultPath: "sidoc-frpc",
            filters: [{ name: "All files", extensions: ["toml"] }],
        };
        dialog.showSaveDialog(options).then((result) => {
            // result
            // canceled 布尔值-对话框是否被取消。
            // filePath字符串（可选）-如果取消对话框，则为undefined。
            // bookmark字符串（可选）macOS mas -Base64编码的字符串，其中包含已保存文件的安全范围书签数据。securityScopedBookmarks必须启用此功能。（有关返回值，请参见此处的表。）
            if (result.canceled) return;

            var filePath = getFrpFilePath();
            filePath = path.join(filePath, "sidoc-frpc.toml");
            fs.readFile(filePath, "utf-8", (err, data) => {
                if (err) {
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }
                try {
                    fs.writeFileSync(result.filePath, data, "utf-8");
                } catch (e) {
                    alert("保存文件失败!");
                }
            });
        });
    });

    // 2.1> frp - 获取配置文件内容
    ipcMain.handle("get-config-frp-content", (event, args) => {
        var filePath = getFrpFilePath();
        filePath = path.join(filePath, "sidoc-frpc.toml");
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                event.sender.send("get-config-frp-content-callback", "获取配置信息失败");
            } else {
                event.sender.send("get-config-frp-content-callback", data);
            }
        });
    });

    // 3.0> 监听frps日志文件内容变化，用于向渲染进程输出frps日志信息
    let frpsLogPath = path.join(getFrpFilePath(), "frpc.log");
    const watchLogFile = () => {
        // 清空日志文件
        try {
            fs.truncateSync(frpsLogPath, 0);
            console.log("日志文件清空成功");
        } catch (err) {
            console.error("清空文件失败，可能没有权限或文件不存在：", err);
        }
        // 监听日志文件
        watchFile(frpsLogPath);
    };
    // 在frpc程序刚启动时，日志文件可能不存在；此时需要每500毫秒判断一次日志是否已创建，如果已创建，则立即销毁定时器，并开始监听；
    interval = setInterval(() => {
        if (fs.existsSync(frpsLogPath)) {
            console.log("日志文件已找到");
            clearInterval(interval);
            watchLogFile();
        } else {
            console.log("日志文件不存在");
        }
    }, 500);
};

// 以下代码参数自：https://github.com/fodelf/frpClient/blob/master/src/background.js
// 子进程名称，用于运行frp
let workerProcess;

// 0.1> 启动frp
function frpStart(event) {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    const type = os.type();
    const frpPath = getFrpFilePath();
    switch (type) {
        case "Darwin":
        case "Linux":
            workerProcess = exec(
                `
                chmod -R 777 ${frpPath}
                cd  ${frpPath}
                ./sidoc-frpc -c ./sidoc-frpc.toml
            `,
                {},
            );
            break;
        case "Windows_NT":
            workerProcess = exec("sidoc-frpc.exe -c sidoc-frpc.toml", { cwd: frpPath, encoding: "GBK" });
            break;
    }

    // 子进程输出
    // 子进程并不会输出所有日志信息，因此暂不采用此方式获取输出日志
    // workerProcessOutput(event);
}

// 0.2> 停止frp
export const frpStop = (event?) => {
    if (workerProcess) {
        workerProcess.kill();
    }

    const type = os.type();
    switch (type) {
        case "Darwin":
        case "Linux":
            // ps命令是linux下最常用的也是非常强大的进程查看命令, grep命令用于查找文件里符合条件的字符串
            // ps -ef |grep name 用于查询指定名称的进程是否存在；中间的|是管道命令 是指ps命令与grep同时执行
            exec("ps -ef|grep sidoc-frp", function (err, stdout, stderr) {
                if (err) {
                    if (event) event.sender.send("frp-log-callback", "sidoc-stop-error:查询frp进程失败\n");
                    return;
                }

                stdout.split("\n").filter(function (line) {
                    var p = line.trim().split(/\s+/);
                    var address = p[1]; // 获取pid

                    if (
                        address !== undefined &&
                        address !== "PID" &&
                        p.some((item) => {
                            // some()方法依次检查数组的每个元素，如果数组中有元素满足条件，则返回true，否则返回false
                            return item === "./sidoc-frpc.toml";
                        })
                    ) {
                        exec("kill " + address, function (err, stdout, stderr) {
                            if (err) {
                                if (event) event.sender.send("frp-log-callback", "sidoc-stop-error:停止失败\n");
                            } else {
                                if (event) event.sender.send("frp-log-callback", "sidoc-stop-success:已停止\n");
                            }
                        });
                    }
                });
            });
            break;
        case "Windows_NT":
            debugger;
            exec("taskkill /f /im sidoc-frpc.exe");
            if (event) event.sender.send("frp-log-callback", "sidoc-stop-success:已停止\n");
            break;
    }
};

// 0.3> 重载frp
function frpRestart(event) {
    const type = os.type();
    var filePath = getFrpFilePath();
    switch (type) {
        case "Darwin":
        case "Linux":
            workerProcess = exec(
                `
                chmod -R 777 ${filePath}
                cd  ${filePath}
                ./sidoc-frpc reload -c ./sidoc-frpc.toml
                `,
                {},
            );
            break;
        case "Windows_NT":
            workerProcess = exec("sidoc-frpc.exe reload -c sidoc-frpc.toml", {
                cwd: filePath,
            });
            break;
    }

    // 子进程输出
    // 子进程并不会输出所有日志信息，因此暂不采用此方式获取输出日志
    // workerProcessOutput(event);
}

// 0.4> 获取frp目录路径
function getFrpFilePath() {
    /**
     * frp程序路径说明：
     * 开发环境下，程序使用项目根据目录下 frp文件夹 中的程序启动内网穿透
     * 生产环境下，程序使用项目public目录下 frp文件夹 中的程序启动内网穿透
     *
     * 注意：开发环境下，不能使用public目录下 frp文件夹 中的程序，因为在程序中访问public目录会导致页面自动被刷新
     */

    // 获取主目录路径，https://www.electronjs.org/docs/api/app#appgetpathname

    let appPath = "";
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        appPath = path.join(app.getAppPath(), "../"); // 开发环境
    } else {
        appPath = app.getAppPath(); // 正式环境
    }

    const type = os.type();
    var filePath = "";
    switch (type) {
        case "Darwin":
        case "Linux":
            filePath = path.join(appPath, "frp/", "frp_0.58.1_darwin_amd64");
            break;
        case "Windows_NT":
            filePath = path.join(appPath, "frp/", "frp_0.58.1_windows_amd64"); // 64位
            break;
    }
    return filePath;
}

// 0.5> 写入frp配置
function frpWriteConfig(event, args, callback) {
    let filePath = path.join(getFrpFilePath(), "sidoc-frpc.toml");

    // 必须设置 admin_port 和 admin_ip ,否则重载功能无法使用
    let writeString = args;
    fs.writeFile(filePath, writeString, function (error) {
        if (error) {
            event.sender.send("frp-log-callback", "configuration-write-failure：" + error + "\n");
        } else {
            callback();
        }
    });
}

// 0.6> 子进程输出（暂时废弃）
function workerProcessOutput(event) {
    const type = os.type();

    // 正常输出
    workerProcess.stdout.on("data", function (data) {
        debugger;
        if (data === null || typeof data === "number") return;

        if (type === "Windows_NT") {
            event.sender.send("frp-log-callback", iconv.decode(data, "GBK")); // Windows平台必须使用GBK编码，否则中文会出现乱码
        } else {
            event.sender.send("frp-log-callback", data);
        }
    });

    // 错误输出
    workerProcess.stderr.on("data", function (data) {
        debugger;
        if (data === null || typeof data === "number") return;

        if (type === "Windows_NT") {
            event.sender.send("frp-log-callback", iconv.decode(data, "GBK"));
        } else {
            event.sender.send("frp-log-callback", data);
        }
    });

    // 退出之后的输出
    workerProcess.on("close", function (code) {
        debugger;
        if (code === null || typeof code === "number") return;

        if (type === "Windows_NT") {
            event.sender.send("frp-log-callback", iconv.decode(code, "GBK"));
        } else {
            event.sender.send("frp-log-callback", code);
        }
    });
}

// 0.7.0> 监听frpc.log日志文件变化，详见：https://juejin.im/post/6844903905541750791
let filePosition = 0; // 初始化文件读取位置
function watchFile(filename) {
    console.log("开始监听文件");

    // 使用 fs.watch 监听指定文件
    fs.watch(filename, (eventType) => {
        // change被监听文件的变化事件
        if (eventType === "change") {
            const stream = fs.createReadStream(filename, {
                start: filePosition,
                encoding: "utf8",
            });

            stream.on("data", (chunk) => {
                // console.error("读取到的文件内容：",chunk);
                filePosition += chunk.length;
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send("frp-log-callback", chunk);
                }
            });

            stream.on("error", (err) => {
                console.error("Error reading new content:", err);
                throw err;
            });
        }
    }).on("error", (error) => {
        // 处理错误，例如重新尝试、记录日志等
        console.error("watch error:", error);
        throw error;
    });
}

// 工具函数：alert弹框
function alert(title: string, content?: string) {
    dialog.showErrorBox(title, content ? content : "");
}
