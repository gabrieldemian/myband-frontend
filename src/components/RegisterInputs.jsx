
import React from 'react'
import { makeStyles, TextField, FormControl, Select, Chip, Input, MenuItem, FormHelperText, InputLabel } from '@material-ui/core';
import { instruments } from '../utils/instruments';

const useStyles = makeStyles(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  }
}));

export default function RegisterInputs (props) {

  const classes = useStyles();
  
  return (
    <div>
      <TextField
        fullWidth
        required
        onChange={props.handleChange('name')}
        label="Seu nome"
      />

      <TextField
        fullWidth
        required
        multiline
        rows="4"
        onChange={props.handleChange('bio')}
        label="Sobre você"
      />

      <FormHelperText>Conte um pouco sobre suas habilidades, e sua carreira</FormHelperText>

      <FormControl fullWidth>
        <InputLabel htmlFor="select-multiple-chip">Instrumentos</InputLabel>

        <Select
          multiple
          value={props.instruments}
          onChange={props.handleChange('instruments')}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (

            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>

          )}
        >

        {instruments.map(name => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}

      </Select>
      <FormHelperText>Você pode escolher mais de um</FormHelperText>
      </FormControl>
    </div>
  )
}
