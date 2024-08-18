import fs from 'node:fs/promises'
import path from 'node:path'
import pdf from 'pdf-parse'
import Tesseract from 'tesseract.js'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'




class PDFContentReader {
    constructor() { }

    public extractTextFromPDF = async (filePath: string): Promise<any> => {
        try {

            const buffer = await fs.readFile(filePath)
            const data = await pdf(buffer)
            return data.text;

        } catch (error) {
            console.log('Error to processar o arquivo PDF ' + filePath + 'Error ' + error)
            return Error('Error to processar o arquivo PDF ' + filePath + 'Error ' + error)

        }
    }
    public extractTextFromScannedPDF = async (imagesPath: string): Promise<any> => {

        let extractedText: string = ''
        const imageFiles = await fs.readFile(imagesPath)

        for (const imageFile in imageFiles) {
            const imagePath = path.join(imagesPath, imageFile)
            console.log('Processando Image ' + imagePath)

            const result = await Tesseract.recognize(imagePath, 'eng')

            extractedText += result.data.text
        }

        return extractedText;
    }

    public searchPDFsInDirectory = async (directoryPath: string, searchTerm: string): Promise<void> => {
        try {
            const files = await fs.readdir(directoryPath)
            const pdfFiles = files.filter((file: any) => file.extname(file).toLowerCase() === '.pdf')

            for (const file of pdfFiles) {
                const filePath = path.join(directoryPath, file)
                console.log('Processando o arquivo ' + filePath)

                let text = await this.extractTextFromPDF(filePath)

                if (text.includes(searchTerm)) {
                    console.log(`Termo "${searchTerm}" encontrado no arquivo ${file}`)
                } else {
                    console.log(`Termo "${searchTerm}" encontrado no arquivo ${file}`)
                }
            }
        } catch (error) {
            console.error('Erro ao ler o diretório ou processar arquivos:', error);
        }
    }
}