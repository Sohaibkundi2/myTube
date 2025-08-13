import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteTweet } from '../api';
import ConfirmDialog from './../compunents/ConfirmDialog';

const DeleteTweet = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(true)

  const { tweetId } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      setMessage(null);
      await deleteTweet(tweetId);
      setMessage("Tweet deleted successfully");
      setTimeout(() => navigate('/tweets'), 1500);
    } catch (error) {
      setMessage("tweet not deleted");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    navigate('/tweets');
  };

  return (
    <div className="text-center p-8">
      <p className="text-white">{loading ? "Deleting..." : message}</p>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this tweet?"
        onConfirm={() => {
          setShowConfirm(false);
          handleDelete();
        }}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default DeleteTweet;
