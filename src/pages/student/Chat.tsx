import { sendIcon } from "../../assets/icons/icons";
import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../App";
import { ICurrentUser } from "../../interfaces/auth";
import { IMessage } from "../../interfaces/chat";
import { fetchAllChatsAPI } from "../../apiRoutes/student";
import MessageChat from "../../components/MessageChat";
import MetroSpinner from "../../components/UI/MetroSpinner";
import moment from "moment";

// Student Chat
function Chat() {
  const socket = useRef<Socket | null>();
  const [message, setMessage] = useState<string>("");
  const student = useAppSelector<ICurrentUser | null>((state) => state.currentUser);
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    fetchAllChatsAPI()
      .then(({ data: { data } }) => setAllMessages(data))
      .catch(() => setAllMessages([]));
    socket.current = io(process.env.REACT_APP_BACKEND_CHAT as string);
    socket.current.emit("join", {
      userName: student?.currentUser?.name,
      userId: student?.currentUser?._id,
      profilePic: student?.currentUser.profilePic,
      role: "student",
    });
    socket.current.on("getMessage", ({ userId, userName, role, message, date, profilePic }) =>
      setAllMessages((prevState) => [
        { userId, userName, role, message, date, profilePic },
        ...prevState,
      ])
    );
    // eslint-disable-next-line
  }, []);

  const chatMessageHandler = () => {
    if (message.trim().length > 0)
      socket.current?.emit("sendMessage", {
        userName: student?.currentUser?.name,
        userId: student?.currentUser?._id,
        profilePic: student?.currentUser.profilePic,
        role: "student",
        message,
        date: Date.now(),
      });
    return setMessage("");
  };

  return (
    <div className="parent-container">
      <h2>Student Chat Room</h2>
      <div className="bg-[#F5F5F5] h-96 rounded shadow-sm mb-3 py-2">
        <div className="h-80 flex flex-col-reverse overflow-y-auto ">
          {allMessages.length > 0 ? (
            allMessages.map(({ date, message, profilePic, userName, userId }, i) => (
              <MessageChat
                key={`${date}${i}`}
                date={`${moment(date).format("LT")} ${moment(date).format("L")}`}
                message={message}
                profilePic={profilePic}
                userName={userName}
                self={userId === student?.currentUser._id}
              />
            ))
          ) : (
            <MetroSpinner className="my-auto" size={40} />
          )}
        </div>
        <div className="px-5 py-1">
          <div className="border-t-2 ">
            <div className="flex items-center mt-3 mx-auto w-2/3 bg-white px-3 rounded-full shadow-md">
              <input
                className="grow p-1 focus:outline-none text-sm"
                placeholder="Send a message..."
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) return chatMessageHandler();
                }}
              />
              <img
                className="h-5 m-1 active:animate-ping"
                src={sendIcon}
                onClick={chatMessageHandler}
                alt="send message"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
