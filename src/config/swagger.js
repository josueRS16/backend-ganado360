const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ganado360 API',
      version: '1.0.0',
      description: 'API para sistema de gestión de ganado',
      contact: {
        name: 'Ganado360 Team',
        email: 'support@ganado360.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Animal: {
          type: 'object',
          required: ['Nombre', 'Sexo', 'Color', 'Peso', 'Fecha_Nacimiento', 'Raza', 'Esta_Preniada', 'Fecha_Ingreso', 'ID_Categoria'],
          properties: {
            ID_Animal: {
              type: 'integer',
              description: 'ID único del animal'
            },
            Nombre: {
              type: 'string',
              description: 'Nombre del animal'
            },
            Sexo: {
              type: 'string',
              enum: ['M', 'H'],
              description: 'Sexo del animal (M=Macho, H=Hembra)'
            },
            Color: {
              type: 'string',
              description: 'Color del animal'
            },
            Peso: {
              type: 'number',
              format: 'float',
              description: 'Peso del animal en kg'
            },
            Fecha_Nacimiento: {
              type: 'string',
              format: 'date',
              description: 'Fecha de nacimiento del animal'
            },
            Raza: {
              type: 'string',
              description: 'Raza del animal'
            },
            Esta_Preniada: {
              type: 'boolean',
              description: 'Si el animal está preñado'
            },
            Fecha_Monta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de monta'
            },
            Fecha_Estimada_Parto: {
              type: 'string',
              format: 'date',
              description: 'Fecha estimada de parto'
            },
            Fecha_Ingreso: {
              type: 'string',
              format: 'date',
              description: 'Fecha de ingreso al sistema'
            },
            ID_Categoria: {
              type: 'integer',
              description: 'ID de la categoría del animal'
            },
            CategoriaTipo: {
              type: 'string',
              description: 'Tipo de categoría (campo calculado)'
            }
          }
        },
        Usuario: {
          type: 'object',
          required: ['Nombre', 'Correo', 'Contraseña', 'RolID'],
          properties: {
            ID_Usuario: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            Nombre: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            Correo: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario'
            },
            Contraseña: {
              type: 'string',
              description: 'Contraseña del usuario'
            },
            RolID: {
              type: 'integer',
              description: 'ID del rol del usuario'
            },
            RolNombre: {
              type: 'string',
              description: 'Nombre del rol (campo calculado)'
            }
          }
        },
        Categoria: {
          type: 'object',
          required: ['Tipo'],
          properties: {
            ID_Categoria: {
              type: 'integer',
              description: 'ID único de la categoría'
            },
            Tipo: {
              type: 'string',
              description: 'Tipo de categoría'
            }
          }
        },
        Rol: {
          type: 'object',
          required: ['Nombre'],
          properties: {
            RolID: {
              type: 'integer',
              description: 'ID único del rol'
            },
            Nombre: {
              type: 'string',
              description: 'Nombre del rol'
            }
          }
        },
        Recordatorio: {
          type: 'object',
          required: ['ID_Animal', 'Titulo', 'Descripcion', 'Fecha_Recordatorio'],
          properties: {
            ID_Recordatorio: {
              type: 'integer',
              description: 'ID único del recordatorio'
            },
            ID_Animal: {
              type: 'integer',
              description: 'ID del animal asociado'
            },
            Titulo: {
              type: 'string',
              description: 'Título del recordatorio'
            },
            Descripcion: {
              type: 'string',
              description: 'Descripción del recordatorio'
            },
            Fecha_Recordatorio: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del recordatorio'
            },
            AnimalNombre: {
              type: 'string',
              description: 'Nombre del animal (campo calculado)'
            }
          }
        },
        Historial: {
          type: 'object',
          required: ['ID_Animal', 'Tipo_Evento', 'Descripcion', 'Fecha_Aplicacion'],
          properties: {
            ID_Evento: {
              type: 'integer',
              description: 'ID único del evento del historial'
            },
            ID_Animal: {
              type: 'integer',
              description: 'ID del animal asociado'
            },
            Tipo_Evento: {
              type: 'string',
              description: 'Tipo de evento'
            },
            Descripcion: {
              type: 'string',
              description: 'Descripción del evento'
            },
            Fecha_Aplicacion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de aplicación del evento'
            },
            Proxima_Fecha: {
              type: 'string',
              format: 'date',
              description: 'Próxima fecha programada'
            },
            Hecho_Por: {
              type: 'integer',
              description: 'ID del usuario que realizó el evento'
            },
            AnimalNombre: {
              type: 'string',
              description: 'Nombre del animal (campo calculado)'
            },
            UsuarioNombre: {
              type: 'string',
              description: 'Nombre del usuario (campo calculado)'
            }
          }
        },
        Estado: {
          type: 'object',
          required: ['Nombre'],
          properties: {
            ID_Estado: {
              type: 'integer',
              description: 'ID único del estado'
            },
            Nombre: {
              type: 'string',
              description: 'Nombre del estado'
            },
            Descripcion: {
              type: 'string',
              description: 'Descripción del estado'
            }
          }
        },
        EstadoAnimal: {
          type: 'object',
          required: ['ID_Animal', 'ID_Estado'],
          properties: {
            ID_Estado_Animal: {
              type: 'integer',
              description: 'ID único del estado del animal'
            },
            ID_Animal: {
              type: 'integer',
              description: 'ID del animal'
            },
            ID_Estado: {
              type: 'integer',
              description: 'ID del estado'
            },
            Fecha_Fallecimiento: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fallecimiento del animal'
            },
            AnimalNombre: {
              type: 'string',
              description: 'Nombre del animal (campo calculado)'
            },
            EstadoNombre: {
              type: 'string',
              description: 'Nombre del estado (campo calculado)'
            }
          }
        },
        Venta: {
          type: 'object',
          required: ['ID_Animal', 'Fecha_Venta', 'Tipo_Venta', 'Comprador', 'Precio'],
          properties: {
            ID_Venta: {
              type: 'integer',
              description: 'ID único de la venta'
            },
            ID_Animal: {
              type: 'integer',
              description: 'ID del animal vendido'
            },
            Fecha_Venta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de la venta'
            },
            Tipo_Venta: {
              type: 'string',
              description: 'Tipo de venta'
            },
            Comprador: {
              type: 'string',
              description: 'Nombre del comprador'
            },
            Precio: {
              type: 'number',
              format: 'float',
              description: 'Precio de venta'
            },
            Registrado_Por: {
              type: 'integer',
              description: 'ID del usuario que registró la venta'
            },
            Observaciones: {
              type: 'string',
              description: 'Observaciones de la venta'
            },
            AnimalNombre: {
              type: 'string',
              description: 'Nombre del animal (campo calculado)'
            },
            UsuarioNombre: {
              type: 'string',
              description: 'Nombre del usuario (campo calculado)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            },
            count: {
              type: 'integer',
              description: 'Número de elementos'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = specs;
