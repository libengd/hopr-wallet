import { Box, Button, Text, TextInput, InfiniteScroll } from "grommet"
import { Send } from "grommet-icons"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { List, ListItem } from "../../App"
import ChatBubble from "../ChatBubble/ChatBubble"
import { PeerAddress } from "../PeerAddress/PeerAddress"
import type { Message } from "../../hooks/useApp";
import { debounce } from "lodash"

const MessageSend = styled(Send)`
cursor: pointer;
pointer-events: auto;
`
// export const MessageItem = ({ path, ...props }: any) => (
//   <Button hoverIndicator="light-4">
//     <Box
//       border="bottom"
//       pad={{ horizontal: "small", vertical: "medium" }}
//       direction="row-responsive"
//       {...props}
//     />
//   </Button>
// );

const ChatView: React.FC<{
  selection?: string;
  messages: Message[];
}> = ({ messages, selection }) => {
  // sorted in ASC by createdAt
  const sorted = messages.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  // whether the scroll should stay at the bottom when new messages are inserted
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(true);
  const container = useRef<HTMLDivElement>(null);

  const setScrollToBottomDebounced = debounce<(ev: Event) => void>(() => {
    if (!container.current) return;

    const isAtBottom = container.current.scrollTop === 1;
    setScrollToBottom(isAtBottom);
  }, 250);

  // run once container is attached, keeps track of scroll
  useEffect(() => {
    if (!container.current) return;
    container.current.addEventListener("scroll", setScrollToBottomDebounced);

    return () => {
      if (!container.current) return;
      container.current.removeEventListener(
        "scroll",
        setScrollToBottomDebounced
      );
    };
  }, [container.current]);

  // scroll into view when a new message is inserted
  useEffect(() => {
    // do nothing if we have no container or no messages
    if (!container.current || sorted.length === 0) return;

    // we don't need to scroll to bottom
    if (!scrollToBottom) return;

    const latestElement = container.current.firstElementChild;
    if (!latestElement) return;

    // right now we scroll at all times since we don't
    // have a new message indicator
    // const message = sorted[sorted.length - 1];
    // if (message.isIncoming) return;

    latestElement.scrollIntoView();
  }, [container.current, sorted.length]);

  return (
    <Box
      height="100%"
      direction="column-reverse"
      overflow={{
        vertical: "auto",
        horizontal: "hidden",
      }}
      ref={container}
    >
      <InfiniteScroll items={sorted}>
        {(message: Message, _index: number, ref: any) => (
          <Box
            ref={ref}
            key={message.id}
            alignSelf={message.isIncoming ? "start" : "end"}
            flex={false}
            pad={{
              bottom: "large",
              right: "small",
            }}
          >
            <ChatBubble message={message} />
          </Box>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export const Chat = ({
  myPeerId,
  peerId,
  handleAddNewConversation,
  conversation,
  sendMessage,
  selection,
  setSelection,
  ...props
}: any) => {
  console.log(selection, peerId)
  useEffect(() => {
    if (selection !== peerId) {
      handleAddNewConversation(() => { })(peerId)
    }
  }, [selection, peerId])
  const handleSendMessage = () => {
    sendMessage(selection, value);
    setValue("");
  };

  const [value, setValue] = useState("")
  return <Box {...props}>
    {conversation && <ChatView messages={conversation} selection={selection} />}
    <Box pad="small" direction="row">
      <TextInput
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSendMessage()
        }}
        reverse={true}
        value={value}
        onChange={event => setValue(event.target.value)}
        icon={<MessageSend onClick={handleSendMessage} />}
      />
    </Box>
  </Box>
}

export default Chat;
