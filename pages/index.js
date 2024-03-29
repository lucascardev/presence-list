import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import moment from "moment";
import {
  TextField,
  Button,
  Paper,
  Modal,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Switch,
  FormControlLabel,
  FormGroup,
  Box,
} from "@mui/material";
import axios from "axios";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [event_id, setEventID] = React.useState();
  const [description, setDescription] = React.useState();
  const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"));
  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();
  const [entity, setEntity] = React.useState();
  const [organizer_email, setOrganizerEmail] = React.useState();
  const [subscription, setSubscription] = React.useState(false);
  const [link, setLink] = React.useState();
  const [subscription_link, setSubscriptionLink] = React.useState();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [empty_id, setEmptyID] = React.useState(false);
  const [error_id, setErrorID] = React.useState();
  const [out_id, setOutID] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formHandler = async () => {
    try {
      let url_prefix;
      if (process.env.NODE_ENV === "development") {
        url_prefix = "http://localhost:3000";
      } else {
        url_prefix = "https://presence-list.vercel.app";
      }
      const startDate = await moment(
        `${date}/${start}`,
        "YYYY-MM-DD/hh:mm"
      ).format();
      const endDate = await moment(
        `${date}/${end}`,
        "YYYY-MM-DD/hh:mm"
      ).format();
      // console.log(startDate);

      if (
        !start ||
        !end ||
        !organizer_email ||
        !date ||
        !description ||
        !entity
      ) {
        enqueueSnackbar(
          "🧐 Ops, algum(s) dos campos parecem vazios, peencha com todos os dados do evento",
          { variant: "error" }
        );
        return true;
      }

      const response = await axios.post(`api/new`, {
        start: startDate,
        end: endDate,
        entity: entity,
        organizer_email: organizer_email,
        subscription: subscription,
        description: description,
      });
      // console.log(JSON.stringify(response));
      setLink(`${url_prefix}/list/${response.data._id}`);
      setSubscriptionLink(
        `${url_prefix}/subscription_list/${response.data._id}`
      );
      setEventID(response.data.unique_id);
      handleOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const editEventHandler = async () => {
    try {
      let url_prefix;
      if (event_id) {
        if (process.env.NODE_ENV === "development") {
          url_prefix = "http://localhost:3000";
        } else {
          url_prefix = "https://presence-list.vercel.app";
        }
        router.push(`${url_prefix}/event/${event_id}`);
      } else {
        setEmptyID(true);
        setErrorID("Preencha com ID do evento");
        enqueueSnackbar(
          "🧐 Ops, o campo parece vazio, peencha com ID do evento",
          { variant: "error" }
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleChange = (event) => {
    setSubscription(event.target.checked);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lista de presença para eventos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Lista de presença para eventos</h1>
        <div className={styles.content}>
          <Paper className={styles.card}>
            <div className={styles.description}>
              <p>Dados para criar novo evento</p>
            </div>
            <Box
              className={styles.form}
              component="form"
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="description"
                  style={{ margin: 8 }}
                  label="Nome do evento"
                  value={description}
                  onChange={(ev) => {
                    setDescription(ev.target.value);
                  }}
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="entity"
                  style={{ margin: 8 }}
                  label="Organização"
                  required
                  value={entity}
                  onChange={(ev) => {
                    setEntity(ev.target.value);
                  }}
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="organizer_email"
                  required
                  style={{ margin: 8 }}
                  label="E-mail do organizador"
                  value={organizer_email}
                  onChange={(ev) => {
                    setOrganizerEmail(ev.target.value);
                  }}
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div>
                <TextField
                  id="date"
                  required
                  style={{ margin: 8 }}
                  label="Data"
                  type="date"
                  value={date}
                  onChange={(ev) => {
                    setDate(ev.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="start"
                  required
                  style={{ margin: 8 }}
                  label="Início"
                  type="time"
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
                  required
                  style={{ margin: 8 }}
                  label="Final"
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
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={subscription}
                      onChange={handleChange}
                      name="subscription"
                    />
                  }
                  label="Ativar Inscrição"
                />
              </FormGroup>
            </Box>
            <Button onClick={formHandler} variant="contained">
              😎 Criar o meu evento
            </Button>
          </Paper>
          <Paper className={styles.card}>
            <div className={styles.description}>
              <p>Acesse seu evento pelo ID</p>
            </div>
            <Box
              component="form"
              className={styles.form}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  error={empty_id || out_id}
                  disabled={out_id}
                  helperText={error_id}
                  id="event_id"
                  style={{ margin: 8 }}
                  label="ID do seu Evento"
                  value={event_id}
                  onChange={(ev) => {
                    setEventID(ev.target.value);
                    setEmptyID(false);
                  }}
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </Box>
            <Button
              onClick={editEventHandler}
              variant="contained"
              disabled={out_id}
            >
              Acompanhar meu evento
            </Button>
          </Paper>
        </div>
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
            <Typography className={styles.description} color="textSecondary">
              Os dados do seu evento foram enviados ao seu email.
            </Typography>
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
              fullWidth
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
            {subscription ? (
              <>
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
                  fullWidth
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
              </>
            ) : (
              <Typography
                className={styles.description}
                color="textSecondary"
                gutterBottom
              >
                A lista de inscrição está desativada para este evento.
              </Typography>
            )}
            <Typography
              className={styles.description}
              color="textSecondary"
              gutterBottom
            >
              O ID do seu evento é único e deve ser usado para acessar ou
              modificar informações sobre seu evento.
            </Typography>
            <TextField
              id="event_id"
              label="ID do evento"
              defaultValue={event_id}
              InputProps={{
                readOnly: true,
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
}
