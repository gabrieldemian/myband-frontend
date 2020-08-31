import React from 'react';
import clsx from 'clsx';
import AsyncSelect from 'react-select/async';
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import api from '../utils/api';
import { FormHelperText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '12px',
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  }
}));

export default function AutoComplete(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [multi, setMulti] = React.useState(null);

  function Control(props) {
    const {
      children,
      innerProps,
      innerRef,
      selectProps: { classes, TextFieldProps },
    } = props;
  
    return (
      <TextField
        fullWidth
        InputProps={{
          inputComponent,
          inputProps: {
            className: classes.input,
            ref: innerRef,
            children,
            ...innerProps,
          },
        }}
        {...TextFieldProps}
      />
    );
  }

  function inputComponent({ inputRef, ...props }) {

    return <div ref={inputRef} {...props} />;
  }

  const getUsers = async (keystrokes) => {

    const user = await api.get('/user', {
      headers: {
        searchValue: keystrokes,
        id: localStorage.getItem('userId')
      }
    });
    
    return user.data.map(suggestion => ({
      ...suggestion,
      instrument: '',
      label: suggestion.name,
      value: suggestion.name
    }));
  }

  function handleChangeMulti(value) {
    setMulti(value);
    props.handleChange(value);
  }

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  function NoOptionsMessage(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
      >
        Músico não encontrado
      </Typography>
    );
  }
  
  function Option(props) {
  
    return (
      <MenuItem
        ref={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
  }
  
  function Placeholder(props) {
    const { selectProps, innerProps = {}, children } = props;
    return (
      <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
        {children}
      </Typography>
    );
  }
  
  function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
  }
  
  const MultiValue = (propsMulti) => {
    return (
      <Chip
        tabIndex={-1}
        label={propsMulti.children}
        className={clsx(propsMulti.selectProps.classes.chip, {
          [propsMulti.selectProps.classes.chipFocused]: propsMulti.isFocused,
        })}
        onDelete={(e) => {
          if (propsMulti.selectProps.value.length === 1) {
            
            handleChangeMulti([]);
          } else {

            propsMulti.removeProps.onClick(e)
          }
        }}
        deleteIcon={<CancelIcon {...propsMulti.removeProps} />}
      />
    );
  }
  
  function Menu(props) {
    return (
      <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
        {props.children}
      </Paper>
    );
  }

  const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <AsyncSelect
          classes={classes}
          fullWidth
          onBlur={props.handleBlur}
          name={props.name}
          styles={selectStyles}
          inputId="react-select-multiple"
          TextFieldProps={{
            // label: 'Convidar músicos para a banda',
            InputLabelProps: {
              htmlFor: 'react-select-multiple',
              shrink: true,
            },
          }}
          placeholder="Pesquise músicos que você quer convidar"
          loadOptions={getUsers}
          components={components}
          value={multi}
          onChange={handleChangeMulti}
          isMulti
        />
        <FormHelperText>{props.helperText}</FormHelperText>
      </NoSsr>
    </div>
  );
}