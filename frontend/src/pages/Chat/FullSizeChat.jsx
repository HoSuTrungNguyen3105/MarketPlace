import ChatContainer from "../../components/ChatBox/ChatContainer";
import NoChatSelected from "../../components/ChatBox/NoChatSelected";
import Sidebar from "../../components/ChatBox/Sidebar";
import { useMessageStore } from "../../store/useMessageStore";

const FullSizeChat = () => {
  const { selectedUser } = useMessageStore();
  return (
    <div className="w-full h-screen flex items-center justify-center bg-base-300">
      <div className="bg-base-100 rounded-lg shadow-lg w-full h-full flex">
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar with Return Button inside */}
          <Sidebar includeReturnButton />

          {/* Chat Container or No Chat Selected */}
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default FullSizeChat;
