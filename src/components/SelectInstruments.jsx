import React from 'react'
import NoSsr from '@material-ui/core/NoSsr';
import { Select, Chip, Input, MenuItem, FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import { instruments } from '../utils/instruments';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  chip: {
    margin: 2,
  }
}));

export default function SelectInstruments ( props ) {

  const classes = useStyles();

  return (
    <NoSsr>
      <FormControl fullWidth>
        <InputLabel htmlFor="select-multiple-chip">Instrumentos</InputLabel>
        <Select
          multiple
          value={props.instruments}
          onChange={props.handleChange}
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
    </NoSsr>
  )
}
