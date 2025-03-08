import multer from 'multer'
import ExcelJS from 'exceljs'
import { join } from 'path'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import fs from 'fs'
import { createReadStream } from 'fs' // 需要引入文件流
import mytoolsConfig from '../../../mytools.config.js'

const tempDir = mytoolsConfig.tempDir

// === Multer 配置 ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir) // 使用配置目录
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  },
})

// 文件类型过滤（仅允许 Excel/Word）
const fileFilter = (req, file, cb) => {
  const allowedTypes = /xlsx|docx/
  const ext = file.originalname.split('.').pop().toLowerCase()

  if (allowedTypes.test(ext)) {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '仅支持 xlsx/docx 文件'), false)
  }
}

// 创建 Multer 实例
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 限制
})

// === 路由处理函数 ===
async function downloadExcel(req, res) {
  try {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    // 设置样式
    // const boldFont = workbook.addFont({
    //   name: '宋体',
    //   family: 2,
    //   size: 14,
    //   bold: true,
    // })
    worksheet.getCell('B1').value = 'Hola excel'
    worksheet.getCell('B1').font = {
      name: '宋体',
      family: 2,
      size: 14,
      bold: true,
    }

    const tmpFile = join(tempDir, `template-${Date.now()}.xlsx`)
    await workbook.xlsx.writeFile(tmpFile)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx')
    createReadStream(tmpFile).pipe(res)
  } catch (error) {
    console.error(error)
  }
}

async function downloadDocx(req, res) {
  try {
    // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
    // This simple example will only contain one section
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun('Hello World'),
                new TextRun({
                  text: 'Foo Bar',
                  bold: true,
                }),
                new TextRun({
                  text: '\tHola is the best',
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    })

    // 将异步操作改为 await 方式
    const buffer = await Packer.toBuffer(doc)
    const tmpFile = join(tempDir, `template-${Date.now()}.docx`)
    fs.writeFileSync(tmpFile, buffer) // 同步写入文件

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', 'attachment; filename=template.docx')
    createReadStream(tmpFile).pipe(res)
  } catch (error) {
    console.error('生成 Word 文件失败:', error)
    res.status(500).send('文件生成失败')
  }
}

async function uploadExcel(req, res) {
  try {
    console.log('uploadExcel called with req.file.path:', req.file.path)
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(req.file.path)

    // 遍历每个工作表
    // workbook.eachSheet(function (worksheet, sheetId) {
    //   console.log('Sheet ID:', sheetId)
    //   console.log('Sheet name:', worksheet.name)
    //   // ...
    // })

    const value = workbook.getWorksheet(1)?.getCell('A1')?.value
    console.log('Cell value:', value)
    res.json({ content: value })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

async function uploadWord(req, res) {
  res.json({ content: `文件大小：${req.file.size} 字节` })
}

// === 路由注册 ===
export default function (app) {
  console.log('file router init ...')

  // 下载 Excel
  app.get('/api/download-excel', async (req, res) => {
    await downloadExcel(req, res)
  })

  // 下载 Word
  app.get('/api/download-word', async (req, res) => {
    await downloadDocx(req, res)
  })

  // 上传 Excel
  app.post('/api/upload-excel', upload.single('file'), async (req, res) => {
    await uploadExcel(req, res)
  })

  // 上传 Word
  app.post('/api/upload-word', upload.single('file'), async (req, res) => {
    await uploadWord(req, res)
  })

  console.log('file router init ...... OK')
}
