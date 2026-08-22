import { useContext, useEffect, useState } from "react";
import { notesContext } from "../context/NotesContext";
import Title from "../components/Title";
import { Plus, Check, Trash2 } from "lucide-react";
import axios from "axios";

const DisplayNotes = () => {
  const { navigate, backendurl, getNotes } = useContext(notesContext);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const fetchedNotes = await getNotes(userId);
      setNotes(fetchedNotes);
    };

    loadNotes();
  }, [getNotes]);

  const addNotehandler = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    navigate("/add-notes", { state: { userId } });
  };

  const deleteNoteHandler = async (noteId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await axios.post(
        `${backendurl}/api/notes/delete-note`,
        { id: userId, notesId: noteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.data?.success) {
        throw new Error("Failed to delete note");
      }
      setNotes((currentNotes) =>
        currentNotes.filter((note) => (note._id || note.id) !== noteId),
      );
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  const completeNoteHandler = async (noteId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await axios.post(
        `${backendurl}/api/notes/completed-note`,
        { id: userId, notesId: noteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.data?.success) {
        throw new Error("Failed to complete note");
      }
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          (note._id || note.id) === noteId
            ? { ...note, completed: true }
            : note,
        ),
      );
    } catch (error) {
      console.error("Error completing note:", error);
    }
  };
  return (
    <div className="p-4 flex flex-col gap-10 items-center ">
      <Title text1="Your" text2="Notes" />
      <div
        onClick={addNotehandler}
        className="w-[90%] h-10 mb-4 rounded flex items-center justify-center"
      >
        <button className="w-30 h-15 bg-white/10 rounded-3xl cursor-pointer hover:scale-110 hover:bg-white/30 shadow-lg flex items-center justify-center">
          <Plus className="h-10" />
        </button>
      </div>
      <div className="flex gap-2  flex-wrap items-center justify-center">
        {notes.map(
          (note) =>
            !note.completed && (
              <div
                key={note._id || note.id}
                className="h-100 w-75 overflow-hidden rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl shadow-black/20 backdrop-blur-xl flex flex-col items-center gap-4 transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white/40"
              >
                <div className="w-full min-h-24 flex items-center justify-center">
                  <div className="w-full flex items-center justify-center">
                    <h1 className="w-full min-h-14 rounded-2xl border border-white/30 bg-white/20 px-3 py-3 text-center text-xl leading-tight text-[#322F30]/90 font-bold wrap-break-words">
                      {note.title.toUpperCase()}
                    </h1>
                  </div>
                </div>
                <div className="w-full flex-1 flex items-center justify-center min-h-0">
                  <p className="w-full h-full overflow-y-auto rounded-2xl border border-white/20 bg-white/10 p-4 text-center text-[#322F30]/70">
                    {note.description || note.content}
                  </p>
                </div>
                <div className="flex w-full  gap-2 items-center justify-center">
                  <button
                    onClick={() => deleteNoteHandler(note._id || note.id)}
                    className="bg-white/10 rounded-3xl w-full py-2 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 hover:bg-white/30 transition duration-300"
                  >
                    <Trash2 />
                  </button>
                  <button
                    onClick={() => completeNoteHandler(note._id || note.id)}
                    className="bg-white/10 rounded-3xl w-full  py-2 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 hover:bg-white/30 transition duration-300"
                  >
                    <Check />
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default DisplayNotes;
