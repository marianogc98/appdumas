const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const connection = require('../database/db')
const { promisify } = require('util')
const { body, validationResult } = require('express-validator')

//validar si existe la info
exports.validarUserEmail = async (req, res, next) => {
    await connection.query('SELECT email FROM usuarios where email = ?', [req.body.email], (error, results) => {
        if (error) {
            return error
        }
        if (results.length > 0) {
            let validaciones = []
            let obj = {
                msg: 'El mail ya existe'
            }
            validaciones.push(obj)

            res.render('crearUsuario', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones
            })

        } else {
            return next()
        }
    })
}

exports.validarUserName = async (req, res, next) => {
    await connection.query('SELECT user FROM usuarios where user = ?', [req.body.user], (error, results) => {
        if (error) {
            return error
        }
        if (results.length > 0) {
            let validaciones = []
            let obj = {
                msg: 'El usuario ya existe'
            }
            validaciones.push(obj)

            res.render('crearUsuario', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones
            })

        } else {
            return next()
        }
    })
}

exports.validarUserDni = async (req, res, next) => {
    await connection.query('SELECT dni FROM usuarios where dni = ?', [req.body.dni], (error, results) => {
        if (error) {
            return error
        }
        if (results.length > 0) {
            let validaciones = []
            let obj = {
                msg: 'El dni ya existe'
            }
            validaciones.push(obj)

            res.render('crearUsuario', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones
            })

        } else {
            return next()
        }
    })
}

exports.validarUserEmailEdit = async (req, res, next) => {
    await connection.query('SELECT id_usuario, email FROM usuarios where email = ?', [req.body.email], (error, results) => {
        if (error) {
            return error
        }

        if (results.length > 0 && req.body.id_usuario == results[0].id_usuario) {
            return next()
        } else if(results.length > 0){
            let validaciones = []
            let obj = {
                msg: 'El mail ya existe'
            }
            validaciones.push(obj)

            res.render('editarUsuario', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones,
                usuario:req.body
            })  
        }else{
            return next()
        }
    })
}

exports.validarUserDniEdit = async (req, res, next) => {
    await connection.query('SELECT id_usuario, dni FROM usuarios where dni = ?', [req.body.dni], (error, results) => {
        if (error) {
            return error
        }
        
        if (results.length > 0 && req.body.id_usuario == results[0].id_usuario) {
            return next()
        } else if(results.length > 0){
            let validaciones = []
            let obj = {
                msg: 'El dni ya existe'
            }
            validaciones.push(obj)

            res.render('editarUsuario', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones,
                usuario:req.body
            })  
        }else{
            return next()
        }
    })
}

exports.validarUserNameEdit = async (req, res, next) => {
    await connection.query('SELECT id_usuario, user FROM usuarios where user = ?', [req.body.user], (error, results) => {
        if (error) {
            return error
        }

        if (results.length > 0 && req.body.id_usuario == results[0].id_usuario) {
            return next()
        } else if(results.length > 0){
            let validaciones = []
            let obj = {
                msg: 'El nombre de usuario ya existe'
            }
            validaciones.push(obj)

            res.render('editarUsuario', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones,
                usuario:req.body
            })  
        }else{
            return next()
        }
    })
}

exports.validarClienteEmail = async (req, res, next) => {
    await connection.query('SELECT email FROM clientes where email = ?', [req.body.email], (error, results) => {
        if (error) {
            return error
        }
        if (results.length > 0) {
            let validaciones = []
            let obj = {
                msg: 'El mail ya existe'
            }
            validaciones.push(obj)

            res.render('crearCliente', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones
            })

        } else {
            return next()
        }
    })
}

exports.validarClienteDni = async (req, res, next) => {
    await connection.query('SELECT dni FROM clientes where dni = ?', [req.body.dni], (error, results) => {
        if (error) {
            return error
        }
        if (results.length > 0) {
            let validaciones = []
            let obj = {
                msg: 'El dni ya existe'
            }
            validaciones.push(obj)
            res.render('crearCliente', {
                valores: req.body,
                fecha: req.body.nacimiento,
                alert: false,
                user: req.user,
                validaciones: validaciones
            })

        } else {
            return next()
        }
    })
}
//

