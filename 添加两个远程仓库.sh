# 1.0> 列出当前项目中的所有Git仓库
git remote -v
# 执行结果如下：（以下表示当前项目有两个仓库，仓库名称分别为origin和github，对于git来说origin始终是默认仓库）
# origin  https://github.com/username/repository.git (fetch)
# origin  https://github.com/username/repository.git (push)
# github  https://github.com/username/repository.git (fetch)
# github  https://github.com/username/repository.git (push)

# 2.0> 删除一个指定名称的仓库
git remote remove

# 3.0> 添加一个指定名称的仓库
git remote add github git@github.com:sidoc-cn/vue3-electron.git

# 3.1> 添加新的仓库后，先要执行如下代码
# Git默认不允许两个历史不相干的仓库在一起，此代码表示允许历史不相干的仓库在一起
git pull github master --allow-unrelated-histories

# 4.0> 项目中有两个Git仓库时，默认情况下，代码始终push到origin仓库，即第一个仓库；
# 如果需要push代码到第二个仓库上时，需要显示指定仓库的名称；
# git add 和 git commit 命令不区分仓库，正常执行即可；

# 5.0> push代码到指定名称的仓库
git push github

