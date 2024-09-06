
#! 1.0> package.json中的author字段中必须包含作者的邮箱，否则Linux打包无法通过；
#! 2.0> 不要修改 electron-builder 中除“图标”和“包名”之外的任何配置信息，因为这些配置已经是验证过的最佳配置；
#! 3.0> electron-builder中的图标配置，有严格的尺寸要求，详见：https://www.electronforge.io/guides/create-and-add-icons
#! 4.0> icns格式的图标包含了不同分辨率大小的图标，因此icns不只是一个图标；
#! 5.0> 一个操作平台下能打出各种架构的包，例如：windonw系统能打出x64、x86、arm64的包；