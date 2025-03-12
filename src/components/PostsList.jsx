import { useEffect, useState } from 'react';
import Post from './Post';
import NewPost from './NewPost';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import EditPost from '../components/Edit';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Use environment variable

function PostsList({ isPosting, onStopPosting }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/posts`);
        const resData = await response.json();
        setPosts(resData.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  async function addPostHandler(postData) {
    setLoading(true);
    try {
      await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      setPosts((existingData) => [postData, ...existingData]);
    } catch (error) {
      console.error('Failed to add post:', error);
    }
    setLoading(false);
  }

  async function deletePostHandler(postId) {
    setLoading(true);
    try {
      await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
      });
      setPosts((existingData) =>
        existingData.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
    setLoading(false);
  }

  async function saveEditedPost(updatedPost) {
    setLoading(true);
    try {
      await fetch(`${API_URL}/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });
      setPosts((existingData) =>
        existingData.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
    setLoading(false);
    setEditingPost(null);
  }

  function cancelEdit() {
    setEditingPost(null);
  }

  return (
    <>
      {isPosting && (
        <Modal onCloseModal={onStopPosting}>
          <NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
        </Modal>
      )}

      {loading && <LoadingSpinner />}

      {editingPost && (
        <Modal onCloseModal={cancelEdit}>
          <EditPost post={editingPost} onSave={saveEditedPost} onCancel={cancelEdit} />
        </Modal>
      )}

      {!loading && posts.length > 0 && (
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.id} className="post">
              <Post author={post.author} body={post.body} />
              <div className="post-actions">
                <button onClick={() => setEditingPost(post)}>✏️</button>
                <button onClick={() => deletePostHandler(post.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2>There is no post yet.</h2>
          <p>Try to add some!</p>
        </div>
      )}
    </>
  );
}

export default PostsList;