//Consultas
exports.cantidadClientes = async (req,res,next) =>{
    await connection.query('SELECT COUNT(id_cliente) AS clientes FROM clientes', (error, results)=>{
        if(error){
            console.log(error)
        }
        req.cantidadClientes = results[0].clientes
        return next()
    })
}

exports.cantidadClientesContrato = async (req,res,next) =>{
    await connection.query('SELECT COUNT(id_cliente) AS contratos FROM contratos ', (error, results)=>{
        if(error){
            console.log(error)
        }
        req.cantidadClientesContratos = results[0].contratos
        return next()
    }) 
}
//

//Login
exports.login = async (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'Info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            connection.query('SELECT * FROM usuarios WHERE user = ? and activo = 1', [user], async (error, results) => {
                if (results.length == 0 || !(await bcrypt.compare(pass, results[0].password))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                } else {
                    //session OK
                    const id = results[0].id_usuario
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRE_TIME,

                    })

                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookieOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡Login Correcto!",
                        alertIcon: 'success',
                        showConfirmButton: true,
                        timer: 800,
                        ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
//

//Logout
exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}
//

//Clientes
exports.obtenerClientes = async (req, res, next) => {
    if (req.user.id_rol == 1) {
        const resultadosPorPagina = 6;
        await connection.query('select c.id_cliente, c.nombre, c.dni, c.email, c.nacimiento, c.telefono, c.num_cuotas, c.id_usuario, c.domicilio, c.localidad, c.activo, ct.id_contrato from clientes c left join contratos ct on c.id_cliente = ct.id_cliente ', async (error, results) => {
            if (results.length === 0) {
                req.clientes = []
                return next()
            }
            const nResultados = results.length
            const nDePaginas = Math.ceil(nResultados / resultadosPorPagina)
            let pagina = req.query.pagina ? Number(req.query.pagina) : 1

            if (pagina > nDePaginas) {
                res.redirect('/Clientes?pagina=' + encodeURIComponent(nDePaginas))
            } else if (pagina < 1) {
                res.redirect('/Clientes?pagina=' + encodeURIComponent(1))
            }
            //determinar el LIMIT de la consulta SQL
            const comienzoLimit = (pagina - 1) * resultadosPorPagina
            let sql = `select c.id_cliente, c.nombre, c.dni, c.email, c.nacimiento, c.telefono, c.num_cuotas, c.id_usuario, c.domicilio, c.localidad, c.activo, ct.id_contrato from clientes c left join contratos ct on c.id_cliente = ct.id_cliente ORDER BY c.activo DESC LIMIT ${comienzoLimit},${resultadosPorPagina}`;
            await connection.query(sql, (error, results) => {
                if (error) throw error;
                let iterador = (pagina - 5) < 1 ? 1 : pagina - 5;
                let finalLink = (iterador + 9) <= nDePaginas ? (iterador + 9) : pagina + (nDePaginas - pagina);
                req.clientes = results
                req.pagina = pagina
                req.iterador = iterador
                req.finalLink = finalLink
                req.nDePaginas = nDePaginas
                return next()
            })
        })
    } else {
        const resultadosPorPagina = 6;
        await connection.query('select c.id_cliente, c.id_usuario, c.nombre, c.dni, c.email, c.nacimiento, c.telefono, c.num_cuotas,  c.domicilio, c.localidad, ct.id_contrato from clientes c left join contratos ct on c.id_cliente = ct.id_cliente where (c.id_usuario = ? or c.asignado = ?)', [req.user.id_usuario, req.user.id_usuario], async (error, results) => {
            if (results.length === 0) {
                req.clientes = []
                return next()
            }
            const nResultados = results.length
            const nDePaginas = Math.ceil(nResultados / resultadosPorPagina)
            let pagina = req.query.pagina ? Number(req.query.pagina) : 1

            if (pagina > nDePaginas) {
                res.redirect('/Clientes?pagina=' + encodeURIComponent(nDePaginas))
            } else if (pagina < 1) {
                res.redirect('/Clientes?pagina=' + encodeURIComponent(1))
            }
            //determinar el LIMIT de la consulta SQL
            const comienzoLimit = (pagina - 1) * resultadosPorPagina
            let sql = `select c.id_cliente, c.id_usuario, c.nombre, c.dni, c.email, c.nacimiento, c.telefono, c.num_cuotas,  c.domicilio, c.localidad, ct.id_contrato from clientes c left join contratos ct on c.id_cliente = ct.id_cliente where (c.id_usuario = ? or c.asignado = ?) ORDER BY c.activo DESC LIMIT ${comienzoLimit},${resultadosPorPagina}`;
            await connection.query(sql, [req.user.id_usuario, req.user.id_usuario], (error, results) => {
                if (error) throw error;
                let iterador = (pagina - 5) < 1 ? 1 : pagina - 5;
                let finalLink = (iterador + 9) <= nDePaginas ? (iterador + 9) : pagina + (nDePaginas - pagina);
                req.clientes = results
                req.pagina = pagina
                req.iterador = iterador
                req.finalLink = finalLink
                req.nDePaginas = nDePaginas
                return next()
            })
        })
    }
}

