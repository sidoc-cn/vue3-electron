
# 1.0> 添加一个Github仓库（参考文档：https://www.sidoc.cn/article/1505.html）
git remote add github git@github.com:sidoc-cn/vue3-electron.git

# 1.2> push代码到Github仓库
git push github


# 2.0> 通过命令行从GitHub Artifacts下载工件文件 ----------------------------------------------------------------------
# 2.1> 安装github命令行工具gh
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y

# 2.2> 通过token登录github（仔细看命令选中的指引）
gh auth login
# 需要根据Github授权token登录，此处已经创建了token(保密)：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

# 2.3> 列表指定仓库中的所有工件流
# gh run list --repo <用户名>/<仓库名>
gh run list --repo sidoc-cn/vue3-electron

# 2.4> 下载指定仓库中、指定ID的工作流中的所有文件到当前目录下
# 建议将文件统一下载到 /home/ubuntu/files 目录下
# gh run download <工作流ID(run_id)> --repo <用户名>/<仓库名>
gh run download 10730739809 --repo sidoc-cn/vue3-electron
# 在国外服务器上下载GitHub Artifacts工件的速度约为5Mbps/s； 
# 从国外服务器上下载文件到国内的速度约为4.5Mbps/s(AWS Lightsail东京)、2Mbps/s(甲骨文圣河塞)；
 