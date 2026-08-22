import userModel from "../models/userSchema.js";

const getNotes = async(req,res)=>{
  try {
    const { id, userId } = req.body || {};
    const targetId = id || userId || req.userId || req.query?.id;

    if(!targetId){
      return res.json({success:false,message:"Id is required."})
    }

    const user = await userModel.findById(targetId);
    if(!user){
      return res.json({success:false,message:"User not found."})
    }
    res.json({success:true,notes:user.notes || []})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}
const addNotes = async (req, res) => {
  try {
    const { title, description, id, userId } = req.body;
    const targetId = id || userId || req.userId;

    if (!targetId ) {
      return res.json({
        success: false,
        message: "User ID, title and description are required",
      });
    }
    if(!title || !description){
      return res.json({
        success: false,
        message: "Title and description are required",
      });
    }

    const upperCaseTitle = title.toUpperCase();

    const updatedUser = await userModel.findByIdAndUpdate(
      targetId,
      {
        $push: {
          notes: {
            title: upperCaseTitle,
            description,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }
    const addedNote = updatedUser.notes[updatedUser.notes.length - 1]
    res.json({ success: true, message: "Note added to user", note: addedNote });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const updateNote = async (req, res) => {
  try {
    const { id, noteId, updatedTitle, updatedDescription, isCompleted } = req.body;

    if (!id || !noteId) {
      return res.json({
        success: false,
        message: "id and noteId are required",
      });
    }

    const updateFields = {};
    if (updatedTitle) updateFields["notes.$.title"] = updatedTitle;
    if (updatedDescription) updateFields["notes.$.description"] = updatedDescription;
    if (typeof isCompleted !== "undefined") {
      updateFields["notes.$.completed"] = isCompleted === true || isCompleted === "true";
    }

    if (Object.keys(updateFields).length === 0) {
      return res.json({
        success: false,
        message:
          "Nothing to update. Provide updatedTitle, updatedDescription, or isCompleted.",
      });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id, "notes._id": noteId },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User or note not found" });
    }

    const updatedNote = updatedUser.notes.id(noteId);
    res.json({ success: true, message: "Note updated", note: updatedNote });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const deleteNotes = async (req, res) => {
  try {
    const { id, notesId } = req.body;
    if (!id || !notesId) {
      return res.json({ success: false, message: "Id and notesId are required" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $pull: { notes: { _id: notesId } } },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const completeNote = async (req,res)=>{
  try {
    const {id,notesId} = req.body;
    if(!id || !notesId){
      return res.json({success:false,message:"Id and notesId are required"});
    }
    const updatedUser = await userModel.findByIdAndUpdate(id,{$set:{"notes.$[elem].completed":true}},{arrayFilters:[{"elem._id":notesId}],new:true,runValidators:true});
    if(!updatedUser){
      return res.json({success:false,message:"User not found"});
    }
    res.json({ success: true, message: "Note marked as complete" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
const notCompleteNote = async (req,res)=>{
  try {
    const {id,notesId} = req.body;
    if(!id || !notesId){
      return res.json({success:false,message:"Id and notesId are required"});
    }
    const updatedUser = await userModel.findByIdAndUpdate(id,{$set:{"notes.$[elem].completed":false}},{arrayFilters:[{"elem._id":notesId}],new:true,runValidators:true});
    if(!updatedUser){
      return res.json({success:false,message:"User not found"});
    }
    res.json({ success: true, message: "Note marked as incomplete" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export { addNotes, updateNote, deleteNotes, completeNote, notCompleteNote, getNotes };
