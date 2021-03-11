import React from 'react'
import Head from "next/head";
import styles from "../styles/Home.module.css";
import moment from "moment";
import { TextField, Button, Paper, Modal, Card, CardContent, Typography, InputAdornment, Switch, FormControlLabel, FormGroup } from "@material-ui/core";
import axios from "axios";
import {FiCopy} from 'react-icons/fi'

export default function Home() {
  const [description, setDescription] = React.useState('')
  const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"))
  const [start, setStart] = React.useState('')
  const [end, setEnd] = React.useState('')
  const [entity, setEntity] = React.useState('LADI')
  const [email, setEmail] = React.useState('ladibahiana@gmail.com')
  const [internal, setInternal] = React.useState(true)
  const [link, setLink] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formHandler = async () => {
    try {
      let url_prefix;
      if (process.env.NODE_ENV === 'development') {
          url_prefix = "http://localhost:3000";
      } else {
          url_prefix = "https://presence-list.vercel.app";
      }
      const startDate = await moment(`${date}/${start}`, "YYYY-MM-DD/hh:mm").format()
      const endDate = await moment(`${date}/${end}`,"YYYY-MM-DD/hh:mm").format()
      console.log(startDate);
      const response = await axios.post(`api/new`, {
         start: startDate,
         end: endDate,
         entity: entity,
         email: email,
         internal: internal,       
         description: description
       });
       console.log(JSON.stringify(response));
       await setLink(`${url_prefix}/list/${response.data._id}`)
       handleOpen()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickCopy = () => {
    navigator.clipboard.writeText(link);
  };

  const handleChange = (event) => {
    setInternal(event.target.checked);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lista de presença LADI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Lista de presença LADI</h1>
        <Paper className={styles.card}>
          <div className={styles.description}><p>Formulário para criar nova lista</p></div>
        
          <form className={styles.form} noValidate>
           <div> 
             <TextField
              id="description"
              style={{ margin: 8 }}
              label="Nome do evento"
              value={description}
              onChange={(ev) => {setDescription(ev.target.value)}}
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="entity"
              style={{ margin: 8 }}
              label="Liga"
              disabled
              value={entity}
              onChange={(ev) => {setEntity(ev.target.value)}}
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
             <TextField
              id="email"
              style={{ margin: 8 }}
              label="email"
              disabled
              value={email}
              onChange={(ev) => {setEmail(ev.target.value)}}
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            </div>
            <div>
            <TextField
              id="date"
              style={{ margin: 8 }}
              label="Data"
              type="date"
              value={date}
              onChange={(ev) => {setDate(ev.target.value)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="start"
              style={{ margin: 8 }}
              label="Início"
              type="time"
              value={start}
              onChange={(ev) => {setStart(ev.target.value)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="end"
              style={{ margin: 8 }}
              label="Final"
              type="time"
              value={end}
              onChange={(ev) => {setEnd(ev.target.value)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </div>
            <FormGroup row>
            <FormControlLabel
              control={<Switch checked={internal} onChange={handleChange} name="internal" />}
              label="Evento Interno"
      />
            </FormGroup>
           
          </form>
          <Button onClick={formHandler} variant="contained">Criar Lista</Button>
        </Paper>
      </main>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal"
        aria-describedby="simple-modal"
        className={styles.modal}
      >
        <Card className={styles.link_card}>
        <CardContent> 
        <Typography className={styles.title} color="textSecondary" gutterBottom>
        O link da nova lista de presença é:
        </Typography>
        <TextField
          id="read-only-input"
          label="Link"
          fullWidth
          defaultValue={link}
          size="large"
          helperText="Clique no botão ao lado para copiar"
          InputProps={{
            readOnly: true,
            endAdornment: <InputAdornment position="end"><Button onClick={handleClickCopy}><FiCopy/></Button></InputAdornment>,
          }}
        /> 
        </CardContent>
        </Card>
      </Modal>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
