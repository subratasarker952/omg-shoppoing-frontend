import { useState } from "react";
import api from "../../../../../services/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../context/AuthContext";

// Support চ্যাট কম্পোনেন্ট (সংক্ষেপে)
const SupportChat = ({ ticket, onReplySuccess }) => {
    const {user}= useAuth()
    const [msg, setMsg] = useState("");

    const sendReply = async () => {
        if(!msg) return;
        try {
            await api.put(`/api/supports/reply/${ticket._id}`, { message: msg });
            toast.success("Reply sent!");
            setMsg("");
            onReplySuccess(); // এটি কল করলে ডাটা রি-ফেচ হবে
        } catch (error) {
            console.error(error);
            toast.error("Error sending reply");
        }
    };

    return (
        <div className=" space-y-4">
            <div className="h-64 overflow-y-auto p-4 bg-slate-50 rounded-xl">
                {ticket.messages.map((m, i) => (
                    <div key={i} className={`mb-2 p-2 rounded-lg ${m.sender === user._id ? 'bg-blue-100 ml-auto' : 'bg-white mr-auto'} max-w-[80%]`}>
                        <p className="text-sm">{m.message}</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input value={msg} onChange={(e)=>setMsg(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Type reply..." />
                <button onClick={sendReply} className="btn btn-primary">Send</button>
            </div>
        </div>
    );
};

export default SupportChat