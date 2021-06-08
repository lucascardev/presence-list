import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import { TextField, Button, Paper, Typography } from "@material-ui/core";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import tz from "moment-timezone"

const List = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [data, setData] = useState(moment(props.start).format("DD/MM/YYYY"));
  const [start, setStart] = React.useState(
    moment(props.start).tz("America/Bahia").format()
  );
  const [end, setEnd] = React.useState(
    moment(props.end).tz("America/Bahia").format()
  );
  const [entity, setEntity] = React.useState(props.entity);
  const [empty, setEmpty] = useState(false);
  const [empty_name, setEmptyName] = useState(false);
  const [empty_email, setEmptyEmail] = useState(false);
  const [empty_college, setEmptyCollege] = useState(false);
  const [out, setOut] = useState(false);
  const [out_name, setOutName] = useState(false);
  const [out_email, setOutEmail] = useState(false);
  const [out_college, setOutCollege] = useState(false);
  const [error, setError] = useState("");
  const [error_name, setErrorName] = useState("");
  const [error_email, setErrorEmail] = useState("");
  const [error_college, setErrorCollege] = useState("");
  const router = useRouter();

  useEffect(() => {
    const TimeCheck = async () => {
      if (moment().isSameOrBefore(end) && moment().isSameOrAfter(start)) {
      } else {
        setError("Fora do horário permitido para assinatura da lista.");
        setOut(true);
        setOutName(true);
        setOutCollege(true);
        setOutEmail(true);
      }
    };
    TimeCheck();
  }, []);

  const formHandler = async () => {
    try {
      if (name != "" && email != "" && college != "") {
        const response = await axios.post(`${props.url_prefix}/api/assign`, {
          name: name,
          email: email,
          college: college,
          id: props.id,
        });
        if (response.status == 200) {
          router.push(`/assigned?name=${name}`);
        } else if (response.status == 203) {
          setError(response.data)
        }
      } else if (name == ''){
        setEmptyName(true);
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>{props.description}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <meta name="description" content=""> */}
        <meta name="keywords" content="odontology, odontologia, post" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>{data}</h1>
        <Paper className={out ? styles.card_error : styles.card}>
          <div className={styles.description}>
            <p>{props.description}</p>
          </div>
          <form className={styles.form} noValidate>
            <div>
            <TextField
              error={empty_name || out_name}
              style={{ margin: 8 }}
              disabled={out_name}
              helperText={error_name}
              id="name"
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(ev) => {
                setName(ev.target.value);
                setEmptyName(false);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              error={empty_college || out_college}
              disabled={out_college}
              style={{ margin: 8 }}
              helperText={error_college}
              id="college"
              label="Faculdade"
              type="text"
              value={college}
              onChange={(ev) => {
                setCollege(ev.target.value);
                setEmptyCollege(false);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </div>
            <TextField
              error={empty_email || out_email}
              disabled={out_email}
              helperText={error_email}
              id="email"
              label="Email"
              type="text"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value);
                setEmptyEmail(false);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <Button disabled={out} onClick={formHandler} variant="contained">
            Assinar Lista
          </Button>
          <Typography className={styles.error}>
            {error}
          </Typography>
        </Paper>
      </main>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  let url_prefix;
  if (process.env.NODE_ENV === "development") {
    url_prefix = "http://localhost:3000";
  } else {
    url_prefix = "https://presence-list.vercel.app";
  }
  const id = context.params.id;
  const res = await fetch(`${url_prefix}/api/${id}`);
  const data = await res.json();
  return { props: { ...data, id, url_prefix } };
};

export default List;
