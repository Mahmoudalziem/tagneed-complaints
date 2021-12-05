import React from 'react'
import ListItem from "@mui/material/ListItem";
import { Link } from "react-router-dom";

const Index = (props) => {
    return (
        <ListItem
        button
        key={props.key}
        style={{ padding:"10px" }}
        className={props.location.pathname === props.pathname ? "active" : "default"}
      >
        <Link
          style={{
            textDecoration: "none",
            color: "#fff",
            textAlign: "center",
            display: "inline-block",
            width: "100%",
          }}
          to={props.pathname}
        >
          {props.string}
        </Link>
      </ListItem>
    )
}

export default Index