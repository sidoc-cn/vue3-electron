// IndexedDB封装
// IndexedDB的主要设计目标之一是允许大量数据可以被存储以供离线使用
// 打开 IndexedDB 时必须得到用户授权
// 浏览器隐私模式下，IndexedDB 中的数据仅在内存中存储至隐私会话结束
// IndexedDB不是缓存，清除浏览器缓存后，cookie、localStorage、sessionStorage等方式存储的数据会被清除，但IndexedDB中的数据则不会，除非手动删除IndexedDB数据库；
// IndexedDB有版本号的概念，类似Git，用于管理数据的版本，版本号只能是整数；
// 使用索引查询时，会根据数据类型进行严格匹配
// !不要将Vue响应式对象存入IndexedDB，否则会导致异常，可使用 toRaw() 将响应式对象转普通对象

/**
 * 1.0> 打开数据库 ------------------------------------------------------------------------------------------
 *
 * @param dbName 数据库名称
 * @param version 数据库版本号
 * @param upgradeCallback 数据库创建或版本更新回调
 * @returns Promise<IDBDatabase>
 */
const open = (dbName: string, version: number, upgradeCallback: (db: IDBDatabase) => void): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        // 数据库创建或升级的时候会触发
        // 打开数据库，若不存在则创建
        // 参数1是数据库名称，参数2是数据库版本(此版本可自定义，其作用类似Git中的版本，用于做数据的版本管理，默认为1)
        const request: IDBOpenDBRequest = window.indexedDB.open(dbName, version);

        // 数据库打开成功回调
        request.onsuccess = (event: Event) => {
            const db: IDBDatabase | null = (event?.target as IDBOpenDBRequest)?.result; // 数据库对象
            console.log("数据库打开成功");
            resolve(db);
        };

        // 数据库打开失败的回调
        request.onerror = (event: Event) => {
            console.log("数据库打开报错");
            console.error(event);
            alert("indexedDB打开失败：" + (event.target as IDBOpenDBRequest).error?.message);
            reject(event);
        };

        // 数据库创建或版本更新时回调，此回调主要用于创建和更新存储库，
        // 当前IndexedDB中存储库的数据结构发生变更时，开发人员可通过升级数据库版本号，以触发此回调执行，并在此回调中更新数据结构，以实现数据库的升级
        // 此回调先于 onsuccess 和 onerror 回调执行；如果此回调中正常执行完成，则 onsuccess 回调随后被执行；如果此回调中发生错误，则 onerror 回调随后被执行；
        request.onupgradeneeded = (event) => {
            try {
                const db: IDBDatabase | null = (event?.target as IDBOpenDBRequest)?.result; // 数据库对象
                if (db) upgradeCallback(db);
                else throw new Error();
            } catch (err) {
                if (err instanceof Error) {
                    alert(err.message);
                } else {
                    throw new Error();
                }
            }
        };
    });
};

/**
 * 添加数据
 *
 * @param db 数据库对象
 * @param storeName 仓库对象
 * @param data 数据
 */
