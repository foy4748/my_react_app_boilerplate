const SERVER =
  import.meta.env.VITE_SERVER_ADDRESS || import.meta.env.VITE_DEV_SERVER;

import styles from "./Test.module.css";

import { useEffect, useState, useContext } from "react";
import { userContext } from "../../Contexts/AuthContext";
import Loader from "../Shared/Loader";
export default function Test() {
  const [data, setData] = useState([]);
  const { activeUser, authLoading } = useContext(userContext);
  const uid = activeUser.uid;

  if (authLoading) {
    return <Loader />;
  }

  useEffect(() => {
    const authtoken = window.localStorage.getItem("authtoken");
    const headers = {
      "Content-Type": "application/json",
      authtoken,
    };

    fetch(`${SERVER}/?uid=${uid}`, { headers })
      .then((res) => res.json())
      .then((dt) => setData(dt))
      .catch((error) => console.error(error));
  }, []);

  const itemJSX = (obj) => {
    return (
      <div className={styles.item} key={obj._id}>
        <picture>
          <img src={obj.img} alt={obj.name} className="imgFluid" />
        </picture>
        <div>
          <h2>{obj.name}</h2>
        </div>
      </div>
    );
  };
  console.log(data);

  //{data.length < 1 ? <Loader /> : JSON.stringify(data)}
  return (
    <div>
      <h1 className="container">Testing purpose component</h1>
      <section className={`${styles.itemContainer} container`}>
        {data.length < 1 ? <Loader /> : data.data.map((item) => itemJSX(item))}
      </section>
    </div>
  );
}
