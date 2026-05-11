import React from "react";
import "./Card.css";

function Card({ className = "", ...props }) {
  return <div className={`card ${className}`} {...props} />;
}

function CardHeader({ className = "", ...props }) {
  return <div className={`card-header ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }) {
  return <h4 className={`card-title ${className}`} {...props} />;
}

function CardDescription({ className = "", ...props }) {
  return <p className={`card-description ${className}`} {...props} />;
}

function CardAction({ className = "", ...props }) {
  return <div className={`card-action ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`card-content ${className}`} {...props} />;
}

function CardFooter({ className = "", ...props }) {
  return <div className={`card-footer ${className}`} {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};

export default Card