exports.crearCliente = async (req, res) => {
    if(req.body.asignado === ''){
        req.body.asignado = null
    }
    try {
        const name = req.body.nombre
        const dni = req.body.dni
        const mail = req.body.email
        const pass = req.body.dni
        const nacimiento = req.body.nacimiento
        const tel = req.body.telefono
        const cuotas = req.body.num_cuotas
        const domicilio = req.body.domicilio
        const localidad = req.body.localidad
        const id_usuario = req.body.usuarioId
        const asignado = req.body.asignado
        let passHash = await bcrypt.hash(pass, 8)

        await connection.query('INSERT INTO clientes SET ?', {
            nombre: name,
            dni: dni,
            email: mail,
            password: passHash,
            nacimiento: nacimiento,
            telefono: tel,
            num_cuotas: cuotas,
            domicilio: domicilio,
            localidad: localidad,
            id_usuario: id_usuario,
            activo: 1,
            asignado: asignado
        }, (error, results) => {
            if (error) {
                console.log(error)
            }
            res.render('clientes', {
                alert: true,
                alertTitle: "Éxito",
                alertMessage: "El Cliente fué creado correctamente",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: 800,
                ruta: 'Clientes',
                user: req.user,
                clientes: [],
                pagina: 0,
                iterador: 0,
                finalLink: 0,
                nDePaginas: 0
            })
        })
    } catch (error) {
        console.log(error)
    }
}

exports.editarCliente = async (req, res) => {
    const id = req.body.id_cliente
    const name = req.body.nombreCliente
    const dni = req.body.dni
    const mail = req.body.email
    const nacimiento = req.body.nacimiento
    const tel = req.body.telefono
    const cuotas = req.body.num_cuotas
    const domicilio = req.body.domicilio
    const localidad = req.body.localidad
    await connection.query('UPDATE clientes SET ? WHERE id_cliente = ?', [
        {
            nombre: name,
            dni: dni,
            email: mail,
            nacimiento: nacimiento,
            telefono: tel,
            num_cuotas: cuotas,
            domicilio: domicilio,
            localidad: localidad
        }, id], (error, results) => {
            if (error) {
                console.log(error)
            } else {
                res.redirect('/Clientes')
            }
        }
    )
}
//

//Usuario
exports.getUsuarios = async (req, res, next) => {
    const id_usuario = req.user.id_usuario
    if (req.user.id_rol == 1) {
        let queries = [
            'SELECT * FROM usuarios where ? NOT in (id_usuario) order by activo DESC',
            'SELECT * FROM roles'
        ]
        await connection.query(queries.join(';'), [id_usuario], (error, results, fields) => {
            if (error) {
                console.log(error)
            } else {
                req.usuarios = results[0]
                req.roles = results[1]
                return next()
            }
        })
    } else {
        res.redirect('/')
    }
}

exports.getVendedores = async (req, res, next) => {
await connection.query('SELECT id_usuario, user FROM usuarios where activo = 1 and id_rol = 2', (error, results) => {
    if (error) {
        console.log(error)
    } else {
        req.usuarios = results
        return next()
    }
    })
}

exports.crearUsuario = async (req, res) => {
    try {
        const nombre = req.body.nombre
        const user = req.body.user
        const email = req.body.email
        const pass = req.body.pass
        const tel = req.body.tel
        const nacimiento = req.body.nacimiento
        const dni = req.body.dni
        const rol = req.body.rol
        const domicilio = req.body.domicilio
        const localidad = req.body.localidad
        let passHash = await bcrypt.hash(pass, 8)

        connection.query('INSERT INTO usuarios SET ?', {
            nombre: nombre,
            user: user,
            email: email,
            password: passHash,
            telefono: tel,
            dni: dni,
            nacimiento: nacimiento,
            id_rol: rol,
            activo: 1,
            domicilio: domicilio,
            localidad: localidad
        }, (error, results) => {
            if (error) {
                console.log(error)
            }
            res.render('usuarios', {
                alert: true,
                alertTitle: "Éxito",
                alertMessage: "El usuario fué creado correctamente",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: 800,
                user: req.user,
                usuarios: [],
                ruta: 'usuarios'
            })
        })
    } catch (error) {
        console.log(error)
    }
}

