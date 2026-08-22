// import mongoose from "mongoose";

// const notesSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });

// const notesModel = mongoose.models.note || mongoose.model("note", notesSchema);

// export default notesModel;