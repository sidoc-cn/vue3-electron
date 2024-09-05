let webSocket: WebSocket;
let timer: number | null = null;

/**
 *
 *
 * @param {Socket服务端地址} server
 */
/**
 * 启动Websocket
 * @param server socket服务端地址，格式：127.0.0.1:9005
 * @param isDebugger 是否启用调试模式，调式模式下会在控制台输出日志
 */
export default function start(
    server: string,
    isDebugger = true,
    callback: (webSocket: WebSocket | null, status: string, data: Event | MessageEvent | CloseEvent) => boolean,
) {
    webSocket = new WebSocket("ws://" + server);

    // 0.1> 连接成功回调
    webSocket.onopen = function (evt: Event) {
        isDebugger && console.log("Socket-连接成功:[" + new Date().toLocaleTimeString() + "]");
        callback && callback(webSocket, "open", evt);
    };

    // 0.2> 收到服务器数据回调
    webSocket.onmessage = function (evt: MessageEvent) {
        isDebugger && console.log("Socket-收到数据：[" + new Date().toLocaleTimeString() + "]" + evt);
        callback && callback(webSocket, "message", evt);
    };

    // 0.3> 连接关闭后回调
    webSocket.onclose = function (evt: CloseEvent) {
        isDebugger && console.error("Socket-连接已关闭，正在重连...[" + new Date().toLocaleTimeString() + "]");
        const isReconnect = callback && callback(webSocket, "close", evt);

        if (isReconnect) {
            timer = window.setTimeout(function () {
                timer && window.clearTimeout(timer);
                timer = null;
                webSocket = start(server, isDebugger, callback); // 连接失败自动重连
            }, 1000);
        }
    };

    // 0.4> 连接出错后回调
    webSocket.onerror = function (evt: Event) {
        isDebugger && console.error("Socket-连接失败，正在重连...[" + new Date().toLocaleTimeString() + "]");
        webSocket && webSocket.close();
        const isReconnect = callback && callback(webSocket, "error", evt);

        if (isReconnect) {
            timer = window.setTimeout(function () {
                timer && window.clearTimeout(timer);
                timer = null;
                webSocket = start(server, isDebugger, callback); // 连接失败自动重连
            }, 1000);
        }
    };
    return webSocket;
}

/**
 * 发送数据
 *
 * @param {需发送的数据} data
 */
// WebSocket.prototype.sendData = function (data) {
//     this.send(JSON.stringify(data));
// };
