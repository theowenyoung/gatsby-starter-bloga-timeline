import React from 'react';
import { FaRss } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles({

  label: {
    color: "#ee802f",
  },
});
export default function () {
  const classes = useStyles()
  return (<div> <Button classes={{
    label: classes.label,

  }} color="default" size="small" startIcon={<FaRss></FaRss>} variant="outlined" href="/rss.xml">
    Subscribe to RSS Feed
</Button></div>)
}