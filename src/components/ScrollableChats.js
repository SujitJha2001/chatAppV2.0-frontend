import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const downloadFile = (fileObj) => {
    // Assuming fileObj is an object with properties data (binary data) and mimetype (file's MIME type)

    const typecasted_uint8_array = new Uint8Array(fileObj.data.data)

    // Create a Blob from the data and MIME type provided in fileObj
    const fileBlob = new Blob([typecasted_uint8_array], { type: 'application/octet-stream' });

    // Create a link element
    const link = document.createElement('a');

    // Set the href of the link to the object URL of the fileBlob
    link.href = URL.createObjectURL(fileBlob);

    // Set the download attribute to specify a suggested filename (e.g. fileObj.name)
    link.download = fileObj.name || 'downloaded-file';

    // Append the link to the body (optional, but a good practice for compatibility)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);

    // Release the object URL to free up memory
    URL.revokeObjectURL(link.href);
  }

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", paddingTop: '8px', paddingBottom: '8px'}} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "8px 12px",
                maxWidth: "75%",
              }}
            >
              {m.content}
              {
              m.file && 
              <span 
              onClick={() => downloadFile(m.file)}
              style={{
                backgroundColor: 'white',
                height: 'fit-content',
                display: 'block',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
              title="Click To Download"
              >
                <span
                style={{
                  display: 'flex',
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  width: '100%',
                  height: '96px',
                }}
                className="fileIconContainer"
                >
                </span>
                
                <span
                style={{
                  padding: '2px 8px 8px 4px',
                  textAlign: 'center',
                  width: '100%',
                  overflowX: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                  fontSize: '0.8em'
                }}
                title={m.file.name}
                >
                  {m.file.name}
                  </span>
              </span>
              }
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
