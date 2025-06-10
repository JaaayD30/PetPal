import React, { useEffect, useState } from 'react';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get favorites from localStorage (or replace this with user context/backend logic)
  const getFavoriteIds = () => {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  };

  const fetchFavoritePets = async () => {
    setLoading(true);
    const favoriteIds = getFavoriteIds();

    try {
      const fetchedPets = await Promise.all(
        favoriteIds.map(id =>
          fetch(`http://localhost:5000/api/pets/${id}`).then(res => res.json())
        )
      );
      setFavoritePets(fetchedPets);
    } catch (error) {
      console.error('Error fetching favorite pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritePets();
  }, []);

  const removeFromFavorites = (idToRemove) => {
    const updatedFavorites = getFavoriteIds().filter(id => id !== idToRemove);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavoritePets(prev => prev.filter(pet => pet._id !== idToRemove));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Favorite Pets</h2>

      {loading ? (
        <p>Loading favorites...</p>
      ) : favoritePets.length === 0 ? (
        <p>You have no favorite pets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favoritePets.map(pet => (
            <div
              key={pet._id}
              className="border rounded-xl shadow p-4 flex flex-col items-center"
            >
              {pet.images && pet.images[0] && (
                <img
                  src={`http://localhost:5000/uploads/${pet.images[0]}`}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-bold">{pet.name}</h3>
              <p>{pet.breed}</p>
              <p>{pet.bloodType}</p>
              <button
                className="mt-2 text-sm text-red-500 hover:underline"
                onClick={() => removeFromFavorites(pet._id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
