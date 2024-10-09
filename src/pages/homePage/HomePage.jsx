import { useEffect, useState } from "react";
import GameCard from "../../components/gameCard/GameCard";
import NavBar from "../../components/navBar/NavBar";
import { Col, Container, Row } from "react-bootstrap";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [platform, setPlatform] = useState(false)
  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  let url = "http://localhost:3001/games?"
  if (platform) url = url + "&platforms=" + platform
  if (search) url = url + "&search=" + search

  const fetchGames = async () => {
    try {
      const resp = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setGames(data.results)
      } else throw new Error("Fetch error");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [platform, search]);

  return (
    <>
      <NavBar search={search} onSearch={search => setSearch(search)} />
      <Container>
        <h1>Home</h1>
        <div className="d-flex flex-column flex-md-row">
          <div className="d-none d-md-block">
            <SideBar platform={platform} onFilter={(platformId) => {
              if (platform === platformId) {
                setPlatform(false)
              } else {
                setPlatform(platformId)
              }
            }}
            />
          </div>
          <div className="d-block d-md-none">
            <SideBar platform={platform} onFilter={(platformId) => {
              if (platform === platformId) {
                setPlatform(false)
              } else {
                setPlatform(platformId)
              }
            }}
            />
          </div>
          <Row className="w-100 mt-3 g-2">
            {games.map(game => (
              <Col xs="12" md="6" lg="3" key={game.id}>
                <GameCard
                  image={game.background_image ?
                    game.background_image :
                    "https://ui-avatars.com/api/?background=random&name=" + game.name}
                  title={game.name}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
