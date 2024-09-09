// 全局node api
//! 需要在主进程中启用`nodeIntegration`，否则渲染进程无法使用 Node.js

import { lstat } from "node:fs/promises";
import { cwd } from "node:process";

lstat(cwd())
    .then((stats) => {
        console.log("[fs.lstat]", stats);
    })
    .catch((err) => {
        console.error(err);
    });
