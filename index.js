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
const project_name = (process.argv.slice(2) && process.argv.slice(2).toString()) || 'new-vite-ele'
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
              name: project_name
            }
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString()
              const result = Object.assign(JSON.parse(content), meta)
              fs.writeFileSync(fileName, JSON.stringify(result, null, 2))
            }
            console.log(symbols.success, chalk.green('初始化成功！'))
          }
        }
      )