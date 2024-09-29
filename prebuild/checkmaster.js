const chalk = require('chalk');
const process = require('child_process');

const exec = process.exec;
// const cmd =
//   'git fetch origin master && git rev-list --left-right --count origin/master...@ | cut -f1';
const cmd =
  'git fetch origin master && git rev-list --left-only --count origin/master...@';

exec(cmd, (err, stdout) => {
  if (err) {
    throw new Error(err);
  }
  if (stdout.replace('\n', '') === '0') {
    console.log(chalk.green('[git] Current branch is update to master'));
    // process.exit(1);
  } else {
    console.warn(chalk.red('========================git merge提示 ==========================='));
    console.log(
      chalk.red(
        '[git !important] master分支有更新，请先切换至master分支，执行git pull同步远程master代码（或直接在当前分支git pull），然后把master分支的代码merge到当前开发分支，之后再重新提交代码！！！',
      ),
    );
    console.warn(chalk.red('========================git merge提示 ==========================='));
    throw new Error('');
  }
});
