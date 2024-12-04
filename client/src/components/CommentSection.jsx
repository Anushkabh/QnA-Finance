import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({ questionId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length === 0 || comment.length > 200) {
      setCommentError('Comment cannot be empty or exceed 200 characters.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/question/${questionId}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCommentError(data.message || 'Failed to add comment.');
        return;
      }

      // Add the new comment to the comments state
      setComments((prevComments) => [data.comment, ...prevComments]);
      setComment('');
      setCommentError(null); // Clear error
      setSuccessMessage('Comment added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentError('Something went wrong. Please try again later.');
    }
  };

  // Fetch existing comments for the question
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/v1/question/${questionId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []); // Ensure comments is always an array
        } else {
          console.error('Failed to fetch comments.');
          setComments([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]); // Fallback to an empty array
      }
    };
    getComments();
  }, [questionId]);

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {/* Show logged-in user info */}
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <span className="font-bold">{currentUser?.name || 'User'}</span>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}

      {/* Comment input box */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
          {successMessage && (
            <Alert color="success" className="mt-5">
              {successMessage}
            </Alert>
          )}
        </form>
      )}

      {/* Display comments */}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments
            .filter((comment) => comment && comment._id) // Only render valid comments
            .map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
        </>
      )}
    </div>
  );
}
