import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: '#262626',
    padding: 13
  },
  text: {
    textAlign: 'center',
    margin: 0,
    textDecoration: 'none',
  },
  link: {
    color: 'inherit',
    transition: 'all .4s ease-in-out',
    '&:hover': {
      color: 'yellow'
    }
  }
}));

export default function Footer() {
  
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <p className={classes.text}>
        Feito por <a target="blank" className={classes.link} href="https://gabrielcribeiro.com">Gabriel Costa.</a>
      </p>
    </div>
  )
}
