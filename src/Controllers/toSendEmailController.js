const nodemailer = require("nodemailer");
const xl = require("excel4node");
const path = require("path");

const fs = require('fs');
const { promisify } = require('util');

const wb = new xl.Workbook();
const ws = wb.addWorksheet("REGISTER");

module.exports = {
  async CreateRegister(request, response) {
    const { grupo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, 
      contribuinte_icms="", data_nascimento, endereco, numero, complemento, bairro, 
      cep, cidade, uf, telefone, telefone_celular, email, email_nfe } =  request.body;
     
      const register = [
      {
        grupo,
        razao_social,
        nome_fantasia,
        cpf_cnpj,
        inscricao_estadual,
        contribuinte_icms,
        data_nascimento,
        endereco,
        numero,
        complemento,
        bairro,
        cep,
        cidade,
        uf,
        telefone,
        telefone_celular,
        email,
        email_nfe
      }
    ];
    const headColumnName = [
      "grupo",
      "razao_social",
      "nome_fantasia",
      "cpf_cnpj",
      "inscricao_estadual",
      "contribuinte_icms",
      "data_nascimento",
      "endereco",
      "numero",
      "complemento",
      "bairro",
      "cep",
      "cidade",
      "uf",
      "telefone",
      "telefone_celular",
      "email",
      "email_nfe"
    ];

    let headColumnIndex = 1;
    headColumnName.forEach(heading => {
      ws.cell(1, headColumnIndex++).string(heading.toLocaleUpperCase());
    });

    let rowIndex = 2;
    register.forEach(increment => {
      let columnIndex = 1;
      Object.keys(increment).forEach(columnName => {
        ws.cell(rowIndex, columnIndex++).string(increment[columnName].toLocaleUpperCase());
      });
      rowIndex++;
    });

    wb.write(path.resolve(__dirname, "..", "..", "tmp", 'uploads', "FORMULARIO_DE_CADASTRO.xlsx"));
    
    const transporter = nodemailer.createTransport({
      host: process.env.HOT_SMTP,
      port: process.env.PORT_SMTP,
      secure: false,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASSWORD_SMTP,
      }
    });
  
    const message = {
      from: user= process.env.USER_SMTP,
      to: user= process.env.USER_SMTP,
      replyTo: email,
      subject: `ACUVUE | Solicitação de Cadastro` + ` - ${nome_fantasia.toLocaleUpperCase()}`,
      attachments: [
        {
          filename: "FORMULARIO_DE_CADASTRO.xlsx",
          path: path.resolve(__dirname, "..", "..", "tmp", 'uploads', "FORMULARIO_DE_CADASTRO.xlsx")
        }
      ],
      html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitação de Cadastro</title>

          <!-- Fonts Family -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Poppins&display=swap">
          <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }
            body {
              width: 100vw;
              background: #F0F0F7;
            }
            .content {
              position:relative;
              width: 1440px;
              height: 837px;
            }
            .topo {
              position: absolute;
              width: 1440px;
              height: 368px;
            
              background: #00539B;
            }
            .topo img {
              position: absolute;
              width: 124px;
              height: 28.38px;
              margin: 53.62px 0 0 1234px;
            }
            .topo h1 {
              position: absolute;
              width: 721px;
              height: 42px;
              margin: 175px 0 0 145px;
            
              font-family: 'Archivo';
              font-style: normal;
              font-weight: 700;
              font-size: 2.2rem;
              line-height: 2.6rem;
            
              color: #FFFFFF;
            }
            .content-data {
              position: absolute;
              width: 1188px;
              height: 449px;
              margin: 293px 0 0 126px;
            
              background: #FFFFFF;
              border: 1px solid #C4C4C4;
              border-radius: 8px;
            }
            .content-data strong {
              position: absolute;
              width: 993px;
              height: 143px;
              margin: 176px 0 0 127px;
            
              font-family: 'Archivo';
              font-style: normal;
              font-weight: 700;
              font-size: 3.12rem;
              line-height: 3.81rem;
              text-align: center;
              text-transform: uppercase;
            
              color: rgba(27, 87, 176, 0.81);
            }
          </style>
        </head>
        <body>
          <div class="content">
            <header>
              <div class="topo">
                <img src="./assets/logoAcuvue.svg" alt="Logo ACUVUE!">
                <h1>Solicitação de Cadastro - ACUVUE.</h1>        
              </div>
            </header>
            <div class="content-data">
              <strong>olá recebemos uma solicitação de cadastro, vamos conferir?</strong>
            </div>
          </div>
        </body>
      </html>
      `,
    };
    
    transporter.sendMail(message, function(error) {
      if (error) {
        response.status(400).json({
          message: "Erro: E-mail não enviado com sucesso!!"
        })
      }
    });

    const messageClient = {
      from: user= process.env.USER_SMTP,
      to: email,
      replyTo: user=process.env.USER_SMTP,
      subject: "ACUVUE | Solicitação de Cadastro",
      html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitação de Cadastro</title>

          <!-- Fonts Family -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Inter:wght@700&family=Poppins&display=swap" rel="stylesheet">
          <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }
            body {
              font-family: 'Archivo', sans-serif;
              font-family: 'Inter', sans-serif;
              font-family: 'Poppins', sans-serif;
              width: 100vw;
              background: #F0F0F7;
            }
            .content {
              position:relative;
              width: 1440px;
              height: 837px;
            }
            .topo {
              position: absolute;
              width: 1440px;
              height: 368px;
            
              background: #00539B;
            }
            .topo img {
              position: absolute;
              width: 124px;
              height: 28.38px;
              margin: 53.62px 0 0 1234px;
            }
            .topo h1 {
              position: absolute;
              width: 900px;
              height: 42px;
              margin: 129px 0 0 145px;
            
              font-family: 'Archivo';
              font-style: normal;
              font-weight: 700;
              font-size: 2.2rem;
              line-height: 2.6rem;
            
              color: #FFFFFF;
            }
            .topo h3 {
              position: absolute;
              width: 462.74px;
              height: 52px;
              margin: 188px 0 0 145px;
            
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 400;
              font-size: 1rem;
              line-height: 1.6rem;
            
              color: #FFFFFF;
            }
            .content-data {
              position: absolute;
              width: 1188px;
              height: 449px;
              margin: 293px 0 0 126px;
            
              background: #FFFFFF;
              border: 1px solid #C4C4C4;
              border-radius: 8px;
            }
            .content-data strong {
              position: absolute;
              width: 993px;
              height: 143px;
              margin: 81px 0 0 77px;
            
              font-family: 'Archivo';
              font-style: normal;
              font-weight: 700;
              font-size: 3.06rem;
              line-height: 1.5rem;
            
              color: #4C4766;
            }
            .content-data span {
              position: absolute;
              width: 167px;
              height: 23px;
            
              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              font-size: 1.37rem;
              line-height: 1.6rem;

              color: #C4C4C4;
            }
            .content-data #one {
              margin: 203.92px 0 0 40px;
            
              color: #00DA6D;
            }
            .content-data #two {
              margin: 203.92px 0 0 369px;
            
              color: #00DA6D;
            }
            .content-data #three {
              margin: 190.92px 0 0 689px;

              color: #C4C4C4;
            }
            .content-data #for {
              margin: 190.92px 0 0 994px;
            
              text-align: center;
              color: #C4C4C4;
            }
            .line {
              position: absolute;
              width: 950px;
              height: 6px;
              margin: 267px 0 0 119px;
            
              background: #C4C4C4;
              border: 1px solid #C4C4C4;
            }
            .create {
              position: absolute;
              width: 25px;
              height: 25px;
              margin: 257px 0 0 94px;
            
              background: #00DA6D;
              border-radius: 50%;
            }
            .hover-create {
              position: absolute;
              width: 306px;
              height: 6px;
              margin: 267px 0 0 118px;
            
              background: #00DA6D;
              border: 1px solid #00DA6D;
            }
            .analysis {
              position: absolute;
              width: 25px;
              height: 25px;
              margin: 257px 0 0 420px;
            
              background: #FFFFFF;
              border: 6px solid #00DA6D;
              border-radius: 50%;
            }
            .register {
              position: absolute;
              width: 25px;
              height: 25px;
              margin: 257px 0 0 740px;
            
              background: #FFFFFF;
              border: 3px solid #C4C4C4;
              border-radius: 50%;
            }
            .training {
              position: absolute;
              width: 25px;
              height: 25px;
              margin: 257px 0 0 1068px;
            
              background: #FFFFFF;
              border: 3px solid #C4C4C4;
              border-radius: 50%;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <header>
              <div class="topo">
                <img src="./assets/logoAcuvue.svg" alt="Logo ACUVUE!">
                <h1>Fique atento as etapas do seu cadastro - ACUVUE.</h1>
                <h3>Bem-vindo a rede de empresas credenciadas para trabalhar com Lentes de Contato.</h3> 
              </div>
            </header>
            <div class="content-data">
              <strong>Status</strong>
              <span id="one">EM CRIAÇÃO</span>
              <div class="line"></div>
              <div class="create"></div>
              <div class="hover-create"></div>
              <span id="two">EM ANÁLISE</span>
              <div class="analysis"></div>
              <span id="three">CADASTRO FINALIZADO</span>
              <div class="register"></div>
              <span id="for">AGENDE TREINAMENTO</span>
              <div class="training"></div>
            </div>
          </div>
        </body>
      </html>
      `,
    };
    
    transporter.sendMail(messageClient, function(error) {
      if (error) {
        response.status(400).json({
          message: "Erro: E-mail não enviado com sucesso!!"
        })
      }
    });

    promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", 'uploads', "FORMULARIO_DE_CADASTRO.xlsx"))
    return response.status(201).send();
  }  
}