const add = (db: IDBDatabase, storeName: string, data: unknown): Promise<IDBObjectStore> => {
    return new Promise((resolve, reject) => {
        const request = db
            .transaction([storeName], "readwrite") // 事务对象：指定表格名称和操作模式（"只读"或"读写"）
            .objectStore(storeName) // 仓库对象
            .add(data);

        request.onsuccess = function (event) {
            const source = (event.target as IDBRequest).source as IDBObjectStore;
            console.log("数据写入成功");
            resolve(source);
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 通过主键读取数据
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
const getByKey = <T>(db: IDBDatabase, storeName: string, key: IDBValidKey | IDBKeyRange): Promise<T> => {
    return new Promise((resolve, reject) => {
        // 通过主键获取数据
        const request = db.transaction([storeName]).objectStore(storeName).get(key);

        request.onsuccess = function (event) {
            resolve((event.target as IDBRequest).result);
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 通过游标获取存储中的所有数据
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
const getByCursor = <T>(db: IDBDatabase, storeName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        // 打开游标
        const request = db.transaction(storeName, "readwrite").objectStore(storeName).openCursor();

        const list: T[] = [];

        // 通过游标逐行读数据
        // 游标指针默认指向第一行数据，游标指针向后移动可以依次指向并获取所有数据行
        request.onsuccess = function (e) {
            const cursor = (e.target as IDBRequest).result;
            if (cursor) {
                list.push(cursor.value); // cursor.value 获取当前游标指针所指向的行
                cursor.continue(); // 游标指针继续后移遍历，每后移一次，onsuccess 回调就会被执行一次
            } else {
                resolve(list);
            }
        };

        // 游标开启失败
        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 通过索引读取数据一条数据（注：如果匹配到多条数据，则仅返回第一条数据）
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
const getByIndex = <T>(db: IDBDatabase, storeName: string, indexName: string, indexValue: IDBValidKey | IDBKeyRange): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const store = db.transaction(storeName, "readwrite").objectStore(storeName);
        const request = store.index(indexName).get(indexValue);
        request.onsuccess = function (e) {
            const result = (e.target as IDBRequest).result;
            resolve(result);
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 通过索引和游标查询所有匹配数据
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
const getByIndexAndCursor = <T>(db: IDBDatabase, storeName: string, indexName: string, indexValue: unknown): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象

        // 原理：先通过索引定位数据行，再通过游标来指向匹配索引值的数据行
        const request = store
            .index(indexName) // 指定索引
            .openCursor(IDBKeyRange.only(indexValue)); // 指定游标指针的范围，此处设定游标仅指向索引 indexName 的值为 indexValue 的数据行

        const list: T[] = [];

        // 通过游标逐行读数据
        // 游标指针默认指向第一行数据，游标指针向后移动可以依次指向并获取所有数据行
        request.onsuccess = function (e) {
            const cursor = (e.target as IDBRequest).result;

            // advance函数指定游标直接跳过指定的行数，可用于分页查询
            // cursor.advance(10);

            if (cursor) {
                list.push(cursor.value); // cursor.value 获取当前游标指针所指向的行
                cursor.continue(); // 游标指针继续后移遍历，每后移一次，onsuccess 回调就会被执行一次
            } else {
                resolve(list);
            }
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 保存数据：如果数据已存在，则更新，否则新增（根据主键判断数据是否存在）
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
const save = (db: IDBDatabase, storeName: string, data: unknown): Promise<IDBObjectStore> => {
    return new Promise((resolve, reject) => {
        // put方法用户保存数据
        const request = db.transaction([storeName], "readwrite").objectStore(storeName).put(data);

        request.onsuccess = function (event) {
            const source = (event.target as IDBRequest).source as IDBObjectStore;
            console.log("数据写入成功");
            resolve(source);
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 通过主键删除数据
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} id 主键值
 */
const deleteByKey = (db: IDBDatabase, storeName: string, id: IDBValidKey | IDBKeyRange) => {
    return new Promise((resolve, reject) => {
        const request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(id);

        request.onsuccess = function (event) {
            const source = (event.target as IDBRequest).source as IDBObjectStore;
            resolve(source);
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 通过索引和游标删除指定数据
 *
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
const deleteByCursor = (db: IDBDatabase, storeName: string, indexName: string, indexValue: unknown): Promise<void> => {
    return new Promise((resolve, reject) => {
        const store = db.transaction(storeName, "readwrite").objectStore(storeName);
        const request = store
            .index(indexName) // 索引对象
            .openCursor(IDBKeyRange.only(indexValue)); // 指针对象

        request.onsuccess = function (e) {
            const cursor = (e.target as IDBRequest).result;
            let deleteRequest;
            if (cursor) {
                deleteRequest = cursor.delete(); // 请求删除当前项
                deleteRequest.onerror = function () {
                    console.log("游标删除记录失败");
                };
                deleteRequest.onsuccess = function () {
                    console.log("游标删除记录成功");
                };
                cursor.continue();
            } else {
                resolve();
            }
        };

        request.onerror = function (event) {
            const message = (event.target as IDBOpenDBRequest).error?.message;
            alert(message);
            reject(message);
        };
    });
};

/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
const closeDB = (db: IDBDatabase) => {
    db.close();
    console.log("数据库已关闭");
};

/**
 * 删除数据库
 * @param {object} dbName 数据库名称
 */
const deleteDB = (dbName: string): Promise<Event> => {
    return new Promise((resolve, reject) => {
        const deleteRequest = window.indexedDB.deleteDatabase(dbName);
        deleteRequest.onerror = function (event) {
            resolve(event);
        };
        deleteRequest.onsuccess = function (event) {
            reject(event);
        };
    });
};

export default {
    open, // 打开或创建数据
    add, // 新增数据
    getByKey, // 通过主键获取数据
    getByCursor, // 通过游标获取存储库中的所有数据
    getByIndex, // 通过索引读取数据一条数据（注：如果匹配到多条数据，则仅返回第一条数据）
    getByIndexAndCursor, // 通过索引和游标查询所有匹配数据
    save, // 保存数据：如果数据已存在，则更新，否则新增（根据主键判断数据是否存在）
    deleteByKey, // 通过主键删除数据
    deleteByCursor, // 通过索引和游标删除指定数据

    closeDB, // 关闭数据库
    deleteDB, // 删除数据库
};
