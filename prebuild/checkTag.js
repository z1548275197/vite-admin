const chalk = require('chalk');
const process = require('child_process');

const exec = process.exec;
const cmd_tags = 'git ls-remote --tags';
const cmd_br = 'git symbolic-ref --short -q HEAD';
const reg_version = /[\d.]+/;
let current_branch = '';

exec(cmd_br, (err, stdout) => {
  if (err) {
    throw new Error(err);
  }
  if (reg_version.test(stdout)) {
    current_branch = stdout.match(reg_version)[0];
  } else {
    current_branch = stdout;
  }
});
exec(cmd_tags, (err, stdout) => {
  if (err) {
    throw new Error(err);
  }
  const tagArr = stdout.split('\n');
  const reg = new RegExp(`${current_branch.replace(/\./g, '\\.').replace('daily/', '')}$`);
  tagArr.some((item) => {
    if (reg.test(item)) {
      console.warn(chalk.red('======================== git push失败提示 ==========================='));
      console.log(
        chalk.red(
          '[git !important] 当前分支已上线并弃用，请先切换至master分支，执行git pull同步远程master代码，然后运行npm run newbranch创建新分支，再继续开发！！！',
        ),
      );
      console.warn(chalk.red('======================== git push失败提示 ==========================='));
      throw new Error('');
      // return true;
    }
    return false;
  });
});