exports.editarUsuario = async (req, res) => {
    const id = req.body.id_usuario
    const nombre = req.body.nombre
    const user = req.body.user
    const email = req.body.email
    const tel = req.body.telefono
    const nacimiento = req.body.nacimiento
    const dni = req.body.dni
    const domicilio = req.body.domicilio
    const localidad = req.body.localidad
    const rol = req.body.id_rol

    await connection.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [
        {
            nombre: nombre,
            user: user,
            email: email,
            telefono: tel,
            dni: dni,
            nacimiento: nacimiento,
            id_rol: rol,
            domicilio: domicilio,
            localidad: localidad

        }, id], (error, results) => {
            if (error) {
                console.log(error)
            } else {
                res.redirect('/Usuarios')
            }
        }
    )
}



//Autenticación
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            await connection.query('SELECT * FROM usuarios WHERE id_usuario = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}
//

//Rol
exports.isAllowed = (req, res, next) => {
    if (req.user.id_rol == 1 || req.user.id_rol == 2) {
        return next()
    } else {
        res.render('index', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "no tiene permisos",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: '',
            user: req.user
        })
    }
}
//

//Admin
exports.isAdmin = (req, res, next) => {
    if (req.user.id_rol == 1) {
        return next()
    } else {
        res.render('index', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "no tiene permisos",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: '',
            user: req.user
        })
    }
}
//

//Beneficios
exports.getBeneficios = async (req, res, next) => {
    if (req.user.id_rol == 1) {
        await connection.query('SELECT * FROM beneficios', (error, results) => {
            req.beneficios = results
            return next()
        })
    } else {
        res.render('index', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "No tienes los permisos adecuados",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 800,
            ruta: ''
        })
    }
}

exports.obtenerBeneficios = async (req, res, next) => {
    await connection.query('SELECT * FROM beneficios where activo = 1', (error, results) => {
        req.beneficios = results
        
        return next()
    })
}

exports.crearBeneficio = async (req, res) => {
    const nombre = req.body.nombre
    await connection.query('INSERT INTO beneficios SET ?', {
        nombre: nombre,
        activo: 1
    }, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.render('beneficios', {
                alert: true,
                alertTitle: "Éxito",
                alertMessage: "El beneficio fué creado correctamente",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: 800,
                ruta: 'beneficios',
                user: req.user,
                beneficios: []
            })
        }
    })

}

//

//Lineas
exports.getLineas = async (req, res, next) => {
    if (req.user.id_rol == 1) {
        await connection.query('SELECT * FROM lineas', (error, results) => {
            req.lineas = results
            return next()
        })
    } else {
        res.render('index', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "No tienes los permisos adecuados",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 800,
            ruta: ''
        })
    }
}

exports.obtenerLineas = async (req, res, next) => {
    await connection.query('SELECT * FROM lineas where activo = 1', (error, results) => {
        req.lineas = results
        return next()
    })
}

exports.crearLinea = async (req, res) => {
    const nombre = req.body.nombre
    await connection.query('INSERT INTO lineas SET ?', {
        nombre: nombre,
        activo: 1
    }, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.render('lineas', {
                alert: true,
                alertTitle: "Éxito",
                alertMessage: "La linea fué creada correctamente",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: 800,
                ruta: 'lineas',
                user: req.user,
                lineas: []
            })
        }
    })

}
//


//Tipologias
exports.getTipologias = async (req, res, next) => {
    if (req.user.id_rol == 1) {
        await connection.query('SELECT * FROM tipologias', (error, results) => {
            req.tipologias = results
            return next()
        })
    } else {
        res.render('index', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "No tienes los permisos adecuados",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 800,
            ruta: ''
        })
    }
}

exports.obtenerTipologias = async (req, res, next) => {
    await connection.query('SELECT * FROM tipologias where activo = 1', (error, results) => {
        req.tipologias = results
        return next()
    })
}



