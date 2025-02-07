// // src/components/users/UserSearchResults.jsx
// 'use client';

// import { useState, useEffect } from 'react';

// export function UserSearchResults({ mode, query }) {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const searchUsers = async () => {
//       if (!query) {
//         setUsers([]);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(
//           `/api/users/search?mode=${mode}&query=${encodeURIComponent(query)}`
//         );
        
//         if (!response.ok) throw new Error('Search failed');
        
//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         setError('Impossible de charger les résultats');
//         console.error('Search error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const timeoutId = setTimeout(searchUsers, 300);
//     return () => clearTimeout(timeoutId);
//   }, [query, mode]);

//   const handleFollow = async (userId, isFollowing) => {
//     try {
//       const response = await fetch(`/api/users/${userId}/follow`, {
//         method: isFollowing ? 'DELETE' : 'POST',
//       });

//       if (!response.ok) throw new Error('Action failed');

//       setUsers(users.map(user => 
//         user.id === userId 
//           ? { ...user, isFollowing: !isFollowing }
//           : user
//       ));

//     } catch (error) {
//       console.error('Follow error:', error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         {error}
//       </div>
//     );
//   }

//   if (!query) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         Commencez à taper pour rechercher des utilisateurs
//       </div>
//     );
//   }

//   if (users.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         Aucun résultat trouvé
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-4">
//       {users.map((user) => (
//         <div key={user.id} className="bg-white p-4 rounded-lg shadow border">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
//               {user.image ? (
//                 <img 
//                   src={user.image} 
//                   alt={user.username}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
//                   {user.username.slice(0, 2).toUpperCase()}
//                 </div>
//               )}
//             </div>
            
//             <div className="flex-1 min-w-0">
//               <h4 className="font-medium truncate">{user.username}</h4>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
//                   {user.city}
//                 </span>
//                 {user.musicGenres.slice(0, 3).map(genre => (
//                   <span 
//                     key={genre}
//                     className="text-xs bg-gray-100 px-2 py-1 rounded-full"
//                   >
//                     {genre}
//                   </span>
//                 ))}
//                 {user.musicGenres.length > 3 && (
//                   <span className="text-xs text-gray-500">
//                     +{user.musicGenres.length - 3}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => handleFollow(user.id, user.isFollowing)}
//               className={`px-4 py-1 rounded-full text-sm transition-colors ${
//                 user.isFollowing 
//                   ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
//                   : 'bg-blue-500 hover:bg-blue-600 text-white'
//               }`}
//             >
//               {user.isFollowing ? 'Unfollow' : 'Follow'}
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }