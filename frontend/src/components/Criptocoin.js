import React, {Fragment, useState, useEffect} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Container from '@material-ui/core/Container';



export default function Criptocoin() {
    const [criptoData, setCriptoData] = useState([]);
    const [quote, setQuote] = useState([])


    const getData = async () => {
        const rank = localStorage.getItem("rank");
        const coin_response = await axios.get(`http://localhost:5000/cripto_coin/${rank}`);
        setCriptoData(coin_response.data[0]);
        setQuote(coin_response.data[0]['quote']['USD'])
    }

    useEffect(()=> {
        getData();
    }, [])


    return(
        <Fragment>
            <Navbar />
            <Container fixed>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="row" colSpan="3" style={{textAlign: "center", fontSize: "25px"}}>{criptoData['name']}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">Rank</th>
                        <td colSpan="2">{criptoData['cmc_rank']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Circulating supply</th>
                        <td colSpan="2">{criptoData['circulating_supply']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Date added</th>
                        <td colSpan="2">{criptoData['date_added']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Id</th>
                        <td colSpan="2">{criptoData['id']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Last updated</th>
                        <td colSpan="2">{criptoData['last_updated']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Max supply</th>
                        <td colSpan="2">{criptoData['max_supply']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Market pairs</th>
                        <td colSpan="2">{criptoData['num_market_pairs']}</td>
                        </tr>

                        <tr>
                            <th scope="row" rowSpan="6">Quote(USD)</th>
                            <th scope="row">Market cap</th>
                            <td>{quote['market_cap']}</td>
                        </tr>

                        <tr>
                        <th scope="row" style={{border: "none"}}>% Change (1h)</th>
                        <td style={{border: "none"}}>{quote['percent_change_1h']}</td>
                        </tr>

                        <tr>
                        <th scope="row" style={{border: "none"}}>% Change (24h)</th>
                        <td style={{border: "none"}}>{quote['percent_change_24h']}</td>
                        </tr>

                        <tr>
                        <th scope="row" style={{border: "none"}}>% Change (7d)</th>
                        <td style={{border: "none"}}>{quote['percent_change_7d']}</td>
                        </tr>

                        <tr>
                        <th scope="row" style={{border: "none"}}>Price</th>
                        <td style={{border: "none"}}>{quote['price']}</td>
                        </tr>

                        <tr>
                        <th scope="row" style={{border: "none"}}>Volume 24h</th>
                        <td style={{border: "none"}}>{quote['volume_24h']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Slug</th>
                        <td colSpan="2">{criptoData['slug']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Symbol</th>
                        <td colSpan="2">{criptoData['symbol']}</td>
                        </tr>

                        <tr>
                        <th scope="row">Total supply</th>
                        <td colSpan="2">{criptoData['total_supply']}</td>
                        </tr>
                    </tbody>
                </table>
            </Container>
        </Fragment>


    );
}