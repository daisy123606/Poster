import { useState } from 'react';

function EditPost({ post, onSave, onCancel }) {
  const [editedPost, setEditedPost] = useState(post.body);

  function handleEditChange(event) {
    setEditedPost(event.target.value);
  }

  async function handleSave() {
    const updatedPost = {
      ...post,
      body: editedPost,
    };
    await onSave(updatedPost);
  }

  return (
    <div className="form">
      <label htmlFor="editPostBody">Edit Post</label>
      <textarea
        id="editPostBody"
        value={editedPost}
        onChange={handleEditChange}
        rows="5"
        cols="50"
      />
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default EditPost;
