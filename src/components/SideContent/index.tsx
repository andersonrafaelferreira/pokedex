/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Heart, X } from "phosphor-react";

import axios from 'axios';

export type pokemonProps = {
	id: string;
	name: string;
	height: string;
	weight: string;
	order: string;
	base_experience: string;
	sprites: {
		front_default: string;
	};
}

export default function Example({ letsOpen, pokeId, showFavorites }: { letsOpen: boolean, pokeId?: string | null, showFavorites: any }) {
	const [open, setOpen] = useState(true);
	const [details, setDetails] = useState({} as pokemonProps);

	async function getPokemonDetails(id: string | null | undefined) {
		if (!id) return;
		try {
			const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
			setDetails(result.data);
		} catch (error) {
			console.log(error);
		}
	}

	// get details from pokemon from APi
	useEffect(() => {
		getPokemonDetails(pokeId);
	}, [pokeId])

	// open/close side content 
	useEffect(() => {
		setOpen(!open)
	}, [letsOpen])

	function removeFavorite(pokemon: pokemonProps) {
		let favoritedPokemons = localStorage.getItem('@pokedex: favorites');
		let parsed = favoritedPokemons !== null ? JSON.parse(favoritedPokemons) : [];

		let result = parsed ? parsed : [];


		let toRemove = result.filter(item => item.id !== pokemon.id);

		localStorage.setItem('@pokedex: favorites', JSON.stringify(toRemove));
		setFavorited(false);

		showFavorites()
		
	}

	function addFavorite(pokemon: pokemonProps) {
		if (favorited) {
			removeFavorite(pokemon);
			return;
		}

		let favoritedPokemons = localStorage.getItem('@pokedex: favorites');
		let parsed = favoritedPokemons !== null ? JSON.parse(favoritedPokemons) : [];

		let result = parsed ? parsed : [];

		if (result.lenght !== 0) {
			let toSave = [...result, pokemon]

			localStorage.setItem('@pokedex: favorites', JSON.stringify(toSave));
			setFavorited(true);
		} else {
			let newArray = []
			
			let toSave = newArray.push(pokemon)

			localStorage.setItem('@pokedex: favorites', JSON.stringify(toSave));
			setFavorited(true);
		}

	}

	const [favorited, setFavorited] = useState(false)

	function isFavorited(id?: string | null) {

		if (id === null) return;

		let favoritedPokemons: any = localStorage.getItem('@pokedex: favorites');

		let parsed: object[] = favoritedPokemons !== null ? JSON.parse(favoritedPokemons) : [];

		if (parsed.length > 0) {
			let exists = parsed.filter((item) => item.id === id);

			if (exists.length > 0) {
				setFavorited(true)
			} else {
				setFavorited(false)
			}
		}

	}

	useEffect(() => {
		isFavorited(pokeId);
	}, [pokeId])

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-in-out duration-500"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in-out duration-500"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md">
									<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
										<div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-gray-900"> Pokemon Details </Dialog.Title>
												<div className="ml-3 flex h-7 items-center">
													<button
														type="button"
														className="-m-2 p-2 mr-4 hover:opacity-30 outline-none"
														onClick={() => addFavorite(details)}
													>
														<Heart className="h-6 w-6" aria-hidden="true" color={favorited ? '#ef4444' : 'rgb(156, 163, 175)'} />
													</button>
													<button
														type="button"
														className={`-m-2 p-2 text-gray-400 hover:text-gray-500`}
														onClick={() => setOpen(false)}
													>
														<X className="h-6 w-6" aria-hidden="true" />
													</button>
												</div>
											</div>

											<div className="mt-8">
												<div className="flow-root">
													<span key={details?.id} className="group">
														<div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
															<img
																src={details?.sprites?.front_default}
																alt={details?.name}
																className="w-full h-full object-center object-cover group-hover:opacity-75"
															/>
														</div>
														<h3 className="mt-4 text-sm text-gray-700">#{pokeId}</h3>
														<div className="flex flex-1 items-end justify-between text-sm">
															<p className="mt-1 text-lg font-medium text-gray-900 capitalize">{details?.name} </p>

															<div className="flex">
																<a href={`https://www.americanas.com.br/busca/${details.name}`} target="_blank" type="button" className="font-medium text-indigo-600 hover:text-indigo-500">Buy</a>
															</div>
														</div>
													</span>
													<ul role="list" className="-my-6 divide-y divide-gray-200">
														<li className="flex py-6">
															<div className="flex flex-1 flex-col">

																<div className="flex flex-1 items-end justify-between text-sm">
																	<p className="text-gray-500">Height </p>

																	<div className="flex">
																		<a className="font-medium text-gray-600 hover:text-gray-500">{details.height}</a>
																	</div>
																</div>
																<div className="flex flex-1 items-end justify-between text-sm">
																	<p className="text-gray-500">Weight </p>

																	<div className="flex">
																		<a className="font-medium text-gray-600 hover:text-gray-500">{details.weight}</a>
																	</div>
																</div>
																<div className="flex flex-1 items-end justify-between text-sm">
																	<p className="text-gray-500">Order </p>

																	<div className="flex">
																		<a className="font-medium text-gray-600 hover:text-gray-500">{details.order}</a>
																	</div>
																</div>
																<div className="flex flex-1 items-end justify-between text-sm">
																	<p className="text-gray-500">Base Experience </p>

																	<div className="flex">
																		<a className="font-medium text-gray-600 hover:text-gray-500">{details.base_experience}</a>
																	</div>
																</div>

															</div>
														</li>
													</ul>
												</div>
											</div>
										</div>

									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
