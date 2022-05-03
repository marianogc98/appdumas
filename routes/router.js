const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const connection = require('../database/db')
const date = require('date-and-time')

//validaciones
const { body, validationResult } = require('express-validator')
//validaciones

//enviar mail
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
//enviar mail

//crear pdf
const PdfPrinter = require('pdfmake')
const fs = require('fs')
const styles = require('../public/styles/styles')
const fonts = require('../public/fonts/fonts')
const { content } = require('../public/content/content')
const printer = new PdfPrinter(fonts)
//crear pdf 

//envolver en helper
function guardarPdf(nacimiento, datos, nombre, dia, beneficios) {
  return new Promise(async (resolve, reject) => {
    if (beneficios[0] == null) {
      let docDefinition = {
        pageSize: { width: 235, height: 345 },
        pageOrientation: 'portrait',

        pageMargins: [20, 20, 20, 20],
        watermark: { text: 'GRUPO DUMAS\n\n', color: 'GREY', opacity: 0.1, bold: true, font: 'Rubik', fontSize: 25 },
        content: [
          {
            columns: [
              {
                image: './public/img/grupo_dumas.png',
                width: 61.427,
                height: 23.833,
                alignment: 'left',
              },
              {

                text: [
                  'Teléfono: ',
                  { text: '351-6786655\n', bold: true },
                  'Ruta Provincial 88 - Km 23,5 \n Monte Cristo, Córdoba, Argentina \n C.P. 5125 \n www.grupodumas.com',

                ],
                alignment: 'right',
                style: 'info'
              }
            ]
          },
          {
            columns: [
              {
                text: `Fecha de creación: ${datos.creacion}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 2, 0, 2]
              },
              {},
              {

                text: 'Contrato N°: ' + `${datos.id_contrato}`,
                alignment: 'right',
                style: 'info',
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ margin: [0, 0, 0, 0], border: [false, false, false, false], text: 'DATOS DEL CONTRATISTA', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],
            }
          },
          {
            columns: [
              {
                text: 'Razón social: Cotbia S.A.',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'CUIT: 30-71508667-7',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Código postal: 5125',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio: Ruta Provincial 88 - kM 23,5',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Localidad: Monte Cristo',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Provincia: Córdoba',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'DATOS DEL COMITENTE', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Nombre y apellido: ' + `${datos.nombre}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]

              },
              {
                text: 'DNI: ' + `${datos.dni}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Fecha de nacimiento: ' + `${nacimiento}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Celular: ' + `${datos.telefono}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Domicilio: ' + `${datos.domicilio}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Localidad: ' + `${datos.localidad}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio electrónico constituido: ' + `${datos.email}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'LÍNEA - TIPOLOGÍA - VALORES', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Línea: ' + `${datos.nombreLinea}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Tipología: ' + `${datos.nombreTipologia}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Zona a edificar: ' + `${datos.zona}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Mts2 contratados: ' + `${datos.mts_contratados}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Valor nominal inicial por m2: ' + `$${datos.mts_valor_inicial}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Aporte mensual comprometido: ' + `$${datos.aporte}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: `Día mensual de pago: ${dia} de cada mes`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Solicita envío cuota: Si',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Contrato Digital: Si',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          content,
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { border: [false, false, false, false], text: ' ' },
                  { border: [false, false, false, false], text: 'GRUPO DUMAS\nCUIT', alignment: 'center' },
                ],
                [
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' }
                ],
                [
                  { border: [false, false, false, false], text: 'Firma del comitente', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], text: 'Firma del contratista', alignment: 'center', style: 'black' }
                ],
              ],
            }
          },
        ],
        defaultStyle: {
          font: 'Sarabun',
          fontSize: 3.6
        },
        styles: styles
      }
      let pdfDoc = printer.createPdfKitDocument(docDefinition)
      await pdfDoc.pipe(fs.createWriteStream(`public/pdfs/Contrato${nombre}.pdf`))
      pdfDoc.end()
      resolve(
        console.log('pdfGuardado')
      )
    } else if (beneficios.length > 1) {
      let string = ''
      string += Object.values(beneficios).join(', ')
      string += '.'
      let docDefinition = {
        pageSize: { width: 235, height: 345 },
        pageOrientation: 'portrait',

        pageMargins: [20, 20, 20, 20],
        watermark: { text: 'GRUPO DUMAS\n\n', color: 'GREY', opacity: 0.1, bold: true, font: 'Rubik', fontSize: 25 },
        content: [
          {
            columns: [
              {
                image: './public/img/grupo_dumas.png',
                width: 61.427,
                height: 23.833,
                alignment: 'left',
              },
              {

                text: [
                  'Teléfono: ',
                  { text: '351-6786655\n', bold: true },
                  'Ruta Provincial 88 - Km 23,5 \n Monte Cristo, Córdoba, Argentina \n C.P. 5125 \n www.grupodumas.com',

                ],
                alignment: 'right',
                style: 'info'
              }
            ]
          },
          {
            columns: [
              {
                text: `Fecha de creación: ${datos.creacion}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 2, 0, 2]
              },
              {},
              {

                text: 'Contrato N°: ' + `${datos.id_contrato}`,
                alignment: 'right',
                style: 'info',
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ margin: [0, 0, 0, 0], border: [false, false, false, false], text: 'DATOS DEL CONTRATISTA', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],
            }
          },
          {
            columns: [
              {
                text: 'Razón social: Cotbia S.A.',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'CUIT: 30-71508667-7',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Código postal: 5125',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio: Ruta Provincial 88 - kM 23,5',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Localidad: Monte Cristo',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Provincia: Córdoba',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'DATOS DEL COMITENTE', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Nombre y apellido: ' + `${datos.nombre}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]

              },
              {
                text: 'DNI: ' + `${datos.dni}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Fecha de nacimiento: ' + `${nacimiento}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Celular: ' + `${datos.telefono}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Domicilio: ' + `${datos.domicilio}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Localidad: ' + `${datos.localidad}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio electrónico constituido: ' + `${datos.email}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'LÍNEA - TIPOLOGÍA - VALORES', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Línea: ' + `${datos.nombreLinea}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Tipología: ' + `${datos.nombreTipologia}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Zona a edificar: ' + `${datos.zona}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Mts2 contratados: ' + `${datos.mts_contratados}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Valor nominal inicial por m2: ' + `$${datos.mts_valor_inicial}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Aporte mensual comprometido: ' + `$${datos.aporte}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                width: 65,
                text: `Día mensual de pago: ${dia} de cada mes`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                width: '*',
                text: `Beneficios: ${string}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          content,
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { border: [false, false, false, false], text: ' ' },
                  { border: [false, false, false, false], text: 'GRUPO DUMAS\nCUIT', alignment: 'center' },
                ],
                [
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' }
                ],
                [
                  { border: [false, false, false, false], text: 'Firma del comitente', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], text: 'Firma del contratista', alignment: 'center', style: 'black' }
                ],
              ],
            }
          },
        ],
        defaultStyle: {
          font: 'Sarabun',
          fontSize: 3.6
        },
        styles: styles
      }
      let pdfDoc = printer.createPdfKitDocument(docDefinition)
      await pdfDoc.pipe(fs.createWriteStream(`public/pdfs/Contrato${nombre}.pdf`))
      pdfDoc.end()
      resolve(
        console.log('pdfGuardado')
      )
    } else {
      let string = ''
      string += beneficios + '.';
      let docDefinition = {
        pageSize: { width: 235, height: 345 },
        pageOrientation: 'portrait',

        pageMargins: [20, 20, 20, 20],
        watermark: { text: 'GRUPO DUMAS\n\n', color: 'GREY', opacity: 0.1, bold: true, font: 'Rubik', fontSize: 25 },
        content: [
          {
            columns: [
              {
                image: './public/img/grupo_dumas.png',
                width: 61.427,
                height: 23.833,
                alignment: 'left',
              },
              {

                text: [
                  'Teléfono: ',
                  { text: '351-6786655\n', bold: true },
                  'Ruta Provincial 88 - Km 23,5 \n Monte Cristo, Córdoba, Argentina \n C.P. 5125 \n www.grupodumas.com',

                ],
                alignment: 'right',
                style: 'info'
              }
            ]
          },
          {
            columns: [
              {
                text: `Fecha de creación: ${datos.creacion}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 2, 0, 2]
              },
              {},
              {

                text: 'Contrato N°: ' + `${datos.id_contrato}`,
                alignment: 'right',
                style: 'info',
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ margin: [0, 0, 0, 0], border: [false, false, false, false], text: 'DATOS DEL CONTRATISTA', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],
            }
          },
          {
            columns: [
              {
                text: 'Razón social: Cotbia S.A.',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'CUIT: 30-71508667-7',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Código postal: 5125',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio: Ruta Provincial 88 - kM 23,5',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Localidad: Monte Cristo',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Provincia: Córdoba',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'DATOS DEL COMITENTE', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Nombre y apellido: ' + `${datos.nombre}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]

              },
              {
                text: 'DNI: ' + `${datos.dni}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Fecha de nacimiento: ' + `${nacimiento}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Celular: ' + `${datos.telefono}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Domicilio: ' + `${datos.domicilio}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Localidad: ' + `${datos.localidad}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio electrónico constituido: ' + `${datos.email}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'LÍNEA - TIPOLOGÍA - VALORES', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Línea: ' + `${datos.nombreLinea}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Tipología: ' + `${datos.nombreTipologia}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Zona a edificar: ' + `${datos.zona}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Mts2 contratados: ' + `${datos.mts_contratados}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Valor nominal inicial por m2: ' + `$${datos.mts_valor_inicial}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Aporte mensual comprometido: ' + `$${datos.aporte}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                width: 65,
                text: `Día mensual de pago: ${dia} de cada mes`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                width: '*',
                text: `Beneficios: ${string}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          content,
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { border: [false, false, false, false], text: ' ' },
                  { border: [false, false, false, false], text: 'GRUPO DUMAS\nCUIT', alignment: 'center' },
                ],
                [
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' }
                ],
                [
                  { border: [false, false, false, false], text: 'Firma del comitente', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], text: 'Firma del contratista', alignment: 'center', style: 'black' }
                ],
              ],
            }
          },
        ],
        defaultStyle: {
          font: 'Sarabun',
          fontSize: 3.6
        },
        styles: styles
      }
      let pdfDoc = printer.createPdfKitDocument(docDefinition)
      await pdfDoc.pipe(fs.createWriteStream(`public/pdfs/Contrato${nombre}.pdf`))
      pdfDoc.end()
      resolve(
        console.log('pdfGuardado')
      )
    }
  })
}

function firmarPdf(nacimiento, datos, nombre, dia, beneficios) {
  return new Promise(async (resolve, reject) => {
    if (beneficios[0] == null) {
      let docDefinition = {
        pageSize: { width: 235, height: 345 },
        pageOrientation: 'portrait',

        pageMargins: [20, 20, 20, 20],
        watermark: { text: 'GRUPO DUMAS\n\n', color: 'GREY', opacity: 0.1, bold: true, font: 'Rubik', fontSize: 25 },
        content: [
          {
            columns: [
              {
                image: './public/img/grupo_dumas.png',
                width: 61.427,
                height: 23.833,
                alignment: 'left',
              },
              {

                text: [
                  'Teléfono: ',
                  { text: '351-6786655\n', bold: true },
                  'Ruta Provincial 88 - Km 23,5 \n Monte Cristo, Córdoba, Argentina \n C.P. 5125 \n www.grupodumas.com',

                ],
                alignment: 'right',
                style: 'info'
              }
            ]
          },
          {
            columns: [
              {
                text: `Fecha de creación: ${datos.creacion}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 2, 0, 2]
              },
              {},
              {

                text: 'Contrato N°: ' + `${datos.id_contrato}`,
                alignment: 'right',
                style: 'info',
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ margin: [0, 0, 0, 0], border: [false, false, false, false], text: 'DATOS DEL CONTRATISTA', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],
            }
          },
          {
            columns: [
              {
                text: 'Razón social: Cotbia S.A.',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'CUIT: 30-71508667-7',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Código postal: 5125',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio: Ruta Provincial 88 - kM 23,5',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Localidad: Monte Cristo',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Provincia: Córdoba',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'DATOS DEL COMITENTE', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Nombre y apellido: ' + `${datos.nombre}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]

              },
              {
                text: 'DNI: ' + `${datos.dni}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Fecha de nacimiento: ' + `${nacimiento}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Celular: ' + `${datos.telefono}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Domicilio: ' + `${datos.domicilio}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Localidad: ' + `${datos.localidad}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio electrónico constituido: ' + `${datos.email}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'LÍNEA - TIPOLOGÍA - VALORES', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Línea: ' + `${datos.nombreLinea}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Tipología: ' + `${datos.nombreTipologia}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Zona a edificar: ' + `${datos.zona}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Mts2 contratados: ' + `${datos.mts_contratados}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Valor nominal inicial por m2: ' + `$${datos.mts_valor_inicial}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Aporte mensual comprometido: ' + `$${datos.aporte}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: `Día mensual de pago: ${dia} de cada mes`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Solicita envío cuota: Si',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Contrato Digital: Si',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          content,
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { border: [false, false, false, false], text: `${datos.nombre}\n${datos.dni}`, alignment: 'center' },
                  { border: [false, false, false, false], text: 'GRUPO DUMAS\nCUIT', alignment: 'center' },
                ],
                [
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' }
                ],
                [
                  { border: [false, false, false, false], text: 'Firma del comitente', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], text: 'Firma del contratista', alignment: 'center', style: 'black' }
                ],
              ],
            }
          },
        ],
        defaultStyle: {
          font: 'Sarabun',
          fontSize: 3.6
        },

        styles: styles
      }
      let pdfDoc = printer.createPdfKitDocument(docDefinition)
      await pdfDoc.pipe(fs.createWriteStream(`public/pdfs/firmados/Contrato${nombre}Firmado.pdf`))
      pdfDoc.end()
      resolve(
        console.log('pdfFirmadoGuardado')
      )
    } else if (beneficios.length > 1) {
      let string = ''
      string += Object.values(beneficios).join(', ')
      string += '.'
      let docDefinition = {
        pageSize: { width: 235, height: 345 },
        pageOrientation: 'portrait',

        pageMargins: [20, 20, 20, 20],
        watermark: { text: 'GRUPO DUMAS\n\n', color: 'GREY', opacity: 0.1, bold: true, font: 'Rubik', fontSize: 25 },
        content: [
          {
            columns: [
              {
                image: './public/img/grupo_dumas.png',
                width: 61.427,
                height: 23.833,
                alignment: 'left',
              },
              {

                text: [
                  'Teléfono: ',
                  { text: '351-6786655\n', bold: true },
                  'Ruta Provincial 88 - Km 23,5 \n Monte Cristo, Córdoba, Argentina \n C.P. 5125 \n www.grupodumas.com',

                ],
                alignment: 'right',
                style: 'info'
              }
            ]
          },
          {
            columns: [
              {
                text: `Fecha de creación: ${datos.creacion}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 2, 0, 2]
              },
              {},
              {

                text: 'Contrato N°: ' + `${datos.id_contrato}`,
                alignment: 'right',
                style: 'info',
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ margin: [0, 0, 0, 0], border: [false, false, false, false], text: 'DATOS DEL CONTRATISTA', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],
            }
          },
          {
            columns: [
              {
                text: 'Razón social: Cotbia S.A.',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'CUIT: 30-71508667-7',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Código postal: 5125',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio: Ruta Provincial 88 - kM 23,5',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Localidad: Monte Cristo',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Provincia: Córdoba',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'DATOS DEL COMITENTE', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Nombre y apellido: ' + `${datos.nombre}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]

              },
              {
                text: 'DNI: ' + `${datos.dni}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Fecha de nacimiento: ' + `${nacimiento}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Celular: ' + `${datos.telefono}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Domicilio: ' + `${datos.domicilio}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Localidad: ' + `${datos.localidad}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio electrónico constituido: ' + `${datos.email}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'LÍNEA - TIPOLOGÍA - VALORES', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Línea: ' + `${datos.nombreLinea}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Tipología: ' + `${datos.nombreTipologia}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Zona a edificar: ' + `${datos.zona}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Mts2 contratados: ' + `${datos.mts_contratados}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Valor nominal inicial por m2: ' + `$${datos.mts_valor_inicial}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Aporte mensual comprometido: ' + `$${datos.aporte}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                width: 65,
                text: `Día mensual de pago: ${dia} de cada mes`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                width: '*',
                text: `Beneficios: ${string}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          content,
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { border: [false, false, false, false], text: `${datos.nombre}\n${datos.dni}`, alignment: 'center' },
                  { border: [false, false, false, false], text: 'GRUPO DUMAS\nCUIT', alignment: 'center' },
                ],
                [
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' }
                ],
                [
                  { border: [false, false, false, false], text: 'Firma del comitente', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], text: 'Firma del contratista', alignment: 'center', style: 'black' }
                ],
              ],
            }
          },
        ],
        defaultStyle: {
          font: 'Sarabun',
          fontSize: 3.6
        },

        styles: styles
      }
      let pdfDoc = printer.createPdfKitDocument(docDefinition)
      await pdfDoc.pipe(fs.createWriteStream(`public/pdfs/firmados/Contrato${nombre}Firmado.pdf`))
      pdfDoc.end()
      resolve(
        console.log('pdfFirmadoGuardado')
      )
    } else {
      let string = ''
      string += beneficios + '.';
      let docDefinition = {
        pageSize: { width: 235, height: 345 },
        pageOrientation: 'portrait',

        pageMargins: [20, 20, 20, 20],
        watermark: { text: 'GRUPO DUMAS\n\n', color: 'GREY', opacity: 0.1, bold: true, font: 'Rubik', fontSize: 25 },
        content: [
          {
            columns: [
              {
                image: './public/img/grupo_dumas.png',
                width: 61.427,
                height: 23.833,
                alignment: 'left',
              },
              {

                text: [
                  'Teléfono: ',
                  { text: '351-6786655\n', bold: true },
                  'Ruta Provincial 88 - Km 23,5 \n Monte Cristo, Córdoba, Argentina \n C.P. 5125 \n www.grupodumas.com',

                ],
                alignment: 'right',
                style: 'info'
              }
            ]
          },
          {
            columns: [
              {
                text: `Fecha de creación: ${datos.creacion}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 2, 0, 2]
              },
              {},
              {

                text: 'Contrato N°: ' + `${datos.id_contrato}`,
                alignment: 'right',
                style: 'info',
                margin: [0, 2, 0, 2]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ margin: [0, 0, 0, 0], border: [false, false, false, false], text: 'DATOS DEL CONTRATISTA', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],
            }
          },
          {
            columns: [
              {
                text: 'Razón social: Cotbia S.A.',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'CUIT: 30-71508667-7',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Código postal: 5125',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio: Ruta Provincial 88 - kM 23,5',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Localidad: Monte Cristo',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Provincia: Córdoba',
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'DATOS DEL COMITENTE', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Nombre y apellido: ' + `${datos.nombre}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]

              },
              {
                text: 'DNI: ' + `${datos.dni}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Fecha de nacimiento: ' + `${nacimiento}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Celular: ' + `${datos.telefono}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Domicilio: ' + `${datos.domicilio}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Localidad: ' + `${datos.localidad}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Domicilio electrónico constituido: ' + `${datos.email}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{ border: [false, false, false, false], text: 'LÍNEA - TIPOLOGÍA - VALORES', fillColor: '#d9292e', color: 'white', style: 'white' }]
              ],

            }
          },
          {
            columns: [
              {
                text: 'Línea: ' + `${datos.nombreLinea}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Tipología: ' + `${datos.nombreTipologia}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Zona a edificar: ' + `${datos.zona}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                text: 'Mts2 contratados: ' + `${datos.mts_contratados}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                text: 'Valor nominal inicial por m2: ' + `$${datos.mts_valor_inicial}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {

                text: 'Aporte mensual comprometido: ' + `$${datos.aporte}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          {
            columns: [
              {
                width: 65,
                text: `Día mensual de pago: ${dia} de cada mes`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              },
              {
                width: '*',
                text: `Beneficios: ${string}`,
                alignment: 'left',
                style: 'info',
                margin: [0, 1, 0, 1]
              }
            ]
          },
          content,
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { border: [false, false, false, false], text: `${datos.nombre}\n${datos.dni}`, alignment: 'center' },
                  { border: [false, false, false, false], text: 'GRUPO DUMAS\nCUIT', alignment: 'center' },
                ],
                [
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], lineHeight: 0, text: '..............................................', alignment: 'center', style: 'black' }
                ],
                [
                  { border: [false, false, false, false], text: 'Firma del comitente', alignment: 'center', style: 'black' },
                  { border: [false, false, false, false], text: 'Firma del contratista', alignment: 'center', style: 'black' }
                ],
              ],
            }
          },
        ],
        defaultStyle: {
          font: 'Sarabun',
          fontSize: 3.6
        },

        styles: styles
      }
      let pdfDoc = printer.createPdfKitDocument(docDefinition)
      await pdfDoc.pipe(fs.createWriteStream(`public/pdfs/firmados/Contrato${nombre}Firmado.pdf`))
      pdfDoc.end()
      resolve(
        console.log('pdfFirmadoGuardado')
      )
    }

  })
}
//

//Login
router.get('/login', (req, res) => {
  res.render('login', { alert: false })
})

//Index
router.get('/', authController.isAuthenticated, authController.cantidadClientes, authController.cantidadClientesContrato, (req, res) => {
  res.render('index', { alert: false, user: req.user, clientes: req.clientes, cantidadClientes: req.cantidadClientes, cantidadClientesContratos: req.cantidadClientesContratos })
})

//Clientes
router.get('/Clientes', authController.isAuthenticated, authController.obtenerClientes, (req, res) => {
  res.render('Clientes', { alert: false, user: req.user, clientes: req.clientes, pagina: req.pagina, iterador: req.iterador, finalLink: req.finalLink, nDePaginas: req.nDePaginas })
})

router.get('/crearCliente', authController.isAuthenticated, authController.isAllowed, async (req, res) => {
  await connection.query('SELECT id_usuario, user FROM usuarios where activo = 1 and id_rol = 2', (error, results) => {
    if (error) {
      console.log(error)
    } else {
      //calcular 18 años hacia atras
      let f = new Date().getTime();
      f = f - 568036800000;
      const d = new Date(f);
      req.fecha = date.format(d, 'YYYY-MM-DD')
      //
      req.usuarios = results
      res.render('crearCliente', { alert: false, user: req.user, fecha: req.fecha, usuarios: req.usuarios })
    }
  })
})

router.get('/editarCliente/:id', authController.isAuthenticated, authController.isAllowed, async (req, res) => {
  const id_cliente = req.params.id
  if (req.user.id_rol == 1) {
    await connection.query('select c.id_cliente,  c.id_usuario, c.nombre as nombreCliente, c.dni, c.email, c.nacimiento, c.telefono, c.num_cuotas, c.domicilio, c.localidad, u.nombre as nombreUsuario,  c.asignado, us.nombre as nombreAsignado from clientes c inner join usuarios u on c.id_usuario = u.id_usuario left join usuarios us on c.asignado = us.id_usuario where c.id_cliente = ?',
      [id_cliente], async (error, results) => {
        if (error) {
          throw error;
        }

        let nacimientoFormat = date.format(results[0].nacimiento, 'YYYY-MM-DD')
        results[0].nacimiento = nacimientoFormat
        let cliente = results[0]
        res.render('editarCliente', { alert: false, cliente: cliente, user: req.user })
      })
  } else {
    await connection.query('SELECT * FROM clientes WHERE id_cliente = ?', [id_cliente], async (error, results) => {
      if (error) {
        throw error;
      }
      let nacimientoFormat = date.format(results[0].nacimiento, 'YYYY-MM-DD')
      results[0].nacimiento = nacimientoFormat
      let cliente = results[0]
      res.render('verCliente', { alert: false, cliente: cliente, user: req.user })

    })
  }
})
//la funcion borrar cliente activa/desactiva los clientes
router.get('/borrarCliente/:id', async (req, res) => {
  const id = req.params.id
  await connection.query('UPDATE clientes SET activo = NOT activo WHERE (id_cliente = ?)', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect('/Clientes')
    }
  })
})
//

//Usuarios
router.get('/Usuarios', authController.isAuthenticated, authController.getUsuarios, (req, res) => {
  res.render('Usuarios', { alert: false, user: req.user, usuarios: req.usuarios, usuario: req.usuario, roles: req.roles })
})

router.get('/crearUsuario', authController.isAuthenticated, authController.isAdmin, (req, res) => {
  //calcular 18 años hacia atras
  let f = new Date().getTime();
  f = f - 568036800000;
  const d = new Date(f);
  req.fecha = date.format(d, 'YYYY-MM-DD')
  //
  res.render('crearUsuario', { alert: false, user: req.user, fecha: req.fecha })
})

router.get('/editarUsuario/:id', authController.isAuthenticated, authController.isAllowed, async (req, res) => {
  const id = req.params.id
  await connection.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (error, results) => {
    if (error) {
      throw error;
    }
    let nacimientoFormat = date.format(results[0].nacimiento, 'YYYY-MM-DD')
    results[0].nacimiento = nacimientoFormat
    res.render('editarUsuario', { alert: false, user: req.user, usuario: results[0] })
  })
})

router.get('/borrarUsuario/:id', async (req, res) => {
  const id = req.params.id
  await connection.query('UPDATE usuarios SET activo = NOT activo WHERE id_usuario = ?', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect('/Usuarios')
    }
  })
})
//


//Contratos
router.get('/crearContrato/:id', authController.isAuthenticated, authController.isAllowed, async (req, res) => {
  const id_usuario = req.user.id_usuario
  const id_cliente = req.params.id
  let queries = [
    'SELECT * FROM lineas where activo = 1',
    'SELECT * FROM tipologias where activo = 1',
    'SELECT * FROM clientes WHERE id_cliente = ?',
    'SELECT * FROM beneficios where activo = 1'
  ]
  await connection.query(queries.join(';'), [id_cliente], (error, results, fields) => {
    if (error) {
      console.log(error)
    } else {
      req.lineas = results[0]
      req.tipologias = results[1]
      req.cliente = results[2][0]
      //let beneficios = Object.entries(results[3])
      let beneficios = results[3]

      //formatear fecha
      let nacimientoFormat = date.format(results[2][0].nacimiento, 'YYYY-MM-DD')
      results[2][0].nacimiento = nacimientoFormat
      //
      res.render('crearContrato', { alert: false, lineas: req.lineas, tipologias: req.tipologias, cliente: req.cliente, usuarioId: id_usuario, beneficios: beneficios, user: req.user })
    }
  })
})

router.get('/verContrato/:id', authController.isAuthenticated, authController.isAllowed, async (req, res) => {
  const id_cliente = req.params.id
  let nombreBeneficio = []
  await connection.query('select ct.id_contrato, ct.created_at, ct.num_contrato, ct.zona, ct.mts_contratados, ct.mts_valor_inicial, ct.aporte, u.nombre as nombreUsuario, c.id_cliente, c.nombre as nombreCliente, c.num_cuotas, l.nombre as nombreLinea, t.nombre as nombreTipologia, b.nombre as nombreBeneficio from contratos ct inner join clientes c on ct.id_cliente = c.id_cliente inner join usuarios u on u.id_usuario = ct.id_usuario inner join lineas l on l.id_linea = ct.id_linea inner join tipologias t on t.id_tipologia = ct.id_tipologia left join contratosbeneficios cb on cb.id_contrato = ct.id_contrato left join beneficios b on cb.id_beneficio = B.id_beneficio where c.id_cliente = ?', [id_cliente], (error, results) => {
    results[0].created_at = date.format(results[0].created_at, 'DD/MM/YYYY HH:MM')
    //saber si los beneficios traidos de la bd son no nulos y mas de uno para guardarlos en un array
    if (results[0].nombreBeneficio != null && results.length > 1) {

      for (let i = 0; i < results.length; i++) {
        nombreBeneficio.push(results[i].nombreBeneficio)
      }
      results[0].nombreBeneficio = nombreBeneficio
    }
    let nombre = results[0].nombreCliente.replace(/\s/g, "")
    let pathContrato = `${__dirname}/../public/pdfs/Contrato${nombre}.pdf`
    let pathContratoFirmado = `${__dirname}/../public/pdfs/firmados/Contrato${nombre}Firmado.pdf`
    let exists = 0
    if(fs.existsSync(pathContratoFirmado)){
      exists = 1
    }else if(fs.existsSync(pathContrato)){
      exists = 2
    }else {
      exists = 0
    }
    console.log(results[0])
    res.render('verContrato', { alert: false, user: req.user, contrato: results[0], nombre: nombre, exists: exists })
  })
})

router.get('/crearPdf/:id', authController.isAuthenticated, authController.isAllowed, async (req, res) => {
  const id_cliente = req.params.id
  await connection.query('SELECT cc.id_contrato, cc.id_cliente, cc.num_contrato, cc.id_linea, cc.id_tipologia, cc.zona, cc.mts_contratados, cc.mts_valor_inicial, cc.aporte, cc.created_at as creacion, c.id_cliente, c.nombre, c.dni, c.email, c.nacimiento, c.telefono, c.domicilio, c.localidad, t.id_tipologia, t.nombre as nombreTipologia, l.id_linea, l.nombre as nombreLinea, b.nombre as nombreBeneficio from contratos cc inner join clientes c on c.id_cliente = cc.id_cliente inner join tipologias t on cc.id_tipologia = t.id_tipologia inner join lineas l on cc.id_linea = l.id_linea left join contratosbeneficios cb on cb.id_contrato = cc.id_contrato left join beneficios b on cb.id_beneficio = b.id_beneficio where cc.id_cliente = ?;',
    [id_cliente], async (error, results) => {
      if (error) {
        console.log(error)
      }

      let datos = results[0]
      let nacimiento = date.format(datos.nacimiento, 'DD/MM/YY')
      let nombre = datos.nombre.replace(/\s/g, "")
      //parsear fecha de creacion
      let dia = datos.creacion
      dia = date.format(dia, 'DD')
      //
      datos.creacion = date.format(datos.creacion, 'DD/MM/YYYY')
      //saber cantidad de beneficios
      let beneficios = []
      if (results.length > 1) {
        for (let i = 0; i < results.length; i++) {
          beneficios.push(results[i].nombreBeneficio)
        }
      } else {
        beneficios.push(results[0].nombreBeneficio)
      }
      //
      await guardarPdf(nacimiento, datos, nombre, dia, beneficios)
        .then(() => {
          try {
            const msg = {
              to: 'caudevilamariano@gmail.com',
              from: 'marianogc98@hotmail.com',
              subject: 'Grupo Dumas',
              text: 'Contrato Adjunto',
              html: `  <style type="text/css">
                            body,
                            p,
                            div {
                              font-family: arial, helvetica, sans-serif;
                              font-size: 14px;
                            }
                        
                            body {
                              color: #ffffff;
                            }
                        
                            body a {
                              color: #d9292e;
                              text-decoration: none;
                            }
                        
                            p {
                              margin: 0;
                              padding: 0;
                            }
                        
                            table.wrapper {
                              width: 100% !important;
                              table-layout: fixed;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              -moz-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                            }
                        
                            img.max-width {
                              max-width: 100% !important;
                            }
                        
                            .column.of-2 {
                              width: 50%;
                            }
                        
                            .column.of-3 {
                              width: 33.333%;
                            }
                        
                            .column.of-4 {
                              width: 25%;
                            }
                        
                            ul ul ul ul {
                              list-style-type: disc !important;
                            }
                        
                            ol ol {
                              list-style-type: lower-roman !important;
                            }
                        
                            ol ol ol {
                              list-style-type: lower-latin !important;
                            }
                        
                            ol ol ol ol {
                              list-style-type: decimal !important;
                            }
                        
                            @media screen and (max-width:480px) {
                        
                              .preheader .rightColumnContent,
                              .footer .rightColumnContent {
                                text-align: left !important;
                              }
                        
                              .preheader .rightColumnContent div,
                              .preheader .rightColumnContent span,
                              .footer .rightColumnContent div,
                              .footer .rightColumnContent span {
                                text-align: left !important;
                              }
                        
                              .preheader .rightColumnContent,
                              .preheader .leftColumnContent {
                                font-size: 80% !important;
                                padding: 5px 0;
                              }
                        
                              table.wrapper-mobile {
                                width: 100% !important;
                                table-layout: fixed;
                              }
                        
                              img.max-width {
                                height: auto !important;
                                max-width: 100% !important;
                              }
                        
                              a.bulletproof-button {
                                display: block !important;
                                width: auto !important;
                                font-size: 80%;
                                padding-left: 0 !important;
                                padding-right: 0 !important;
                              }
                        
                              .columns {
                                width: 100% !important;
                              }
                        
                              .column {
                                display: block !important;
                                width: 100% !important;
                                padding-left: 0 !important;
                                padding-right: 0 !important;
                                margin-left: 0 !important;
                                margin-right: 0 !important;
                              }
                        
                              .social-icon-column {
                                display: inline-block !important;
                              }
                            }
                          </style>
                          <!--user entered Head Start-->
                          <!--End Head user entered-->
                        </head>
                        
                        <body>
                          <center class="wrapper" data-link-color="#932A89"
                            data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#f0f0f0;">
                            <div class="webkit">
                              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
                                <tr>
                                  <td valign="top" bgcolor="#f0f0f0" width="100%">
                                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0"
                                      border="0">
                                      <tr>
                                        <td width="100%">
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td>
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                                  style="width:100%; max-width:620px;" align="center">
                                                  <tr>
                                                    <td role="modules-container"
                                                      style="padding:0px 10px 0px 10px; color:#000000; text-align:left;" bgcolor="#F0F0F0"
                                                      width="100%" align="left">
                                                      <table class="module preheader preheader-hide" role="module" data-type="preheader"
                                                        border="0" cellpadding="0" cellspacing="0" width="100%"
                                                        style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                                        <tr>
                                                          <td role="module-content">
                                                            <p></p>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                                        cellspacing="0" width="100%" style="table-layout: fixed;"
                                                        data-muid="806c535f-a48e-47c3-84e1-e42f460fcd8b" data-mc-module-version="2019-10-22">
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              style="padding:5px 0px 5px 120px; line-height:12px; text-align:inherit; background-color:#f0f0f0;"
                                                              height="100%" valign="top" bgcolor="#f0f0f0" role="module-content">
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                                        role="module" data-type="columns" style="padding:30px 0px 10px 0px;" bgcolor="#F0F0F0"
                                                        data-distribution="1,1">
                                                        <tbody>
                                                          <tr role="module-content">
                                                            <td height="100%" valign="top">
                                                              <table width="300"
                                                                style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                                                cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                                class="column column-0">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style="padding:0px;margin:0px;border-spacing:0;">
                                                                      <table class="wrapper" role="module" data-type="image" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="table-layout: fixed;"
                                                                        data-muid="b61e00de-19e5-4f73-9ecc-b8ea4f872e5c">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;"
                                                                              valign="top" align="left">
                                                                              <img class="max-width" border="0"
                                                                                style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:80% !important; width:80%; height:auto !important;"
                                                                                width="240" alt="" data-proportionally-constrained="true"
                                                                                data-responsive="true"
                                                                                src="../public/img/grupo_dumas.png">
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table width="300"
                                                                style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                                                cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                                class="column column-1">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style="padding:0px;margin:0px;border-spacing:0;">
                                                                      <table class="module" role="module" data-type="spacer" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="table-layout: fixed;"
                                                                        data-muid="1444ebb1-667b-4c9d-a9a5-5bf0e36fcce8">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td style="padding:0px 0px 4px 0px;" role="module-content"
                                                                              bgcolor="">
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                                        cellspacing="0" width="100%" style="table-layout: fixed;"
                                                        data-muid="13d36c46-b515-4bdf-ad3c-edafb5c1c151" data-mc-module-version="2019-10-22">
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              style="padding:20px 15px 15px 15px; line-height:26px; text-align:inherit; background-color:#ffffff;"
                                                              height="100%" valign="top" bgcolor="#d488cc" role="module-content">
                                                              <div>
                                                                <div style="font-family: inherit; text-align: center"><span
                                                                    style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #d9292e; font-size: 24px"><strong>GRUPO &nbsp;DUMAS</strong></span></div>
                                                                <div></div>
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                                        role="module" data-type="columns" style="padding:50px 20px 50px 20px;" bgcolor="#d9292e"
                                                        data-distribution="1">
                                                        <tbody>
                                                          <tr role="module-content">
                                                            <td height="100%" valign="top">
                                                              <table width="460"
                                                                style="width:460px; border-spacing:0; border-collapse:collapse; margin:0px 50px 0px 50px;"
                                                                cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                                class="column column-0">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style="padding:0px;margin:0px;border-spacing:0;">
                                                                      <table class="module" role="module" data-type="text" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="table-layout: fixed;"
                                                                        data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63"
                                                                        data-mc-module-version="2019-10-22">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style="padding:40px 0px 30px 0px; line-height:36px; text-align:inherit; background-color:#d9292e;"
                                                                              height="100%" valign="top" bgcolor="#d9292e"
                                                                              role="module-content">
                                                                              <div>
                                                                                <div style="font-family: inherit; text-align: center"><span
                                                                                    style="font-size: 46px; color: #ffffff; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif"><strong>CONTRATO</strong></span></div>
                                                                                <div></div>
                                                                              </div>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                      <table class="module" role="module" data-type="text" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="table-layout: fixed;"
                                                                        data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63.2"
                                                                        data-mc-module-version="2019-10-22">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style="padding:50px 30px 30px 30px; line-height:28px; text-align:inherit; background-color:#ffffff;"
                                                                              height="100%" valign="top" bgcolor="#ffffff"
                                                                              role="module-content">
                                                                              <div>
                                                                                <div style="font-family: inherit; text-align: inherit"><span
                                                                                    style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Hola
                                                                                    ${datos.nombre}</span></div>
                                                                                <div style="font-family: inherit; text-align: inherit"><br>
                                                                                </div>
                                                                                <div style="font-family: inherit; text-align: inherit"><span
                                                                                    style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Acá está tu contrato, haz click en el siguiente botón para descargarlo.</span>
                                                                                    <div></div>
                                                                                    <a href="http://localhost:3000/descargarPdf/${nombre}" style="background-color:#d9292e; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:15px 25px 15px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:trebuchet ms,helvetica,sans-serif;"
                                                                                        target="_blank">Descargar Contrato</a><br>
                                                                                        <div></div>
                                                                                    <span style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Una vez que lo hayas leído, y si todos los datos son correctos clickeá el siguiente botón para dejar asentado que aceptas el acuerdo.</span></div>
                                                                                    <a href="http://localhost:3000/aceptar/${datos.id_cliente}" style="background-color:#d9292e; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:15px 25px 15px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:trebuchet ms,helvetica,sans-serif;"
                                                                                        target="_blank">Aceptar Contrato</a>
                                                                                    <div></div>
                                                                              </div>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                        
                                                                      <table class="module" role="module" data-type="text" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="table-layout: fixed;"
                                                                        data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63.1"
                                                                        data-mc-module-version="2019-10-22">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style="padding:40px 100px 50px 30px; line-height:26px; text-align:inherit; background-color:#FFFFFF;"
                                                                              height="100%" valign="top" bgcolor="#FFFFFF"
                                                                              role="module-content">
                                                                              <div>
                                                                                <div style="font-family: inherit; text-align: inherit"><span
                                                                                    style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Gracias!</span>
                                                                                </div>
                                                                                <div style="font-family: inherit; text-align: inherit"><span
                                                                                    style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Grupo Dumas. Buenas Raíces.</span></div>
                                                                                <div></div>
                                                                              </div>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                                        role="module" data-type="columns" style="padding:40px 0px 1px 0px;" bgcolor="#F0F0F0"
                                                        data-distribution="1">
                                                        <tbody>
                                                          <tr role="module-content">
                                                            <td height="100%" valign="top">
                                                              <table width="580"
                                                                style="width:580px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;"
                                                                cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                                class="column column-0">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style="padding:0px;margin:0px;border-spacing:0;">
                                                                      <table class="module" role="module" data-type="social" align="center"
                                                                        border="0" cellpadding="0" cellspacing="0" width="100%"
                                                                        style="table-layout: fixed;"
                                                                        data-muid="da66730a-c885-4e7b-bda0-4df5c4f2ce23">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td valign="top"
                                                                              style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px;"
                                                                              align="center">
                                                                              <table align="center"
                                                                                style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
                                                                                <tbody>
                                                                                  <tr align="center">
                                                                                    <td style="padding: 0px 5px;" class="social-icon-column">
                                                                                      <a role="social-icon-link"
                                                                                        href="https://www.facebook.com/grupodumas"
                                                                                        target="_blank" alt="Facebook" title="Facebook"
                                                                                        style="display:inline-block; background-color:#d9292e; height:21px; width:21px;">
                                                                                        <img role="social-icon" alt="Facebook" title="Facebook"
                                                                                          src="https://mc.sendgrid.com/assets/social/white/facebook.png"
                                                                                          style="height:21px; width:21px;" height="21"
                                                                                          width="21">
                                                                                      </a>
                                                                                    </td>
                                                                                    <td style="padding: 0px 5px;" class="social-icon-column">
                                                                                      <a role="social-icon-link"
                                                                                        href="https://www.instagram.com/grupodumas_/"
                                                                                        target="_blank" alt="Instagram" title="Instagram"
                                                                                        style="display:inline-block; background-color:#d9292e; height:21px; width:21px;">
                                                                                        <img role="social-icon" alt="Instagram"
                                                                                          title="Instagram"
                                                                                          src="https://mc.sendgrid.com/assets/social/white/instagram.png"
                                                                                          style="height:21px; width:21px;" height="21"
                                                                                          width="21">
                                                                                      </a>
                                                                                    </td>
                                                                                  </tr>
                                                                                </tbody>
                                                                              </table>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                                <!--[if mso]>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </center>
                                                    <![endif]-->
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </center>
                        </body>`
            }
            sgMail
              .send(msg)
              .then(() => {
                console.log('Email enviado')
              })
              .catch((error) => {
                console.error(error)
              })

            res.redirect('/Clientes')
          } catch (error) {
            console.log(error)
          }
        })
        .catch(e => console.log(e))
    })
})

router.get('/aceptar/:id', async (req, res) => {
  const id_cliente = req.params.id
  await connection.query('SELECT cc.id_contrato, cc.id_cliente, cc.num_contrato, cc.id_linea, cc.id_tipologia, cc.zona, cc.mts_contratados, cc.mts_valor_inicial, cc.aporte, cc.created_at as creacion, c.id_cliente, c.nombre, c.dni, c.email, c.nacimiento, c.telefono, c.domicilio, c.localidad, t.id_tipologia, t.nombre as nombreTipologia, l.id_linea, l.nombre as nombreLinea, b.nombre as nombreBeneficio from contratos cc inner join clientes c on c.id_cliente = cc.id_cliente inner join tipologias t on cc.id_tipologia = t.id_tipologia inner join lineas l on cc.id_linea = l.id_linea left join contratosbeneficios cb on cb.id_contrato = cc.id_contrato left join beneficios b on cb.id_beneficio = b.id_beneficio where cc.id_cliente = ?;',
    [id_cliente], async (error, results) => {
      if (error) {
        console.log(error)
      }
      let datos = results[0]
      let nacimiento = date.format(datos.nacimiento, 'DD/MM/YY')
      let nombre = datos.nombre.replace(/\s/g, "")
      //saber dia
      let dia = datos.creacion
      dia = date.format(dia, 'DD')
      //
      datos.creacion = date.format(datos.creacion, 'DD/MM/YYYY')
      //beneficios
      let beneficios = []
      if (results.length > 1) {
        for (let i = 0; i < results.length; i++) {
          beneficios.push(results[i].nombreBeneficio)
        }
      } else {
        beneficios.push(results[0].nombreBeneficio)
      }
      //
      await firmarPdf(nacimiento, datos, nombre, dia, beneficios)
        .then(() => {
          try {
            const msg = {
              to: 'caudevilamariano@gmail.com',
              from: 'marianogc98@hotmail.com',
              subject: 'Grupo Dumas',
              text: 'Contrato Adjunto',
              html: `  <style type="text/css">
              body,
              p,
              div {
                font-family: arial, helvetica, sans-serif;
                font-size: 14px;
              }
          
              body {
                color: #ffffff;
              }
          
              body a {
                color: #d9292e;
                text-decoration: none;
              }
          
              p {
                margin: 0;
                padding: 0;
              }
          
              table.wrapper {
                width: 100% !important;
                table-layout: fixed;
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: 100%;
                -moz-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
          
              img.max-width {
                max-width: 100% !important;
              }
          
              .column.of-2 {
                width: 50%;
              }
          
              .column.of-3 {
                width: 33.333%;
              }
          
              .column.of-4 {
                width: 25%;
              }
          
              ul ul ul ul {
                list-style-type: disc !important;
              }
          
              ol ol {
                list-style-type: lower-roman !important;
              }
          
              ol ol ol {
                list-style-type: lower-latin !important;
              }
          
              ol ol ol ol {
                list-style-type: decimal !important;
              }
          
              @media screen and (max-width:480px) {
          
                .preheader .rightColumnContent,
                .footer .rightColumnContent {
                  text-align: left !important;
                }
          
                .preheader .rightColumnContent div,
                .preheader .rightColumnContent span,
                .footer .rightColumnContent div,
                .footer .rightColumnContent span {
                  text-align: left !important;
                }
          
                .preheader .rightColumnContent,
                .preheader .leftColumnContent {
                  font-size: 80% !important;
                  padding: 5px 0;
                }
          
                table.wrapper-mobile {
                  width: 100% !important;
                  table-layout: fixed;
                }
          
                img.max-width {
                  height: auto !important;
                  max-width: 100% !important;
                }
          
                a.bulletproof-button {
                  display: block !important;
                  width: auto !important;
                  font-size: 80%;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                }
          
                .columns {
                  width: 100% !important;
                }
          
                .column {
                  display: block !important;
                  width: 100% !important;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  margin-left: 0 !important;
                  margin-right: 0 !important;
                }
          
                .social-icon-column {
                  display: inline-block !important;
                }
              }
            </style>
            <!--user entered Head Start-->
            <!--End Head user entered-->
          </head>
          
          <body>
            <center class="wrapper" data-link-color="#932A89"
              data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#f0f0f0;">
              <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
                  <tr>
                    <td valign="top" bgcolor="#f0f0f0" width="100%">
                      <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0"
                        border="0">
                        <tr>
                          <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td>
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                    style="width:100%; max-width:620px;" align="center">
                                    <tr>
                                      <td role="modules-container"
                                        style="padding:0px 10px 0px 10px; color:#000000; text-align:left;" bgcolor="#F0F0F0"
                                        width="100%" align="left">
                                        <table class="module preheader preheader-hide" role="module" data-type="preheader"
                                          border="0" cellpadding="0" cellspacing="0" width="100%"
                                          style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                          <tr>
                                            <td role="module-content">
                                              <p></p>
                                            </td>
                                          </tr>
                                        </table>
                                        <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                          cellspacing="0" width="100%" style="table-layout: fixed;"
                                          data-muid="806c535f-a48e-47c3-84e1-e42f460fcd8b" data-mc-module-version="2019-10-22">
                                          <tbody>
                                            <tr>
                                              <td
                                                style="padding:5px 0px 5px 120px; line-height:12px; text-align:inherit; background-color:#f0f0f0;"
                                                height="100%" valign="top" bgcolor="#f0f0f0" role="module-content">
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                          role="module" data-type="columns" style="padding:30px 0px 10px 0px;" bgcolor="#F0F0F0"
                                          data-distribution="1,1">
                                          <tbody>
                                            <tr role="module-content">
                                              <td height="100%" valign="top">
                                                <table width="300"
                                                  style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                                  cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                  class="column column-0">
                                                  <tbody>
                                                    <tr>
                                                      <td style="padding:0px;margin:0px;border-spacing:0;">
                                                        <table class="wrapper" role="module" data-type="image" border="0"
                                                          cellpadding="0" cellspacing="0" width="100%"
                                                          style="table-layout: fixed;"
                                                          data-muid="b61e00de-19e5-4f73-9ecc-b8ea4f872e5c">
                                                          <tbody>
                                                            <tr>
                                                              <td
                                                                style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;"
                                                                valign="top" align="left">
                                                                <img class="max-width" border="0"
                                                                  style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:80% !important; width:80%; height:auto !important;"
                                                                  width="240" alt="" data-proportionally-constrained="true"
                                                                  data-responsive="true"
                                                                  src="../public/img/grupo_dumas.png">
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                                <table width="300"
                                                  style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                                  cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                  class="column column-1">
                                                  <tbody>
                                                    <tr>
                                                      <td style="padding:0px;margin:0px;border-spacing:0;">
                                                        <table class="module" role="module" data-type="spacer" border="0"
                                                          cellpadding="0" cellspacing="0" width="100%"
                                                          style="table-layout: fixed;"
                                                          data-muid="1444ebb1-667b-4c9d-a9a5-5bf0e36fcce8">
                                                          <tbody>
                                                            <tr>
                                                              <td style="padding:0px 0px 4px 0px;" role="module-content"
                                                                bgcolor="">
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                          cellspacing="0" width="100%" style="table-layout: fixed;"
                                          data-muid="13d36c46-b515-4bdf-ad3c-edafb5c1c151" data-mc-module-version="2019-10-22">
                                          <tbody>
                                            <tr>
                                              <td
                                                style="padding:20px 15px 15px 15px; line-height:26px; text-align:inherit; background-color:#ffffff;"
                                                height="100%" valign="top" bgcolor="#d488cc" role="module-content">
                                                <div>
                                                  <div style="font-family: inherit; text-align: center"><span
                                                      style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #d9292e; font-size: 24px"><strong>GRUPO &nbsp;DUMAS</strong></span></div>
                                                  <div></div>
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                          role="module" data-type="columns" style="padding:50px 20px 50px 20px;" bgcolor="#d9292e"
                                          data-distribution="1">
                                          <tbody>
                                            <tr role="module-content">
                                              <td height="100%" valign="top">
                                                <table width="460"
                                                  style="width:460px; border-spacing:0; border-collapse:collapse; margin:0px 50px 0px 50px;"
                                                  cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                  class="column column-0">
                                                  <tbody>
                                                    <tr>
                                                      <td style="padding:0px;margin:0px;border-spacing:0;">
                                                        <table class="module" role="module" data-type="text" border="0"
                                                          cellpadding="0" cellspacing="0" width="100%"
                                                          style="table-layout: fixed;"
                                                          data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63"
                                                          data-mc-module-version="2019-10-22">
                                                          <tbody>
                                                            <tr>
                                                              <td
                                                                style="padding:40px 0px 30px 0px; line-height:36px; text-align:inherit; background-color:#d9292e;"
                                                                height="100%" valign="top" bgcolor="#d9292e"
                                                                role="module-content">
                                                                <div>
                                                                  <div style="font-family: inherit; text-align: center"><span
                                                                      style="font-size: 46px; color: #ffffff; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif"><strong>CONTRATO</strong></span></div>
                                                                  <div></div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                        <table class="module" role="module" data-type="text" border="0"
                                                          cellpadding="0" cellspacing="0" width="100%"
                                                          style="table-layout: fixed;"
                                                          data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63.2"
                                                          data-mc-module-version="2019-10-22">
                                                          <tbody>
                                                            <tr>
                                                              <td
                                                                style="padding:50px 30px 30px 30px; line-height:28px; text-align:inherit; background-color:#ffffff;"
                                                                height="100%" valign="top" bgcolor="#ffffff"
                                                                role="module-content">
                                                                <div>
                                                                  <div style="font-family: inherit; text-align: inherit"><span
                                                                      style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Hola
                                                                      ${datos.nombre}</span></div>
                                                                  <div style="font-family: inherit; text-align: inherit"><br>
                                                                  </div>
                                                                  <div style="font-family: inherit; text-align: inherit"><span
                                                                      style="font-size: 20px; font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; color: #656565">Acá esta tu contrato firmado, haz click en el siguiente botón para descargarlo.</span>
                                                                      <div></div>
                                                                      <a href="http://localhost:3000/descargarPdfFirmado/${nombre}" style="background-color:#d9292e; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:15px 25px 15px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:trebuchet ms,helvetica,sans-serif;"
                                                                          target="_blank">Descargar Contrato</a><br>
                                                                          <div></div>
                                                                      <div></div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
          
                                                        <table class="module" role="module" data-type="text" border="0"
                                                          cellpadding="0" cellspacing="0" width="100%"
                                                          style="table-layout: fixed;"
                                                          data-muid="efe5a2c4-1b11-49e7-889d-856d80b40f63.1"
                                                          data-mc-module-version="2019-10-22">
                                                          <tbody>
                                                            <tr>
                                                              <td
                                                                style="padding:40px 100px 50px 30px; line-height:26px; text-align:inherit; background-color:#FFFFFF;"
                                                                height="100%" valign="top" bgcolor="#FFFFFF"
                                                                role="module-content">
                                                                <div>
                                                                  <div style="font-family: inherit; text-align: inherit"><span
                                                                      style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Gracias!</span>
                                                                  </div>
                                                                  <div style="font-family: inherit; text-align: inherit"><span
                                                                      style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 16px; color: #656565">Grupo Dumas. Buenas Raíces.</span></div>
                                                                  <div></div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                          role="module" data-type="columns" style="padding:40px 0px 1px 0px;" bgcolor="#F0F0F0"
                                          data-distribution="1">
                                          <tbody>
                                            <tr role="module-content">
                                              <td height="100%" valign="top">
                                                <table width="580"
                                                  style="width:580px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;"
                                                  cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                                  class="column column-0">
                                                  <tbody>
                                                    <tr>
                                                      <td style="padding:0px;margin:0px;border-spacing:0;">
                                                        <table class="module" role="module" data-type="social" align="center"
                                                          border="0" cellpadding="0" cellspacing="0" width="100%"
                                                          style="table-layout: fixed;"
                                                          data-muid="da66730a-c885-4e7b-bda0-4df5c4f2ce23">
                                                          <tbody>
                                                            <tr>
                                                              <td valign="top"
                                                                style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px;"
                                                                align="center">
                                                                <table align="center"
                                                                  style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
                                                                  <tbody>
                                                                    <tr align="center">
                                                                      <td style="padding: 0px 5px;" class="social-icon-column">
                                                                        <a role="social-icon-link"
                                                                          href="https://www.facebook.com/grupodumas"
                                                                          target="_blank" alt="Facebook" title="Facebook"
                                                                          style="display:inline-block; background-color:#d9292e; height:21px; width:21px;">
                                                                          <img role="social-icon" alt="Facebook" title="Facebook"
                                                                            src="https://mc.sendgrid.com/assets/social/white/facebook.png"
                                                                            style="height:21px; width:21px;" height="21"
                                                                            width="21">
                                                                        </a>
                                                                      </td>
                                                                      <td style="padding: 0px 5px;" class="social-icon-column">
                                                                        <a role="social-icon-link"
                                                                          href="https://www.instagram.com/grupodumas_/"
                                                                          target="_blank" alt="Instagram" title="Instagram"
                                                                          style="display:inline-block; background-color:#d9292e; height:21px; width:21px;">
                                                                          <img role="social-icon" alt="Instagram"
                                                                            title="Instagram"
                                                                            src="https://mc.sendgrid.com/assets/social/white/instagram.png"
                                                                            style="height:21px; width:21px;" height="21"
                                                                            width="21">
                                                                        </a>
                                                                      </td>
                                                                    </tr>
                                                                  </tbody>
                                                                </table>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  <!--[if mso]>
                                            </td>
                                          </tr>
                                        </table>
                                      </center>
                                      <![endif]-->
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </center>
          </body>`
            }
            sgMail
              .send(msg)
              .then(() => {
                console.log('Email enviado')
              })
              .catch((error) => {
                console.error(error)
              })
            res.render('Gracias')
          } catch (error) {
            console.log(error)
          }
        })
        .catch(e => console.log(e))
    })
})

router.get('/descargarPdf/:nombre', (req, res) => {
  let nombre = req.params.nombre
  let file = `${__dirname}/../public/pdfs/Contrato${nombre}.pdf`
  res.download(file, function (err) {
    if (err) {
      console.log("Error");
      console.log(err);
    } else {
      console.log(`El cliente ${nombre} descargo el pdf`);
    }
  });
})

router.get('/descargarPdfFirmado/:nombre', (req, res) => {
  let nombre = req.params.nombre
  let file = `${__dirname}/../public/pdfs/firmados/Contrato${nombre}Firmado.pdf`
  res.download(file, function (err) {
    if (err) {
      console.log("Error");
      console.log(err);
    } else {
      console.log(`El cliente ${nombre} descargo el pdf`);
    }
  });
})
//

//Beneficios
router.get('/Beneficios', authController.isAuthenticated, authController.getBeneficios, async (req, res) => {
  res.render('Beneficios', { alert: false, user: req.user, beneficios: req.beneficios })
})

router.get('/crearBeneficio', authController.isAuthenticated, authController.isAllowed, (req, res) => {
  res.render('crearBeneficio', { alert: false, user: req.user })
})

router.get('/alternarBeneficio/:id', (req, res) => {
  const id = req.params.id
  connection.query('UPDATE beneficios set activo = NOT activo where id_beneficio = ?', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect('/Beneficios')
    }
  })
})
//

//Lineas
router.get('/Lineas', authController.isAuthenticated, authController.getLineas, async (req, res) => {
  res.render('Lineas', { alert: false, user: req.user, lineas: req.lineas })
})

router.get('/crearLinea', authController.isAuthenticated, authController.isAllowed, (req, res) => {
  res.render('crearLinea', { alert: false, user: req.user })
})

router.get('/alternarLinea/:id', (req, res) => {
  const id = req.params.id
  connection.query('UPDATE lineas set activo = NOT activo where id_linea = ?', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect('/Lineas')
    }
  })
})
//

//Tipologias
router.get('/Tipologias', authController.isAuthenticated, authController.getTipologias, async (req, res) => {
  res.render('Tipologias', { alert: false, user: req.user, tipologias: req.tipologias })
})

router.get('/crearTipologia', authController.isAuthenticated, authController.isAllowed, (req, res) => {
  res.render('crearTipologia', { alert: false, user: req.user })
})

router.get('/alternarTipologia/:id', (req, res) => {
  const id = req.params.id
  connection.query('UPDATE tipologias set activo = NOT activo where id_tipologia = ?', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect('/Tipologias')
    }
  })
})
//


//router para los metodos
router.post('/crearUsuario', authController.isAuthenticated, [
  body('nombre')
    .not().isEmpty()
    .withMessage('El nombre no puede estar vacio.'),
  body('user')
    .not().isEmpty()
    .withMessage('El nombre de usuario no puede estar vacio'),
  body('email')
    .not().isEmpty()
    .withMessage('El Email no puede estar vacio')
    .isEmail()
    .withMessage('El Email no tiene el formato correcto')
    .normalizeEmail({ all_lowercase: true }),
  body('dni')
    .not().isEmpty()
    .withMessage('El dni no puede estar vacio'),
  body('pass')
    .not().isEmpty()
    .withMessage('La contraseña no puede estar vacia'),
  body('tel')
    .not().isEmpty()
    .withMessage('El telefono no puede estar vacio'),
  body('domicilio')
    .not().isEmpty()
    .withMessage('El domicilio no puede estar vacio'),
  body('localidad')
    .not().isEmpty()
    .withMessage('La localidad no puede estar vacia'),
  body('rol')
    .not().isEmpty()
    .withMessage('El rol no puede estar vacio'),
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const valores = req.body
    const validaciones = errors.array()
    res.render('crearUsuario', { user: req.user, fecha: req.body.fecha, alert: false, validaciones: validaciones, valores: valores })
  } else {
    return next()
  }
}, authController.validarUserEmail, authController.validarUserName, authController.validarUserDni, authController.crearUsuario)
router.post('/crearCliente', authController.isAuthenticated, authController.getVendedores, [
  body('nombre')
    .not().isEmpty()
    .withMessage('El nombre no puede estar vacio.'),
  body('dni')
    .not().isEmpty()
    .withMessage('El dni no puede estar vacio'),
  body('email')
    .not().isEmpty()
    .withMessage('El Email no puede estar vacio')
    .isEmail()
    .withMessage('El Email no tiene el formato correcto')
    .normalizeEmail({ all_lowercase: true }),
  body('telefono')
    .not().isEmpty()
    .withMessage('El telefono no puede estar vacio'),
  body('domicilio')
    .not().isEmpty()
    .withMessage('El domicilio no puede estar vacio'),
  body('localidad')
    .not().isEmpty()
    .withMessage('La localidad no puede estar vacia'),
    body('num_cuotas')
    .not().isEmpty()
    .withMessage('La cantidad de cuotas no puede estar vacia.')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const valores = req.body
    const validaciones = errors.array()
    res.render('crearCliente', { user: req.user, fecha: req.body.nacimiento, alert: false, usuarios:req.usuarios, validaciones: validaciones, valores: valores })
  } else {
    return next()
  }
}, authController.isAuthenticated, authController.validarClienteEmail, authController.validarClienteDni, authController.crearCliente)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/editarCliente', authController.isAuthenticated, [
  body('nombreCliente')
    .not().isEmpty()
    .withMessage('El nombre no puede estar vacio.'),
  body('dni')
    .not().isEmpty()
    .withMessage('El dni no puede estar vacio'),
  body('email')
    .not().isEmpty()
    .withMessage('El Email no puede estar vacio')
    .isEmail()
    .withMessage('El Email no tiene el formato correcto')
    .normalizeEmail({ all_lowercase: true }),
  body('telefono')
    .not().isEmpty()
    .withMessage('El telefono no puede estar vacio'),
  body('domicilio')
    .not().isEmpty()
    .withMessage('El domicilio no puede estar vacio'),
  body('localidad')
    .not().isEmpty()
    .withMessage('La localidad no puede estar vacia'),
  body('num_cuotas')
    .not().isEmpty()
    .withMessage('La cantidad de cuotas no puede estar vacia.')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const valores = req.body
    const validaciones = errors.array()
    res.render('editarCliente', { user: req.user, alert: false, validaciones: validaciones, cliente: valores })
  } else {
    return next()
  }
}, authController.editarCliente)
router.post('/editarUsuario', authController.isAuthenticated, [
  body('nombre')
    .not().isEmpty()
    .withMessage('El nombre no puede estar vacio.'),
  body('user')
    .not().isEmpty()
    .withMessage('El nombre de usuario no puede estar vacio'),
  body('email')
    .not().isEmpty()
    .withMessage('El Email no puede estar vacio')
    .isEmail()
    .withMessage('El Email no tiene el formato correcto')
    .normalizeEmail({ all_lowercase: true }),
  body('dni')
    .not().isEmpty()
    .withMessage('El dni no puede estar vacio'),
  body('telefono')
    .not().isEmpty()
    .withMessage('El telefono no puede estar vacio'),
  body('domicilio')
    .not().isEmpty()
    .withMessage('El domicilio no puede estar vacio'),
  body('localidad')
    .not().isEmpty()
    .withMessage('La localidad no puede estar vacia'),
  body('id_rol')
    .not().isEmpty()
    .withMessage('El rol no puede estar vacio'),
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const valores = req.body
    const validaciones = errors.array()
    res.render('editarUsuario', { user: req.user, fecha: req.body.fecha, alert: false, validaciones: validaciones, usuario: valores })
  } else {
    return next()
  }
}, authController.validarUserEmailEdit, authController.validarUserDniEdit, authController.validarUserNameEdit, authController.editarUsuario)
router.post('/crearBeneficio', [
  body('nombre', 'El nombre no puede estar vacio').not().isEmpty()], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const valores = req.body
      const validaciones = errors.array()
      res.render('crearBeneficio', { alert: false, validaciones: validaciones, valores: valores })
    } else {
      return next()
    }
  }, authController.crearBeneficio)
router.post('/crearLinea', [
  body('nombre', 'El nombre no puede estar vacio')
    .not().isEmpty()
    .isLength({ min: 2, max: 4 }).withMessage('El nombre debe tener 4 caracteres como máximo')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const valores = req.body
    const validaciones = errors.array()
    res.render('crearLinea', { alert: false, validaciones: validaciones, valores: valores })
  } else {
    return next()
  }
}, authController.crearLinea)
router.post('/crearTipologia', [
  body('nombre', 'El nombre no puede estar vacio').not().isEmpty()], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const valores = req.body
      const validaciones = errors.array()
      res.render('crearTipologia', { alert: false, validaciones: validaciones, valores: valores })
    } else {
      return next()
    }
  }, authController.crearTipologia)
router.post('/crearContrato', authController.isAuthenticated,
authController.obtenerLineas, authController.obtenerTipologias, 
authController.obtenerBeneficios, authController.validarNumContrato, [
  body('num_contrato')
    .not().isEmpty()
    .withMessage('El numero de contrato no puede estar vacio'),
  body('linea')
    .not().isEmpty()
    .withMessage('La línea no puede estar vacía'),
  body('tipologia')
    .not().isEmpty()
    .withMessage('La tipología no puede estar vacía'),
  body('zona')
    .not().isEmpty()
    .withMessage('La zona no puede estar vacia'),
  body('contratados')
    .not().isEmpty()
    .withMessage('Los mts2 contratados no pueden estar vacios.'),
  body('inicial')
    .not().isEmpty()
    .withMessage('Los mts2 iniciales no pueden estar vacios.'),
  body('aporte')
    .not().isEmpty()
    .withMessage('El aporte no puede estar vacio'),
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const valores = req.body
    const validaciones = errors.array()  
    req.body.zona = req.body.zona.trim()
    res.render('crearContrato', { 
      user: req.user, alert: false, valores: valores,
      validaciones: validaciones, cliente: valores,
      usuarioId: valores.id_usuario, lineas: req.lineas,
      tipologias: req.tipologias, beneficios: req.beneficios      
    })
  } else {
    req.body.zona = req.body.zona.trim()
    return next()
  }
}, authController.crearContrato)

router.get('*', authController.isAuthenticated, authController.isAllowed, (req, res) => {
  res.render('404', { alert: false, user: req.user })
})

module.exports = router