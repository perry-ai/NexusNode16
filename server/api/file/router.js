import multer from 'multer'
import ExcelJS from 'exceljs'
import { Document, Paragraph, TextRun, LocalPacker } from 'docx' // 需要导入 Packer
import { join } from 'path'
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
  const allowedTypes = /xlsx|xls|docx/
  const ext = file.originalname.split('.').pop().toLowerCase()

  if (allowedTypes.test(ext)) {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '仅支持 Excel/Word 文件'), false)
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
    // todo docx支持待修复
    const doc = new Document()
    const paragraph = new Paragraph('Some cool text heresdalmasldmkasdnjk.')
    doc.addParagraph(paragraph)

    const tmpFile = join(tempDir, `template-${Date.now()}.docx`)
    // 使用 LocalPacker 生成文件
    const packer = new LocalPacker(doc)
    await packer.pack(tmpFile) // 参数为文件路径

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', 'attachment; filename=template.docx')
    createReadStream(tmpFile).pipe(res)
  } catch (error) {
    console.error('生成 Word 文件失败:', error)
    res.status(500).send('文件生成失败')
  }
}

// todo excel文件解析功能待修正
async function handleUploadExcel(req, res) {
  try {
    console.log('handleUploadExcel called with req.file.path:', req.file.path)
    const workbook = new ExcelJS.Workbook()
    // 先判断req.file.path是否存在，如果不存在等1s
    while (!fs.existsSync(req.file.path)) {
      console.log('waiting for file to be created...')
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    await workbook.xlsx.readFile(req.file.path)
    console.log('Workbook loaded successfully')
    console.log('Workbook:', workbook)
    console.log('workbook.xlsx', workbook.xlsx)
    console.log('workbook._xlsx', workbook._xlsx)

    const value = workbook.getWorksheet(0)?.getCell('A1')?.value
    console.log('wbws', workbook?.worksheets)
    console.log('Cell value:', value)
    // console.log('Cell value:', value)
    res.json({ content: value })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

async function handleUploadWord(req, res) {
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
    await handleUploadExcel(req, res)
  })

  // 上传 Word
  app.post('/api/upload-word', upload.single('file'), async (req, res) => {
    await handleUploadWord(req, res)
  })

  console.log('file router init ...... OK')
}
