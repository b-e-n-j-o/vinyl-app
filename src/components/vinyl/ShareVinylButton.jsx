import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

const ShareVinylButton = ({ vinyl }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [comment, setComment] = useState('');
  const { data: session, status } = useSession();

  const handleShare = async () => {
    if (!comment.trim() || !session?.user) return;

    try {
      const response = await fetch('/api/vinyl/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          vinylId: String(vinyl.discogsId || vinyl.id),
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to share vinyl');
      }

      setComment('');
      setIsSharing(false);
    } catch (error) {
      console.error('Error sharing vinyl:', error);
    }
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="mt-6">
      {!isSharing ? (
        <button
          onClick={() => setIsSharing(true)}
          className="flex items-center justify-center gap-2 w-full bg-[#f3e5ab] hover:bg-[#F6ECC4] 
                   text-[#6F4E37] py-3 px-4 rounded-lg transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Partager ce vinyl
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <textarea
            placeholder="Partagez votre avis sur ce vinyl..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-[#421C10] focus:border-transparent"
            rows={4}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleShare}
              disabled={!comment.trim()}
              className="flex-1 bg-[#421C10] text-white py-2 px-4 rounded-lg 
                       hover:bg-[#2a1208] transition-colors disabled:bg-gray-300"
            >
              Partager
            </button>
            <button
              onClick={() => {
                setIsSharing(false);
                setComment('');
              }}
              className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareVinylButton;