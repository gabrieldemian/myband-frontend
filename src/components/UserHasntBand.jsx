import React from 'react'
import { Card, CardMedia, Container, Typography, CardActions, Button, makeStyles } from '@material-ui/core';
import CreateBand from './CreateBand';

const useStyles = makeStyles(theme => ({
  media: {
    height: 200,
    backgroundAttachment: 'fixed',
    backgroundSize: 'initial',
    backgroundPosition: 'initial',
    [theme.breakpoints.down('md')]: {
      backgroundSize: 'contain'
    }
  },
  title: {
    marginTop: theme.spacing(1)
  }
}));


export default function UserHasntBand (props) {
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  
  const onClose = () => {
    setOpen(false);
  }

  return (
    <Card>
      <CardMedia
        image={require("../assets/chet.jpeg")}
        alt="chet baker"
        className={classes.media}
      />

      <Container>
        <Typography className={classes.title} gutterBottom variant="h4" component="h2">
          Ops,
        </Typography>
        <Typography variant="h6" color="textSecondary" component="p">
          Parece que você ainda não participa de nenhuma banda :( <br />
          Mas tudo bem, é para isto que serve este app! <br />
          Criar sua banda do zero, ou entrar em uma existente?
        </Typography>
      </Container>

      <CardActions style={{ justifyContent: 'center' }}>
        <Button color="primary">
          Procurar uma banda
      </Button>

        <Button color="primary" onClick={() => setOpen(true)}>
          Criar minha própria banda
        </Button>

        <CreateBand
          updateBand={props.updateBand}
          userName={props.userName}
          instruments={props.instruments}
          open={open}
          setOpen={setOpen}
          onClose={onClose}
        />
      
      </CardActions>
    </Card>
  )
}
