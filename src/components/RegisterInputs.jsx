
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
        onBlur={props.handleBlur}
        name="name"
        error={(props.errors.name && props.touched.name)}
        helperText={(props.errors.name && props.touched.name) && props.errors.name}
        required
        onChange={props.handleChange('name')}
        label="Seu nome"
      />

      <TextField
        fullWidth
        required
        error={(props.errors.bio && props.touched.bio)}
        onBlur={props.handleBlur}
        helperText={(props.errors.bio && props.touched.bio) && props.errors.bio}
        multiline
        name="bio"
        rows="4"
        onChange={props.handleChange('bio')}
        label="Sobre você"
      />

      <FormControl fullWidth>
        <InputLabel error={(props.errors.instruments && props.touched.instruments)} htmlFor="select-multiple-chip">Instrumentos</InputLabel>

        <Select
          multiple
          value={props.instruments}
          error={(props.errors.instruments && props.touched.instruments)}
          onBlur={props.handleBlur}
          name="instruments"
          helperText={(props.errors.instruments && props.touched.instruments) && props.errors.instruments}
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

      <FormHelperText error>{(props.errors.instruments && props.touched.instruments) && props.errors.instruments}</FormHelperText>

      </FormControl>
    </div>
  )
}
