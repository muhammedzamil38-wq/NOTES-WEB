import express from 'express';
import { addNotes, completeNote, deleteNotes, getNotes, notCompleteNote, updateNote } from '../controllers/notesController.js';
import authUser from '../middlewares/auth.js';


const notesRouter = express.Router();
notesRouter.post('/create-note',authUser,addNotes)
notesRouter.put('/update-note',authUser,updateNote)
notesRouter.post('/delete-note',authUser,deleteNotes)
notesRouter.post('/completed-note',authUser,completeNote)
notesRouter.post('/incompleted-note',authUser,notCompleteNote)
notesRouter.get('/get-notes',authUser,getNotes)

export default notesRouter;