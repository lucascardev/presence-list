import moment from "moment";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import tz from "moment-timezone";

const Subscription_List = (props) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [college, setCollege] = useState();
  const [data, setData] = useState(moment(props.start).format("DD/MM/YYYY"));
  const [start, setStart] = useState(
    moment(props.start).tz("America/Bahia").format()
  );
  const [end, setEnd] = useState(
    moment(props.end).tz("America/Bahia").format()
  );
  const [entity, setEntity] = useState(props.entity);
  const [empty, setEmpty] = useState(false);
  const [empty_name, setEmptyName] = useState(false);
  const [empty_email, setEmptyEmail] = useState(false);
  const [empty_college, setEmptyCollege] = useState(false);
  const [out, setOut] = useState(false);
  const [out_name, setOutName] = useState(false);
  const [out_email, setOutEmail] = useState(false);
  const [out_college, setOutCollege] = useState(false);
  const [error, setError] = useState();
  const [error_name, setErrorName] = useState();
  const [error_email, setErrorEmail] = useState();
  const [error_college, setErrorCollege] = useState();
  const router = useRouter();

  useEffect(() => {
    const TimeCheck = async () => {
      if (moment().isSameOrBefore(end)) {
      } else {
        setError("O evento já ocorreu, não é possivel mais se inscrever!");
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
      if (name && email && college) {
        const response = await axios.post(`${props.url_prefix}/api/subscribe`, {
          name: name,
          email: email,
          college: college,
          id: props.id,
        });
        if (response.status == 200) {
          router.push(`/assigned?name=${name}`);
        } else if (response.status == 203) {
          setError(response.data);
        }
      } else if (!name) {
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
        <meta name="keywords" content="event, presence, online" />
      </Head>
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

export default Subscription_List;
