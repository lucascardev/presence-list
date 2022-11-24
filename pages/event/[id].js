import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import {
  TextField,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@material-ui/core";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import tz from "moment-timezone";
import _ from "lodash";
import { FiCopy } from "react-icons/fi"; 




const Event = (props) => {
  const router = useRouter();

  const [data, setData] = useState(moment(props.start).format("DD/MM/YYYY"));
  const [start, setStart] = React.useState(moment(props.start).format("hh:mm"));
  const [end, setEnd] = React.useState(moment(props.end).format("hh:mm"));
  const [entity, setEntity] = React.useState(props.entity);
  const [description, setDescription] = React.useState(props.description);
  const [organizer_email, setOrganizerEmail] = React.useState(
    props.organizer_email
  );
  const [google_meet_link, setGoogleMeetLink] = React.useState(
    props.google_meet_link
  );
  const [zoom_link, setZoomLink] = React.useState(props.zoom_link);
  const [participants, setParticipants] = React.useState(props.participants);

  const [empty_description, setEmptyDescription] = useState(false);
  const [empty_organizer_email, setEmptyOrganizerEmail] = useState(false);
  const [empty_entity, setEmptyEntity] = useState(false);
  const [empty_google_meet_link, setEmptyGoogleMeetLink] = useState(false);
  const [empty_zoom_link, setEmptyZoomLink] = useState(false);

  const [out_description, setOutDescription] = useState(false);
  const [out_organizer_email, setOutOrganizerEmail] = useState(false);
  const [out_entity, setOutEntity] = useState(false);
  const [out_google_meet_link, setOutGoogleMeetLink] = useState(false);
  const [out_zoom_link, setOutZoomLink] = useState(false);

  const [error_description, setErrorDescription] = useState("");
  const [error_organizer_email, setErrorOrganizerEmail] = useState("");
  const [error_entity, setErrorEntity] = useState("");
  const [error_google_meet_link, setErrorGoogleMeetLink] = useState("");
  const [error_zoom_link, setErrorZoomLink] = useState("");

  const [subscription_link, setSubscriptionLink] = useState(
    `${props.url_prefix}/subscription_list/${props._id}`
  );
  const [link, setLink] = useState(
    `${props.url_prefix}/list/${props._id}`
  );

  const formHandler = async () => {
    try {
      let url_prefix;
      if (process.env.NODE_ENV === "development") {
        url_prefix = "http://localhost:3000";
      } else {
        url_prefix = "https://presence-list.vercel.app";
      }
      if (description != "" && organizer_email != "" && entity != "") {
        const response = await axios.post(`/api/edit`, {
          description: description,
          google_meet_link: google_meet_link,
          zoom_link: zoom_link,
          organizer_email: organizer_email,
          entity: entity,
          id: props._id,
          unique_id: props.unique_id,
        });
        if (response.status == 200) {
          console.log("event changed");
          
        }
      } else {
        setEmpty(true);
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const editCertificateHandler = async () => {
    try {
      let loaded;
      _.isEmpty(props.certificates) ? (loaded = false) : (loaded = true);
      router.push(
        `${props.url_prefix}/event/certificate/edit?unique_id=${props.unique_id}&loaded=${loaded}`
      );
    } catch (error) {}
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{description}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <meta name="description" content=""> */}
        <meta name="keywords" content="odontology, odontologia, post" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>{data}</h1>
        <div className={styles.content}>
          <Paper className={styles.card}>
            <div className={styles.description}>
              <p>{props.description}</p>
            </div>
            <form className={styles.form} noValidate>
              <div>
                <TextField
                  error={empty_description || out_description}
                  disabled={out_description}
                  style={{ margin: 8 }}
                  helperText={error_description}
                  id="description"
                  label="Nome do evento"
                  type="text"
                  value={description}
                  onChange={(ev) => {
                    setDescription(ev.target.value);
                    setEmptyDescription(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  error={empty_entity || out_entity}
                  disabled={out_entity}
                  style={{ margin: 8 }}
                  helperText={error_entity}
                  id="entity"
                  label="Organização"
                  type="text"
                  value={entity}
                  onChange={(ev) => {
                    setEntity(ev.target.value);
                    setEmptyEntity(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  error={empty_organizer_email || out_organizer_email}
                  disabled={out_organizer_email}
                  style={{ margin: 8 }}
                  helperText={error_organizer_email}
                  id="organizer_email"
                  label="Email do organizador"
                  type="text"
                  value={organizer_email}
                  onChange={(ev) => {
                    setOrganizerEmail(ev.target.value);
                    setEmptyOrganizerEmail(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div>
                <Typography
                  className={styles.description}
                  color="textSecondary"
                  gutterBottom
                >
                  Este é seu link da lista de inscrição, deve ser enviada para
                  os convidados do evento.
                </Typography>
                <TextField
                  id="read-only-input"
                  label="Link para inscrição"
                  defaultValue={subscription_link}
                  size="large"
                  helperText="Clique no botão ao lado para copiar"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => handleClickCopy(subscription_link)}
                        >
                          <FiCopy />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography
                  className={styles.description}
                  color="textSecondary"
                  gutterBottom
                >
                  O link da lista de presença que deve ser indicada aos
                  participantes enquanto o evento ocorrer é:
                </Typography>
                <TextField
                  id="read-only-input"
                  label="Link"
                  
                  defaultValue={link}
                  size="large"
                  helperText="Clique no botão ao lado para copiar"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={() => handleClickCopy(link)}>
                          <FiCopy />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  error={empty_google_meet_link || out_google_meet_link}
                  disabled={out_google_meet_link}
                  style={{ margin: 8 }}
                  fullWidth
                  helperText={error_google_meet_link}
                  id="google_meet_link"
                  label="Link Google Meet para acessar o evento"
                  type="text"
                  value={google_meet_link}
                  onChange={(ev) => {
                    setGoogleMeetLink(ev.target.value);
                    setEmptyGoogleMeetLink(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  error={empty_zoom_link || out_zoom_link}
                  disabled={out_zoom_link}
                  fullWidth
                  style={{ margin: 8 }}
                  helperText={error_zoom_link}
                  id="zoom_link"
                  label="Link Zoom para acessar o evento"
                  type="text"
                  value={zoom_link}
                  onChange={(ev) => {
                    setZoomLink(ev.target.value);
                    setEmptyZoomLink(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div>
                <TextField
                  id="start"
                  style={{ margin: 8 }}
                  label="Início"
                  type="time"
                  readOnly
                  value={start}
                  onChange={(ev) => {
                    setStart(ev.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="end"
                  style={{ margin: 8 }}
                  label="Final"
                  readOnly
                  type="time"
                  value={end}
                  onChange={(ev) => {
                    setEnd(ev.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </form>
            <Button
              disabled={
                out_description ||
                out_entity ||
                out_google_meet_link ||
                out_organizer_email ||
                out_zoom_link
              }
              onClick={formHandler}
              variant="contained"
            >
              Aplicar alterações
            </Button>
          </Paper>
          <Paper className={styles.card}>
            <div className={styles.description}>
              <p>Lista de presença</p>
            </div>
            <List className={styles.root}>
              {participants.map((item, index) => (
                <ListItem key={`item-${item.email}`}>
                  <ListItemText primary={`${index + 1}- ${item.name}`} />
                  <ListItemText primary={`${item.email}`} />
                </ListItem>
              ))}
            </List>
            <Button onClick={editCertificateHandler} variant="contained">
              Certificado do evento
            </Button>
          </Paper>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
        <a
          href="https://lucascardev.github.io/myprofile"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by{" "}
          <img src="/logomarca.png" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
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
  const unique_id = context.params.id;
  const res = await axios.get(
    `${url_prefix}/api/getEvent?unique_id=${unique_id}`
  );
  return { props: { ...res.data, unique_id, url_prefix } };
};

export default Event;
