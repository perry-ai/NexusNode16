import { Document, Packer, Paragraph, TextRun } from 'docx'

async function createDocx() {
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
}