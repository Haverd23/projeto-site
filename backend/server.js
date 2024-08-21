const express = require('express');
const path = require('path');
const fs = require('fs');
const excel = require('exceljs');
const app = express();
const port = 3000;

// Configura o middleware para lidar com JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Diretório para arquivos estáticos (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, '../public')));

// Diretório onde o arquivo Excel será salvo
const dataDir = path.join(__dirname, '../data');

// Verifica se o diretório existe, se não, cria o diretório
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Rota para o formulário (POST)
app.post('/submit', async (req, res) => {
    const { name, age, grade, school, rating, extra } = req.body;

    // Mapeia os valores da série
    const gradesMap = {
        '5': '5º Ano',
        '6': '6º Ano',
        '7': '7º Ano',
        '8': '8º Ano',
        '9': '9º Ano',
        '1': '1º Ano do Ensino Médio',
        '2': '2º Ano do Ensino Médio',
        '3': '3º Ano do Ensino Médio'
    };

    // Mapeia os dados do formulário
    const data = {
        name,
        age,
        grade: gradesMap[grade] || grade,
        school,
        rating,
        extra
    };

    const filePath = path.join(dataDir, 'feedback.xlsx');
    let workbook;
    let sheet;

    try {
        // Verifica se o arquivo já existe
        if (fs.existsSync(filePath)) {
            workbook = new excel.Workbook();
            await workbook.xlsx.readFile(filePath);
            sheet = workbook.getWorksheet('Feedback');
        } else {
            workbook = new excel.Workbook();
            sheet = workbook.addWorksheet('Feedback');
            // Define o cabeçalho da planilha
            sheet.columns = [
                { header: 'Nome', key: 'name' },
                { header: 'Idade', key: 'age' },
                { header: 'Série', key: 'grade' },
                { header: 'Escola', key: 'school' },
                { header: 'Avaliação', key: 'rating' },
                { header: 'Cursos Extra-Curriculares', key: 'extra' }
            ];
        }

        // Adiciona uma nova linha com os dados do formulário
        sheet.addRow(data);

        // Salva o arquivo Excel
        await workbook.xlsx.writeFile(filePath);

        // Retorna uma resposta JSON para o frontend
        res.json({ message: 'Formulário enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar dados no Excel:', error);
        res.status(500).json({ message: 'Erro ao processar o formulário.' });
    }
});

// Rota para arquivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/form.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/form.html'));
});

app.get('/curiosidades.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/curiosidades.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
