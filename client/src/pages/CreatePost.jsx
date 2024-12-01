import { Alert, Button, TextInput } from 'flowbite-react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function AskQuestion() {
  const [formData, setFormData] = useState({ title: '', description: '', tag: '' });
  const [errorMessage, setErrorMessage] = useState(null); // Error message for submission
  const [successMessage, setSuccessMessage] = useState(null); // Success message for submission
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear any previous errors
    setSuccessMessage(null); // Clear any previous success message
    setLoading(true); // Show loading indicator

    // Frontend validation
    if (!formData.title || !formData.description || !formData.tag) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // API call to create a question
      const res = await fetch('/api/v1/question/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // If API responds with an error, set an error message
        setErrorMessage(data.message || 'Failed to create a question.');
        setLoading(false);
        return;
      }

      // If the question is successfully created, navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting question:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Ask a Question</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title Input */}
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Tag Input */}
        <TextInput
          type="text"
          placeholder="Tags (e.g., EMI, Loan)"
          required
          id="tag"
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
          {loading ? 'Submitting...' : 'Submit Question'}
        </Button>

        {/* Success Alert */}
        {successMessage && <Alert className="mt-5" color="success">{successMessage}</Alert>}

        {/* Error Alert */}
        {errorMessage && <Alert className="mt-5" color="failure">{errorMessage}</Alert>}
      </form>
    </div>
  );
}
