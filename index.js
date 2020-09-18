#!/usr/bin/env node
const chalk = require('chalk')
const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')
const handlebars = require('handlebars')
const { exec } = require('child_process')
program
  .version(chalk.red(`目前Vitel版本：${require('./package').version}`), '-v, --version')
  .command('init <project_name>')
  .action(project_name => {
    console.log(chalk.green('Vitel!'))
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'author',
          message: '请输入作者名称'
        },
        {
          type: 'input',
          name: 'appId',
          message: '请输入appId(默认为空)'
        }
      ])
      .then(answers => {
        const vitelProcess = ora('正在创建...')
        vitelProcess.start()
        download(
          'direct:https://github.com/MangoTsing/vite-electron-quick.git',
          project_name,
          { clone: true },
          err => {
            if (err) {
              vitelProcess.fail()
              console.log(symbols.error, chalk.red(err))
            } else {
              vitelProcess.succeed()
              const fileName = `${project_name}/package.json`
              const meta = {
                name: project_name,
                author: answers.author
              }
              if (fs.existsSync(fileName)) {
                const content = fs.readFileSync(fileName).toString()
                const result = Object.assign(JSON.parse(content), meta)
                if (answers.appId) {
                    result.build.appId = answers.appId
                }
                fs.writeFileSync(fileName, JSON.stringify(result, null, 2))
              }
              console.log(symbols.success, chalk.green('初始化成功！'))
            }
          }
        )
      })
  })
program
  .command('dev')
  .action(() => {
      exec('yarn dev', function(err, stdout){
          if (err) {
              exec('npm run dev')
          }
      })
  })
program.parse(process.argv)