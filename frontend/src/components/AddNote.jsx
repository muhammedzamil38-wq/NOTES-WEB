import axios from "axios";
import { useContext, useState } from "react";
import { notesContext } from "../context/NotesContext";
import { toast } from "react-toastify";

const INK = "#322F30";
const CREAM = "#FEEFCA";

const AddNote = ()=> {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { navigate, backendurl } = useContext(notesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      toast.error("Please log in again to add a note.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/api/notes/create-note`,
        {
          id: userId,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Note added successfully!");
        setTitle("");
        setDescription("");
        navigate("/notes");
      } else {
        toast.error(response.data.message || "Failed to add note.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Failed to add note.");
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto rounded-2xl p-6 shadow-lg"
      style={{ backgroundColor: INK }}
    >
      <h2
        className="text-xl font-semibold mb-5 tracking-tight"
        style={{ color: CREAM }}
      >
        New note
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="note-title"
            className="text-xs uppercase tracking-wide opacity-80"
            style={{ color: CREAM }}
          >
            Title
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a name"
            className="rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:ring-2"
            style={{
              backgroundColor: "#3E3A3B",
              color: CREAM,
              borderColor: "#4A4546",
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="note-description"
            className="text-xs uppercase tracking-wide opacity-80"
            style={{ color: CREAM }}
          >
            Description
          </label>
          <textarea
            id="note-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your note here"
            rows={4}
            className="rounded-lg px-3 py-2 text-sm outline-none border resize-none transition-colors focus:ring-2"
            style={{
              backgroundColor: "#3E3A3B",
              color: CREAM,
              borderColor: "#4A4546",
            }}
          />
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: CREAM, color: INK }}
        >
          Add note
        </button>
      </form>
    </div>
  );
}
export default AddNote;