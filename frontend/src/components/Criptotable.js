import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';



export default function Criptotable({buscado}) {

  const [coinsList, setCoinsList] = useState([]);
  const [coinsListFiltered, setCoinsListFiltered] = useState([]);
  const history = useHistory();
  
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const classes = useStyles();
  
  const actualizarListado = async () => {
    const criptoresponse = await axios.get('http://localhost:5000/cripto_coins');
    setCoinsList(criptoresponse.data);
    setCoinsListFiltered(criptoresponse.data);
  }

  const handleInformation = (i) => {
    localStorage.setItem("rank", i);
    history.push(`/cripto_coin`);
  }

  const deleteCriptoCoin = (rank) => {
    Swal.fire({
      title: 'Esta seguro?',
      text: "Se eliminará esta criptomoneda de forma permanente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        axios.get(`http://localhost:5000/cripto_coins/delete/${rank}`)
        Swal.fire(
          'Excelente!',
          'Criptomoneda eliminada con éxito!',
          'success'
        )
        window.location.reload(true);
      }
    })
  }

  const handleDelete = async (e) => {
    const rank = await e;
    deleteCriptoCoin(rank)
  }


  useEffect(() => {
    actualizarListado();
  }, []);

  useEffect(() => {
    var coins = coinsList;

    if(buscado)
      coins = coinsList.filter((cl)=>cl.name.includes(buscado));

    setCoinsListFiltered(coins);
  }, [buscado]);


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date added</TableCell>
            <TableCell>Max supply</TableCell>
            <TableCell>Last updated</TableCell>
            <TableCell>Nº market pairs</TableCell>
            <TableCell>Price (USD)</TableCell>
            <TableCell>Actions</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {coinsListFiltered.map((cl, i) => (
            <TableRow key={i+1}>
              <TableCell>{cl['cmc_rank']}</TableCell>
              <TableCell>{cl['name']}</TableCell>
              <TableCell>{cl['date_added']}</TableCell>
              <TableCell>{cl['max_supply']}</TableCell>
              <TableCell>{cl['last_updated']}</TableCell>
              <TableCell>{cl['num_market_pairs']}</TableCell>
              <TableCell>{cl['quote']['USD']['price']}</TableCell>
              <TableCell>
                <div className="info-button" value={i+1}>
                    <InfoOutlinedIcon value={i+1} onClick={(e) => handleInformation(cl['cmc_rank'])} style={{color: "black", cursor: "pointer"}}/>
                </div>
                <div className="delete-button" value={i+1}>
                    <DeleteSharpIcon value={i+1} onClick={(e) => handleDelete(cl['cmc_rank'])} style={{color: "red", cursor: "pointer"}} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}