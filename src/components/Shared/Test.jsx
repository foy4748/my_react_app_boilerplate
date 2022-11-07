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

  const [formValues, setFormValues] = useState({ amount: 0, name: "" });

  if (authLoading) {
    return <Loader />;
  }

  /*
  // Testing GET method
  useEffect(() => {
    const authtoken = window.localStorage.getItem("authtoken");
    const headers = {
      "Content-Type": "application/json",
      authtoken,
    };

    fetch(`${SERVER}`, { headers })
      .then((res) => res.json())
      .then((dt) => setData(dt))
      .catch((error) => console.error(error));
  }, []);
  //------------ END of Testing GET method -------------
	*/

  // Testing POST method
  useEffect(() => {
    const authtoken = window.localStorage.getItem("authtoken");
    const headers = {
      "Content-Type": "application/json",
      authtoken,
    };

    fetch(`${SERVER}`, { headers })
      .then((res) => res.json())
      .then((dt) => setData(dt))
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authtoken: localStorage.getItem("authtoken"),
      },
      body: JSON.stringify(formValues),
    };
    const res = await fetch(`${SERVER}/test-post`, options);
    const result = await res.json();
    if (result.error) {
      alert("POSTing data went wrong");
      return;
    }

    if (result.acknowledged) {
      const currentPost = { ...formValues };
      currentPost["_id"] = result.insertedId;
      currentPost["uid"] = activeUser.uid;
      data.data.push(currentPost);
      const newSet = { ...data };
      setData(newSet);
    }
  };
  //------------ END of Testing POST method -------------

  // Testing DELETE method
  const handleDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
          delete_id: id,
        },
      };

      const res = await fetch(`${SERVER}/test-delete`, options);
      const result = await res.json();
      if (result.error) {
        alert("Something went wrong. DELETE failed");
        return;
      }

      if (result.acknowledged) {
        const newDataSet = data.data.filter((item) => item._id !== id);
        data.data = newDataSet;
        const newSet = { ...data };
        setData(newSet);
      }
    } catch (error) {
      console.error(error);
    }
  };
  //------------ END of Testing DELETE method -------------
  const changedInput = (e) => {
    e.preventDefault();
    const field = e.target.name;
    const value = e.target.value;
    formValues[field] = value;
    const newState = { ...formValues };
    setFormValues(newState);
  };

  /*
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
	*/

  const itemJSX = (obj) => {
    return (
      <div className={styles.item} key={obj._id}>
        <h3>
          {obj.name} <span onClick={() => handleDelete(obj._id)}>( X )</span>
        </h3>
        <p>{obj.amount}</p>
      </div>
    );
  };
  //{data.length < 1 ? <Loader /> : JSON.stringify(data)}
  return (
    <div>
      <h1 className="container">Testing purpose component</h1>
      <section>
        <form onSubmit={handleSubmit}>
          <p>Amount</p>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formValues.name}
            onChange={changedInput}
          />
          <br />
          <input
            type="number"
            placeholder="Amount to Deposite"
            name="amount"
            value={formValues.amount}
            onChange={changedInput}
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </section>
      <section className={`${styles.itemContainer} container`}>
        {data.length < 1 ? (
          <Loader />
        ) : (
          data?.data?.map((item) => itemJSX(item))
        )}
      </section>
    </div>
  );
}
