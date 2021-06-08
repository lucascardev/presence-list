import React from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { Paper } from "@material-ui/core";

const Assigned = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Assinatura</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="odontology, odontologia" />
      </Head>
      <main className={styles.main}>
        <Paper className={styles.card}>
          <h1 className={styles.title}>
            Obrigado, {props.name} a lista foi assinada com sucesso!
          </h1>
        </Paper>
      </main>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const name = context.query.name;
  return { props: { name } };
};

export default Assigned;
