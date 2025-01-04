import React from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import PostShare from "../Post/PostShare";

function ShareModal({ modalOpened, setModalOpened }) {
  const theme = useMantineTheme();

  // Callback khi tạo bài thành công
  const handlePostCreateSuccess = () => {
    setModalOpened(false); // Đóng modal khi tạo bài thành công
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.5} // Độ mờ của overlay
      overlayBlur={5} // Độ mờ của background
      size="lg" // Điều chỉnh kích thước modal phù hợp
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      padding="xl" // Tùy chỉnh padding cho modal
    >
      <PostShare onPostCreateSuccess={handlePostCreateSuccess} />
    </Modal>
  );
}

export default ShareModal;
