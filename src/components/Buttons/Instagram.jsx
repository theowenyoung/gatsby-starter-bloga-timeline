import React from 'react';
import { FaRss, FaInstagram } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles({

  label: {
    color: "#b900b4",
  },
});
export default function ({
  username
}) {
  const classes = useStyles()
  return (<div> <Button classes={{
    label: classes.label,

  }} color="default" size="small" startIcon={<FaInstagram></FaInstagram>} variant="outlined" href={`https://www.instagram.com/${username}`}>
    Follow iamowenyoung
</Button></div>)
}