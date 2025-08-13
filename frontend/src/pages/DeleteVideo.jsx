import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteVideo } from '../api';
import ConfirmDialog from './../compunents/ConfirmDialog';

const DeleteVideo = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(true)

  const { videoId } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      setMessage(null);
      await deleteVideo(videoId);
      setMessage("Video deleted successfully");
      setTimeout(() => navigate('/videos'), 1500);
    } catch (error) {
      setMessage("Video not deleted");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    navigate('/profile');
  };

  return (
    <div className="text-center p-8">
      <p className="text-white">{loading ? "Deleting..." : message}</p>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this video?"
        onConfirm={() => {
          setShowConfirm(false);
          handleDelete();
        }}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default DeleteVideo;
