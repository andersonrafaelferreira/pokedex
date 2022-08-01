import { useState, SetStateAction, useEffect } from 'react'
import SideContent from './components/SideContent';
import { SquaresFour, Heart } from "phosphor-react";
import axios from 'axios';

import { pokemonProps } from './components/SideContent';

export function App() {
  const [pokemons, setPokemons] = useState([]);
  const [backup, setBackup] = useState([]);

  const [pokeId, setPokeId] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'All' | 'Favorites'>('All');

  // select pokemon to show details
  function invokePokemon(id: SetStateAction<string | number | null>) {
    setShow(!show);
    setPokeId(id)
  }
  
  // request the pokemons from API 
  async function searchPokemons() {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=8');
    setPokemons(response.data.results);
    setBackup(response.data.results);
  }

  useEffect(()=>{
    searchPokemons()
  },[])

  // set favorites
  function showFavorites() {
		let favoritedPokemons: any = localStorage.getItem('@pokedex: favorites');

		let parsed = favoritedPokemons ? JSON.parse(favoritedPokemons): [];

    setPokemons(parsed);
	}
  
  return (

    <div className="bg-white">

      {/* menu */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex items-baseline justify-between pt-24 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Pokedex</h1>

          <div className="flex items-center">

            <button type="button" onClick={() => {
              setSelectedOption('All');
              searchPokemons()
            }} className={`p-2 -m-2 ml-5 sm:ml-7 hover:opacity-30`}>
              <span className="sr-only">View All</span>
              <SquaresFour size={32} color={selectedOption === 'All' ? '#ef4444' : 'rgb(156, 163, 175)'} />
            </button>
            <button type="button" onClick={() => {
              setSelectedOption('Favorites');
              showFavorites()
            }} className={`p-2 -m-2 ml-5 sm:ml-7 hover:opacity-30`}>
              <span className="sr-only">View Favorites</span>
              <Heart size={32} color={selectedOption === 'Favorites' ? '#ef4444' : 'rgb(156, 163, 175)'} />
            </button>

          </div>
        </div>
      </main>
      {/* menu END */}

      {/* Pokemon details */}
      <SideContent pokeId={pokeId} letsOpen={show} showFavorites={showFavorites} />

      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Pokemon</h2>

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {pokemons && pokemons?.map((pokemon: pokemonProps, index) => (
            <a key={pokemon.name} className="group" onClick={() => invokePokemon(pokemon.id ? pokemon.id : index + 1)}>
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={pokemon?.sprites?.front_default 
                    ? pokemon?.sprites?.front_default 
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                  alt={pokemon.name}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">#{pokemon.id ? pokemon.id : index + 1}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900 capitalize">{pokemon.name}</p>
            </a>
          ))}
          {pokemons.length < 1 && <h3 className="mt-4 text-sm text-gray-700">{selectedOption ==='All' ? 'Pokemons not found.' : 'No one pokemon was favorited.'}</h3>}
          {loading && <h3 className="mt-4 text-sm text-gray-700">Searching pokemons .. meanwhile prepare you pokeball</h3>}
        </div>
      </div>
    </div>

  )

}