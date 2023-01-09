
import { Schema,  model } from 'mongoose'

const UsuarioSchema = Schema({

    nombre:  {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    correo:  {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password:  {
        type: String,
        required: [true, "La contraseña es obligatorio"]
    },
    img:  {
        type: String,
    },
    rol:  {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
        default: 'USER_ROLE'
    },
    estado:  {
        type: Boolean,
        default: true
    },
    google:  {
        type: Boolean,
        default: false
    }

})

UsuarioSchema.methods.toJSON = function() {
    // Usamos funcion en lugar de Arrow funcion porque necesitamos que la instancia creada quede dentro de la funcnion..
    const {__v, password, _id, ...usuario} = this.toObject();

    usuario.uid = _id;

    return {
        usuario
    }; // Aca estamos retornando el el usuario sin la version y el paswword

}

export default model('Usuario', UsuarioSchema);