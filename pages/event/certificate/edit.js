import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/Home.module.css";
import Head from "next/head";
import { TextField, Button, Paper, TextareaAutosize } from "@material-ui/core";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import tz from "moment-timezone"
import canvasTxt from 'canvas-txt'

const Certificate = (props) => {

  const [image, setImage] = useState(null)
  const [certificate_img_file, setCertificateImageFile] = useState(null)
  
  const [certificate_url_img, setCertificateURLImage] = useState(props.loaded == "true" ? props.certificates[0].certificate_url_img : '')
  const [certificate_expiration_date, setCertificateExpirationDate] = useState(props.loaded == "true" ? props.certificates[0].certificate_expiration_date : '')
  const [certificate_text, setCertificateText ] = useState(props.loaded == "true" ? props.certificates[0].certificate_text : '')

  const [empty_certificate_url_img, setEmptyCertificateURLImage] = useState(false)  
  const [error_certificate_url_img, setErrorCertificateURLImage] = useState(false)
  const [out_certificate_url_img, setOutCertificateURLImage] = useState(false)

  const canvas = useRef(null)
  
  useEffect(() => {
    const certificateImage = new Image()
    certificateImage.src = certificate_url_img
    certificateImage.onload = () => setImage(certificateImage)
  }, [certificate_url_img])

  useEffect(() => {
     if (image && canvas) {
       const ctx = canvas.current.getContext('2d')
       ctx.fillStyle = "black"
       ctx.fillRect(0, 0, 640, 360)
       ctx.drawImage(image, 0 , 0)
       canvasTxt.font = 'Verdana'
       canvasTxt.fontSize = 14
       canvasTxt.align = 'left'
       canvasTxt.lineHeight = 20
       canvasTxt.justify = true
      canvasTxt.drawText(ctx, certificate_text, 110, 90, 500, 150)
     }
  }, [image, canvas, certificate_text, certificate_url_img])

  const fileSelectHandler = event => {
    setCertificateImageFile(event.target.files[0])
  }

  const fileUploadHandler = async (event) => {
    try {
    const fd = new FormData();
    fd.append('image', certificate_img_file, certificate_img_file.name)
    const response = await axios.post(`https://api.imgbb.com/1/upload?expiration=604800&key=${props.IMGBB_key}`, fd)
    if (response.data.success) {
      console.log(response.data)
      setCertificateURLImage(response.data.data.display_url)
      setCertificateExpirationDate( moment.unix(parseInt(response.data.data.time)).add(604800, 'seconds') )

    }
    } catch (error) {
     console.log(error)
    }
    
  }

  const certificateSaveHandler = async (event) => {
   
    const unique_id = props.unique_id
    const certificate_info = { certificate_text, certificate_url_img, certificate_expiration_date, unique_id }
    const new_certificate = await axios.post(`${props.url_prefix}/api/newCertificate`, certificate_info)
    console.log(new_certificate)

  }

  const certificateSendHandler = async (event) => {
   
    const unique_id = props.unique_id
    const certificate_info = { certificate_text, certificate_url_img, certificate_expiration_date, unique_id }
    const new_certificate = await axios.post(`${props.url_prefix}/api/sendEmail`, certificate_info)
    console.log(new_certificate)

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Certificates</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <meta name="description" content=""> */}
        <meta name="keywords" content="odontology, odontologia, post" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Certificado do evento</h1>
        <div className={styles.content}>
        <Paper className={styles.card}>
          <canvas 
            ref={canvas}
            width={640}
            height={360}
          />
        </Paper>
        <Paper className={styles.card}>
        <form className={styles.form} noValidate>
          <div>
        <TextField
              fullWidth
              error={empty_certificate_url_img || out_certificate_url_img}
              disabled={out_certificate_url_img}
              style={{ margin: 8 }}
              helperText={error_certificate_url_img}
              id="img_url"
              label="URL da imagem"
              type="text"
              value={certificate_url_img}
              onChange={(ev) => { setCertificateURLImage(ev.target.value)}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField 
            type='file'
            style={{ margin: 8 }}
            onChange={fileSelectHandler}
             />
            <Button  onClick={fileUploadHandler} variant="contained">
            Fazer upload
          </Button>
          </div>
          <div>
          <TextareaAutosize 
          style={{ marginTop: 40, width: 500 }} 
          onChange={(ev) => { 
            setCertificateText(ev.target.value)
          }} 
          aria-label="minimum height" 
          rowsMin={3} 
          placeholder="Certificate Text" 
          value={certificate_text} />
          </div>
        </form>
        <Button  onClick={certificateSaveHandler} variant="contained">
            Salvar Dados
        </Button>
        <Button  onClick={certificateSendHandler} variant="contained">
            Enviar Certificados
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
    let IMGBB_key;
    if (process.env.NODE_ENV === "development") {
      url_prefix = "http://localhost:3000";
      IMGBB_key = process.env.IMG_UPLOAD_KEY
    } else {
      url_prefix = "https://presence-list.vercel.app";
      IMGBB_key = process.env.IMG_UPLOAD_KEY
    }
    const loaded = context.query.loaded;
  
    const unique_id = context.query.unique_id;
    if (loaded == "true") {
      const res = await axios.get(`${url_prefix}/api/getCertificate?unique_id=${unique_id}`);
      return { props: { ...res.data, unique_id, url_prefix, IMGBB_key, loaded} };
    } else {
      return { props: { url_prefix, IMGBB_key, unique_id, loaded} };
    }
  
  };
  
  export default Certificate;