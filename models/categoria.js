import { Schema, model } from "mongoose";

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true
  },
  estado: {
    type: Boolean,
    required: true,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Tiene que ser igual al que tenemos en Usario, tener en cuenta esto! 
    required: true,
  },


});

CategoriaSchema.methods.toJSON = function() {
  // Usamos funcion en lugar de Arrow funcion porque necesitamos que la instancia creada quede dentro de la funcnion..
  const {__v, estado, ...data} = this.toObject();

  // POR SI QUIERO QUE _ID SEA UID EN EL USUARIO
  // if (data.usuario._id) {
  //   data.usuario.uid = data.usuario._id;
  //   delete data.usuario._id;
  // }

  return {
      data
  }; // Aca estamos retornando el el usuario sin la version y el paswword

}

export default model("Categoria", CategoriaSchema);