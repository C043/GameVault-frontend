import "./GamePage.scss"
import { Container, Button, Form, Modal, Alert } from "react-bootstrap"
import NavBar from "../../components/navBar/NavBar"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import GameCover from "../../components/gameCover/GameCover"
import Footer from "../../components/footer/Footer"
import GameNotesComponent from "../gameNotes/GameNotesComponent"
import RatingComponent from "../../components/ratingComponent/RatingComponent"
import ReviewsComponent from "../../components/reviewsComponent/ReviewsComponent"
import AddToCustomListComponent from "../../components/addToCustomListComponent/AddToCustomListComponent"

const GamePage = () => {
	const params = useParams()
	const token = localStorage.getItem("token")
	const [game, setGame] = useState()
	const [backlog, setBacklog] = useState(false)
	const [playing, setPlaying] = useState(false)
	const [played, setPlayed] = useState(false)
	const [rating, setRating] = useState(0)
	const [list, setList] = useState("")
	const [hasError, setHasError] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)

	const url = import.meta.env.VITE_URL

	const fetchGame = async () => {
		setHasError(false)
		setIsLoaded(false)
		try {
			const resp = await fetch(`${url}/games/${params.gameId}`, {
				headers: {
					"Authorization": "Bearer " + token
				}
			})
			if (resp.ok) {
				const data = await resp.json()
				setGame(data)
				fetchLists("backlog")
				fetchLists("playing")
				fetchLists("played")
			} else throw new Error("Fetch Error")
		} catch (error) {
			setHasError(true)
			console.log(error.message)
		} finally {
			setIsLoaded(true)
		}
	}

	const addToList = async (list) => {
		try {
			const resp = await fetch(`${url}/lists/${list}`, {
				method: "POST",
				body: JSON.stringify({
					gameId: game.id,
					userRating: rating
				}),
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-type": "application/json"
				}
			})
			if (resp.ok) {
				fetchLists("backlog")
				fetchLists("playing")
				fetchLists("played")
			} else throw new Error(resp.message)
		} catch (error) {
			console.log(error.message)
		}
	}

	const removeFromList = async list => {
		try {
			const resp = await fetch(`${url}/lists/${list}/${game.id}`, {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer " + token,
				}
			})
			if (resp.ok) {
				fetchLists("backlog")
				fetchLists("playing")
				fetchLists("played")
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const fetchLists = async (list) => {
		try {
			const resp = await fetch(`${url}/lists/${list}`, {
				headers: {
					"Authorization": "Bearer " + token
				},
			})
			if (resp.ok) {
				const data = await resp.json()
				const isPresent = data.filter(listItem =>
					listItem.gameId === parseInt(params.gameId)
				)
				if (isPresent.length > 0) {
					switch (list) {
						case "backlog": {
							setBacklog(true)
							setPlayed(false)
							setPlaying(false)
							setRating(isPresent[0].userRating)
							setList("backlog")
							break
						}
						case "playing": {
							setPlaying(true)
							setBacklog(false)
							setPlayed(false)
							setRating(isPresent[0].userRating)
							setList("playing")
							break
						}
						case "played": {
							setPlayed(true)
							setBacklog(false)
							setPlaying(false)
							setRating(isPresent[0].userRating)
							setList("played")
							break
						}
					}
				}
			} else throw new Error(resp.message)
		} catch (error) {
			console.log(error.message)
		}
	}

	useEffect(() => {
		fetchGame()
	}, [])

	return <>
		<NavBar />
		<Container>
			{hasError && isLoaded && <Alert variant="danger">Fetch Error</Alert>}
			{game &&
				<>
					<GameCover cover={game.background_image_additional} />
					<div
						className="d-flex flex-column flex-md-row align-items-center 
						align-items-md-start gap-4 mt-5"
					>
						<div className="d-flex flex-column">
							<img src={game.background_image} className="gameImage" />
							<div className="d-none d-md-block">
								<ReviewsComponent gameId={params.gameId} />
							</div>
						</div>
						<div className="d-flex flex-column align-items-start">
							<h1>{game.name}</h1>
							<div className="buttons d-flex gap-3">
								<div role="button" onClick={() => {
									if (!backlog) {
										addToList("backlog")
										setBacklog(true)
										setPlaying(false)
										setPlayed(false)
									}
									else {
										removeFromList("backlog")
										setList("")
										setBacklog(false)
									}
								}}>
									<Button
										className="rounded rounded-pill" variant="secondary"
									>
										<div className="d-flex gap-1">
											<Form.Check
												type={"radio"}
												checked={backlog}
												readOnly
											/>
											Backlog
										</div>
									</Button>
								</div>
								<div role="button" onClick={() => {
									if (!playing) {
										setPlaying(true)
										addToList("playing")
										setBacklog(false)
										setPlayed(false)
									}
									else {
										setPlaying(false)
										removeFromList("playing")
										setList("")
									}
								}
								}>
									<Button
										className="rounded rounded-pill" variant="danger"
									>
										<div className="d-flex gap-1">
											<Form.Check
												type={"radio"}
												checked={playing}
												readOnly
											/>
											Playing
										</div>
									</Button>
								</div>
								<div role="button" onClick={() => {
									if (!played) {
										setPlayed(true)
										addToList("played")
										setBacklog(false)
										setPlaying(false)
									}
									else {
										removeFromList("played")
										setList("")
										setPlayed(false)
									}
								}
								}
								>
									<Button
										className="rounded rounded-pill"
									>
										<div className="d-flex gap-1">
											<Form.Check
												type={"radio"}
												checked={played}
												readOnly
											/>
											Played
										</div>
									</Button>
								</div>
							</div>
							<AddToCustomListComponent />
							{list && <RatingComponent
								list={list}
								ratingSetter={(rat) => setRating(rat)}
								userRating={rating} gameId={params.gameId}
							/>}
							<h2 className="mt-3">Description</h2>
							<div dangerouslySetInnerHTML={{ __html: game.description }} />
							<GameNotesComponent gameId={params.gameId} />
							<div className="d-block d-md-none">
								<ReviewsComponent gameId={params.gameId} />
							</div>
						</div>
					</div>
				</>
			}
		</Container >
		<Footer />
	</>
}

export default GamePage
