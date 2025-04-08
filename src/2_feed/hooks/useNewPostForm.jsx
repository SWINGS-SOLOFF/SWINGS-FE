import { useState } from "react";

const useNewPostForm = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const reset = () => {
    setNewPostContent("");
    setNewPostImage(null);
    setImagePreview(null);
  };

  return {
    newPostContent,
    setNewPostContent,
    newPostImage,
    imagePreview,
    handleImageChange,
    reset,
  };
};

export default useNewPostForm;
