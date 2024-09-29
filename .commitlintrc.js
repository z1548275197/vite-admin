module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（feature）
        'fix', // 修补bug
        'docs', // 文档修改（documentation）
        'style', // 代码格式修改（不影响代码运行的变动）
        'refactor', // 代码重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 测试用例修改
        'revert', // 代码回滚
        'build', // 发布版本
        'ci', // 持续集成修改
        'perf', // 优化相关，比如提升性能、体验
        'chore', // 改变构建流程、或者增加依赖库、工具等
      ],
    ],
    'type-empty': [2, 'never'], // 提交不符合规范时,也可以提交,但是会有警告
    'subject-empty': [2, 'never'], // 提交不符合规范时,也可以提交,但是会有警告
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
};
