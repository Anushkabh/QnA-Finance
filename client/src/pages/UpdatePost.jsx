import { Alert, Button, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateQuestion() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Fetch question details on mount
  useEffect(() => {
    if (!questionId) {
      setErrorMessage('Invalid question ID');
      return;
    }

    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/v1/question/${questionId}/all`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentUser?.token}` // Ensure token is sent if required
          }
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.message || 'Failed to fetch question details.');
          return;
        }
        setFormData({
          title: data.question.title,
          description: data.question.description,
          tag: data.question.tag
        });
      } catch (error) {
        console.error('Error fetching question:', error);
        setErrorMessage('Something went wrong. Please try again later.');
      }
    };

    if (currentUser) fetchQuestion();
  }, [questionId, currentUser]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/question/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'Failed to update the question.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Question updated successfully.');
      setLoading(false);

      // Redirect after successful update
      navigate(`/question/${questionId}/all`);
    } catch (error) {
      console.error('Error updating question:', error);
      setErrorMessage('Something went wrong. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Question</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title Input */}
        <TextInput
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Tag Input */}
        <TextInput
          type="text"
          placeholder="Tags (e.g., JavaScript, React)"
          required
          value={formData.tag}
          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
        />

        {/* Description Editor */}
        <ReactQuill
          theme="snow"
          placeholder="Write your question details here..."
          className="h-72 mb-12"
          required
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />

        {/* Submit Button */}
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
          {loading ? 'Updating...' : 'Update Question'}
        </Button>

        {/* Success and Error Messages */}
        {successMessage && <Alert color="success" className="mt-5">{successMessage}</Alert>}
        {errorMessage && <Alert color="failure" className="mt-5">{errorMessage}</Alert>}
      </form>
    </div>
  );
}

