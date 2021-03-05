import React from 'react'
import Head from "next/head";
import styles from "../styles/Home.module.css";
import moment from "moment";
import { TextField, Button, Paper, Modal } from "@material-ui/core";
import axios from "axios";

export default function Home() {
  const [description, setDescription] = React.useState('')
  const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"))
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
      const response = await axios.post(`api/new`, {
         data: date,
         description: description
       });
       console.log(JSON.stringify(response));
       await setLink(`${url_prefix}/list/${response.data._id}`)
       handleOpen()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Lista de presença LADI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Lista de presença LADI</h1>
        <Paper className={styles.card}>
          <div className={styles.description}><p >Adicionar Nova Lista</p></div>
        
          <form className={styles.form} noValidate>
            <TextField
              id="date"
              label="Data"
              type="date"
              value={date}
              onChange={(ev) => {setDate(ev.target.value)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="description"
              label="Descrição"
              value={description}
              onChange={(ev) => {setDescription(ev.target.value)}}
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <Button onClick={formHandler} variant="contained">Criar Lista</Button>
        </Paper>
      </main>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper>
          O link da sua lista de presença é: {link}
        </Paper>
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
