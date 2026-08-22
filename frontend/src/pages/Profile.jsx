import { useContext, useEffect, useState } from "react";
import Title from "../components/Title"
import { notesContext } from "../context/NotesContext";

const Profile = () => {
    const [notes, setNotes] = useState([]);
    const {  getNotes } = useContext(notesContext);
    const user = {
        name: localStorage.getItem("name") || "John Doe",
        email: localStorage.getItem("email"),
        pendingNotes: notes.filter((note) => !note.completed).length,
        completedNotes: notes.filter((note) => note.completed).length
    }
     useEffect(() => {
        const loadNotes = async () => {
          const userId = localStorage.getItem("userId");
          if (!userId) return;
    
          const fetchedNotes = await getNotes(userId);
          setNotes(fetchedNotes);
        };
    
        loadNotes();
      }, [getNotes]);
  return (
    <div className="p-4 flex flex-col gap-10 items-center">
      <div>
        <Title text1={'Your'} text2={'Profile'}/>
      </div>
      <div className="flex w-full flex-col gap-4 items-start justify-center bg-white/25 p-6 rounded-lg shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white/40">
        <div className="flex gap-2 items-center justify-center">
          <span className="font-semibold">Name:</span>
          <span className="text-gray-600">{user.name}</span>
        </div>
        <div className="flex gap-2 items-start justify-center">
          <span className="font-semibold">Email:</span>
          <span className="text-gray-600">
            {user.email}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 items-start justify-center bg-white/25 p-6 rounded-lg shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white/40">
        <div className="flex gap-2 items-center justify-center">
          <span className="font-semibold">Pending Notes:</span>
          <span className="text-gray-600">{user.pendingNotes}</span>
        </div>
        <div className="flex gap-2 items-start justify-center">
          <span className="font-semibold">Completed Notes:</span>
          <span className="text-gray-600">
            {user.completedNotes}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Profile