exports.crearTipologia = async (req, res) => {
    const nombre = req.body.nombre

    await connection.query('INSERT INTO tipologias SET ?', {
        nombre: nombre,
        activo: 1
    }, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.render('tipologias', {
                alert: true,
                alertTitle: "Éxito",
                alertMessage: "La tipología fué creada correctamente",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: 800,
                ruta: 'tipologias',
                user: req.user,
                tipologias: []
            })
        }
    })

}
//

//Contratos
exports.validarNumContrato = async (req,res, next) => {
    await connection.query('SELECT num_contrato FROM contratos WHERE ? in(num_contrato)', 
        [req.body.num_contrato], (error,results) => {
            if(error){
                console.log(error)
            }
            if(results[0] == 'undefined'){
                return next()
            }else{
                let validaciones = []
                let obj = {
                    msg: 'El número de contrato ya existe'
                }
                validaciones.push(obj)
                let valores = req.body
                res.render('crearContrato', { 
                    user: req.user, alert: false, valores: valores,
                    validaciones: validaciones, cliente: valores,
                    usuarioId: valores.id_usuario, lineas: req.lineas,
                    tipologias: req.tipologias, beneficios: req.beneficios      
                  })
            }
        }
    )
}
exports.crearContrato = async (req, res) => {
    const id_usuario = req.body.id_usuario
    const id_cliente = req.body.id_cliente
    const num_contrato = req.body.num_contrato
    const linea = req.body.linea
    const tipologia = req.body.tipologia
    const zona = req.body.zona
    const contratados = req.body.contratados
    const inicial = req.body.inicial
    const aporte = req.body.aporte

    if (!req.body.beneficio) {
        await connection.query('INSERT INTO contratos SET ?', {
            id_usuario: id_usuario,
            id_cliente: id_cliente,
            num_contrato: num_contrato,
            id_linea: linea,
            id_tipologia: tipologia,
            zona: zona,
            mts_contratados: contratados,
            mts_valor_inicial: inicial,
            aporte: aporte
        }, (error, results) => {
            if (error) {
                console.log(error)
            } else {
                res.render('clientes', {
                    alert: true,
                    alertTitle: "Éxito",
                    alertMessage: "El contrato fué creado correctamente",
                    alertIcon: 'success',
                    showConfirmButton: true,
                    timer: 800,
                    ruta: 'Clientes',
                    user: req.user,
                    clientes: [],
                    pagina: 0,
                    iterador: 0,
                    finalLink: 0,
                    nDePaginas: 0
                })
            }
        })
    } else {
        let beneficios = []
        Object.values(req.body.beneficio).forEach(val => beneficios.push(parseInt(val)))
        await connection.query('INSERT INTO contratos SET ?', {
            id_usuario: id_usuario,
            id_cliente: id_cliente,
            num_contrato: num_contrato,
            id_linea: linea,
            id_tipologia: tipologia,
            zona: zona,
            mts_contratados: contratados,
            mts_valor_inicial: inicial,
            aporte: aporte
        }, async (error, results) => {
            if (error) {
                console.log(error)
            }
            await connection.query('SELECT id_contrato FROM contratos WHERE id_cliente = ?', [id_cliente], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                let id_contrato = results[0].id_contrato
                try {
                    beneficios.map(async (beneficio) => {
                        await connection.query('INSERT INTO contratosbeneficios SET ?', {
                            id_contrato: id_contrato,
                            id_beneficio: beneficio
                        }, (error, results) => {
                            if (error) {
                                console.log(error)
                            }
                        })
                    })
                    res.render('clientes', {
                        alert: true,
                        alertTitle: "Éxito",
                        alertMessage: "El contrato fué creado correctamente",
                        alertIcon: 'success',
                        showConfirmButton: true,
                        timer: 800,
                        ruta: 'Clientes',
                        user: req.user,
                        clientes: [],
                        pagina: 0,
                        iterador: 0,
                        finalLink: 0,
                        nDePaginas: 0
                    })
                } catch (error) {
                    res.render('clientes', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: `${error}`,
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 800,
                        ruta: 'Clientes',
                        user: req.user,
                        clientes: [],
                        pagina: 0,
                        iterador: 0,
                        finalLink: 0,
                        nDePaginas: 0
                    })
                }
            })
        })
    }
}
//

