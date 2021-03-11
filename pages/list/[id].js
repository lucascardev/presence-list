import React, { useState, useEffect } from 'react'
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import { TextField, Button, Paper } from "@material-ui/core";
import moment from "moment"
import axios from "axios"
import { useRouter } from 'next/router'
import tz from "moment-timezone"

const List = props => {


  const [name, setName] = useState('')
  const [data, setData] = useState(moment(props.start).format("DD/MM/YYYY"))
  const [start, setStart] = React.useState(moment(props.start).tz('America/Bahia').format())
  const [end, setEnd] = React.useState(moment(props.end).tz('America/Bahia').format())
  const [entity, setEntity] = React.useState(props.entity)
  const [empty, setEmpty] = useState(false)
  const [out, setOut] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const TimeCheck = async () => {
      if ( moment().isSameOrBefore(end) && moment().isSameOrAfter(start) ){
        
      } else {
        setError('Fora do horário permitido para assinatura da lista.')
        setOut(true)
      }
    };
    TimeCheck()
  }, [])
  
  const formHandler = async () => {
    try {
      if (name != '') {
        const response = await axios.post(`${props.url_prefix}/api/assign`, {
            name: name,
            id: props.id
          });
          if (response.status == 200) {
           router.push(`/assigned?name=${name}`)
          } 
      } else {
        setEmpty(true)
        return false
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
        <h1 className={styles.title}>{data}</h1>
        <Paper className={styles.card}>
          <div className={styles.description}><p>{props.description}</p></div>
          <form className={styles.form} noValidate>
            <TextField
              error={empty || out}
              disabled={out}
              helperText={error}
              id="name"
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(ev) => {setName(ev.target.value); setEmpty(true)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <Button disabled={out} onClick={formHandler} variant="contained">Assinar Lista</Button>
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