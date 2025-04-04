import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
	const [modal, setModal] = useState(false)
	const [carApi, setCarApi] = useState(null)
	const [carModal, setCarModal] = useState(false)
	const [carModalVl, setCarModalVl] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [editId, setEditId] = useState(null)

	const carName = useRef(null)
	const carModel = useRef(null)
	const carYear = useRef(null)
	const carPrise = useRef(null)

	const [carNameNew, setCarName] = useState('')
	const [carModelNew, setCarModel] = useState('')
	const [carYearNew, setCarYear] = useState('')
	const [carPriseNew, setCarPrise] = useState('')

	function edit(id) {
		const carToEdit = carApi?.find(car => car.id === id)
		if (carToEdit) {
			setCarName(carToEdit.name)
			setCarModel(carToEdit.model)
			setCarYear(carToEdit.year)
			setCarPrise(carToEdit.prise)

			setEditId(id)
			setIsEdit(true)
			setModal(true)

			setTimeout(() => {
				if (carName.current) {
					carName.current.value = carToEdit.name
					carModel.current.value = carToEdit.model
					carYear.current.value = carToEdit.year
					carPrise.current.value = carToEdit.prise
				}
			}, 0)
		}
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (
			carNameNew.trim() === '' ||
			carModelNew.trim() === '' ||
			carYearNew.trim() === '' ||
			carPriseNew.trim() === ''
		) {
			setCarModalVl(true)
			return
		}

		let newCar = {
			name: carNameNew,
			model: carModelNew,
			year: carYearNew,
			prise: carPriseNew,
		}

		if (isEdit) {
			axios
		.put(`http://localhost:3001/car/${editId}`, newCar) 
		.then(() => {
			setIsEdit(false)
			setEditId(null)
			setModal(false)
		})
		.catch(err => console.error(err))
		} else {
			axios
				.post(`http://localhost:3001/car`, newCar)
				.then(() => {
					setCarModal(true)
					setTimeout(() => {
						setCarModal(false)
					}, 2000)
				})
				.catch(error => console.error(error))
		}

		carName.current.value = ''
		carModel.current.value = ''
		carYear.current.value = ''
		carPrise.current.value = ''
		setCarName('')
		setCarModel('')
		setCarYear('')
		setCarPrise('')
		setModal(false)
	}

	useEffect(() => {
		setInterval(() => {
			axios
				.get(`http://localhost:3001/car`)
				.then(response => setCarApi(response.data))
				.catch(error => console.error(error))
		}, 1000)
	}, [])

	function deleteFn(id) {
		axios.delete(`http://localhost:3001/car/${id}`).then(() => {
			setCarApi(carApi?.filter(car => car.id !== id))
		})
	}

	return (
		<>
			{carModalVl && (
				<div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[9999]'>
					<div className='bg-white rounded-2xl px-8 py-6 shadow-xl text-center max-w-[350px] w-[90%] '>
						<div className='text-[50px] mb-4'>🔧</div>
						<p className='text-xl font-semibold text-gray-800'>
							Invalid input. Please check the entered information!
						</p>
						<button
							onClick={() => setCarModalVl(false)}
							className='mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition'
						>
							OK
						</button>
					</div>
				</div>
			)}

			{carModal && (
				<div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-2xl px-8 py-6 shadow-xl text-center max-w-[350px] w-[90%] '>
						<div className='text-[50px] mb-4'>✅</div>
						<p className='text-xl font-semibold text-gray-800'>
							Information added successfully!
						</p>
					</div>
				</div>
			)}

			<section className='w-[90%] max-w-[800px] m-auto py-10'>
				<h1 className='text-[40px] font-bold text-center mb-10 text-blue-600'>
					🚗 Auto Salon Uz
				</h1>

				<div className='text-center mb-10'>
					<button
						onClick={() => setModal(true)}
						className='bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition'
					>
						Add Car
					</button>
				</div>

				{modal && (
					<div className='fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50'>
						<div className='bg-white w-[90%] max-w-[450px] rounded-2xl p-6 shadow-lg relative'>
							<button
								onClick={() => setModal(false)}
								className='absolute top-4 right-4 text-gray-600 hover:text-red-500 text-[22px]'
							>
								&times;
							</button>
							<h2 className='text-[24px] font-semibold text-center mb-6'>
								Add New Car
							</h2>
							<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
								<input
									ref={carName}
									onKeyUp={() => setCarName(carName.current.value)}
									className='border rounded-lg px-4 py-2 outline-none'
									type='text'
									placeholder='Car Name...'
								/>
								<input
									ref={carModel}
									onKeyUp={() => setCarModel(carModel.current.value)}
									className='border rounded-lg px-4 py-2 outline-none'
									type='text'
									placeholder='Car Model...'
								/>
								<input
									ref={carYear}
									onKeyUp={() => setCarYear(carYear.current.value)}
									className='border rounded-lg px-4 py-2 outline-none'
									type='number'
									placeholder='Car Year...'
								/>
								<input
									ref={carPrise}
									onKeyUp={() => setCarPrise(carPrise.current.value)}
									className='border rounded-lg px-4 py-2 outline-none'
									type='text'
									placeholder='Car Price...'
								/>
								<button
									type='submit'
									className='bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition'
								>
									{isEdit ? "Update Car" : "Add Car"}
								</button>
							</form>
						</div>
					</div>
				)}

				<div className='h-screen overflow-auto p-4'>
					{carApi?.length > 0 ? (
						carApi?.map(car => {
							return (
								<div
									key={car?.id}
									className='bg-white border shadow-md rounded-xl px-6 py-4 space-y-3 mb-[25px]'
								>
									<div className='flex justify-between text-lg font-medium'>
										<p>Name:</p>
										<p className='text-gray-800 hover:text-blue-600 cursor-pointer'>
											{car?.name}
										</p>
									</div>
									<div className='flex justify-between text-lg font-medium'>
										<p>Model:</p>
										<p className='text-gray-800 hover:text-blue-600 cursor-pointer'>
											{car?.model}
										</p>
									</div>
									<div className='flex justify-between text-lg font-medium'>
										<p>Year:</p>
										<p className='text-gray-800 hover:text-blue-600 cursor-pointer'>
											{car?.year}
										</p>
									</div>
									<div className='flex justify-between text-lg font-medium'>
										<p>Price:</p>
										<p className='text-gray-800 hover:text-blue-600 cursor-pointer'>
											${car?.prise}
										</p>
									</div>
									<div className='flex justify-between text-lg font-medium'>
										<p>Settings:</p>
										<div className='flex item-center gap-[10px]'>
											<p
												onClick={() => edit(car?.id)}
												className='w-[90px] p-[5px] text-center rounded bg-green-500 text-[#fff] cursor-pointer'
											>
												edit
											</p>
											<p
												onClick={() => deleteFn(car?.id)}
												className='w-[90px] p-[5px] text-center rounded bg-blue-500 text-[#fff] cursor-pointer'
											>
												delete
											</p>
										</div>
									</div>
								</div>
							)
						})
					) : (
						<div className='flex justify-center items-center p-10 bg-gray-100 rounded-xl shadow-lg mt-10'>
							<p className='text-2xl font-semibold text-gray-600'>
								🚗 <span className='text-blue-600'>No cars</span> available
							</p>
						</div>
					)}
				</div>
			</section>
		</>
	)
}
