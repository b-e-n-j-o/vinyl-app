// src/components/VinylPostsList.jsx
'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { Disc, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const VinylPostsList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/vinyl-posts?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching vinyl posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Disc className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Aucun vinyle</h3>
        <p className="mt-2 text-gray-500">Commencez à ajouter des vinyles à votre collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="aspect-square relative">
            {post.imageUrl ? (
              <img 
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Disc className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <Link 
              href={`/vinyl/${post.id}`}
              className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity"
            />
          </div>

          <div className="p-4">
            <h3 className="font-medium text-lg text-gray-900 truncate">
              {post.title}
            </h3>
            <p className="text-gray-600 truncate">{post.artist}</p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <Link 
                href={`/vinyl/${post.id}`}
                className="inline-flex items-center text-purple-600 hover:text-purple-700"
              >
                <span className="text-sm">Voir détails</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VinylPostsList;