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
    public extractTextFromScannedPDF = async (filePath: string): Promise<any> => {
        const imagesPath = filePath; // O diretório onde as imagens estão localizadas
        let extractedText = '';

        try {
            const imageFiles = await fs.readdir(imagesPath);

            for (const imageFile of imageFiles) {
                const imagePath = path.join(imagesPath, imageFile);
                const buffer = await fs.readFile(imagePath)
                console.log(`Processando imagem ${imagePath}`);
                console.log(buffer)

                const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
                extractedText += text;
            }
        } catch (error) {
            console.error(`Erro ao processar imagens para OCR:`, error);
        }

        return extractedText;
    }

    public searchPDFsInDirectory = async (directoryPath: string, searchTerm: string): Promise<void> => {
        const filesFound: any = []
        try {
            const files = await fs.readdir(directoryPath)
            const pdfFiles = files.filter((file: any) => path.extname(file).toLowerCase() === '.pdf')

            for (const file of pdfFiles) {
                const filePath = path.join(directoryPath, file)
                let text = await this.extractTextFromPDF(filePath)
                if (text.includes(searchTerm))
                    filesFound.push(file)

            }
            return filesFound
        } catch (error) {
            console.error('Erro ao ler o diretório ou processar arquivos:', error);
        }
    }
}

const readerPDF = new PDFContentReader()
const directoryPath = './src/pdfs'
const searchTerm = 'Nacional'


readerPDF.searchPDFsInDirectory(directoryPath, searchTerm)
    .then((files) => console.log(files))
    .catch(error => console.error('Erro durante a pesquisa:', error));

