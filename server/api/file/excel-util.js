import ExcelJS from 'exceljs'
import { join } from 'path'
import fs from 'fs'
import path from 'path'
import mytoolsConfig from '../../../mytools.config.js'

import { cloneRepo, commitChanges, compareCommitDiffs, compareFileDiffs } from '../git/git-use-simple.js'


const tempDir = mytoolsConfig.tempDir

// 读取 Excel 文件
async function readExcelFile(filePath, position, newValue, sheet = 1) {
    console.log('readExcelFile called with filePath:', filePath)
    console.log('readExcelFile called with position:', position)
    // 正则判断position有效
    if (!/^[A-Za-z]+[0-9]+$/.test(position)) {
        throw new Error('Invalid position format')
    }
    try {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(filePath)
        // const value = workbook.getWorksheet(sheet)?.getCell(position)?.value

        // const worksheet = workbook.addWorksheet('Sheet1')
        console.log(newValue)
        workbook.getWorksheet(sheet).getCell(position).value = JSON.stringify(newValue)
        // worksheet.getCell('B1').font = {
        //     name: '宋体',
        //     family: 2,
        //     size: 14,
        //     bold: true,
        // }

        const tmpFile = join(tempDir, `对比报告-${Date.now()}.xlsx`)
        await workbook.xlsx.writeFile(tmpFile)

    } catch (e) {
        console.log(e)
    }
}

async function gitTest() {
    const targetDir = mytoolsConfig.tempDir
    const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, 14)
    const tempProName = 'gitrepo' + timestamp
    const tempProPath = path.join(targetDir, tempProName)
    await cloneRepo('git@github.com:perry-ai/MyTools.git', 'main', tempProPath)
    // 先检出目标分支
    const comlog1 = await compareCommitDiffs(tempProPath, 'origin/test-init', 'origin/main', 100)

    // console.log("comlog1-msg:" + JSON.stringify(comlog1.map(item => item.message)))

    const filedif = await compareFileDiffs(tempProPath, 'origin/test-init', 'origin/main')
    // console.log("filedif:" + JSON.stringify(filedif))

    return { commitChanges: comlog1, fileChanges: filedif }

}


/**
 * 从JSON数据生成Excel文件
 * @param {Object} data 数据对象
 * @param {string} outputPath 输出路径
 */
export async function generateExcelFromJSON(data, outputPath) {
  try {
    const workbook = new ExcelJS.Workbook()
    
    // 添加每个工作表
    data.sheets.forEach(sheet => {
      const worksheet = workbook.addWorksheet(sheet.name)
      
      // 添加表头
      worksheet.addRow(sheet.headers)
      
      // 添加数据行
      sheet.rows.forEach(row => {
        worksheet.addRow(row)
      })
      
      // 设置表头样式
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      }
    })
    
    // 写入文件
    await workbook.xlsx.writeFile(outputPath)
    return true
  } catch (error) {
    console.error('生成Excel失败:', error)
    throw error
  }
}

async function main() {
    
    const res = await gitTest()
    console.log('readExcelFile called with res:', JSON.stringify(res))
    console.log('readExcelFile called with commitChanges:', JSON.stringify(res.commitChanges))
    console.log('readExcelFile called with fileChanges:', JSON.stringify(res.fileChanges))
    const tmpFile = join(tempDir, 'template.xlsx')
    readExcelFile(tmpFile, 'B2', res.commitChanges)


}
// main()
