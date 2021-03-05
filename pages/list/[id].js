import React, { useState } from 'react'
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import { TextField, Button, Paper } from "@material-ui/core";
import moment from "moment"
import axios from "axios"
import { useRouter } from 'next/router'


const List = props => {
  const [name, setName] = useState('')
  const router = useRouter()


  const formHandler = async () => {
    try {
      const response = await axios.post(`${props.url_prefix}/api/assign`, {
         name: name,
         id: props.id
       });
       if (response.status == 200) {
        router.push(`/assigned?name=${name}`)
       } 
    } catch (error) {
      console.log(error)
    }
  }
    return (
      <div  className={styles.container}>
          <Head>
          <title>{props.description}</title>
          <link rel="icon" href="/favicon.ico" />
          {/* <meta name="description" content=""> */}
          <meta name="keywords" content="odontology, odontologia, post" />
        </Head>
        <main className={styles.main}>
        <h1 className={styles.title}>{moment(props.date).format("DD/MM/YYYY")}</h1>
        <Paper className={styles.card}>
          <div className={styles.description}><p>{props.description}</p></div>
          <form className={styles.form} noValidate>
            <TextField
              id="name"
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(ev) => {setName(ev.target.value)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <Button onClick={formHandler} variant="contained">Assinar Lista</Button>
        </Paper>
        </main>
      </div>
    )
  }

  export const getServerSideProps = async (context) => {
    let url_prefix;
    if (process.env.NODE_ENV === 'development') {
        url_prefix = "http://localhost:3000";
    } else {
        url_prefix = "https://presence-list.vercel.app";
    }
    const id = context.params.id
    const res = await fetch(`${url_prefix}/api/${id}`)
    const data = await res.json()
    return {props: { ...data, id, url_prefix}}
  }
  
  export default List