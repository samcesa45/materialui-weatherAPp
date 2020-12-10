import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Link
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import useDebounced from "../useDebounced";
import dynamicImg from "./Weather.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3)
  },
  MuiInputBase: {
    color: "white",
    borderColor: "blue"
  },
  iconImage: {
    height: 100,
    width: 100,
    alignSelf: "center"
  },
  button: {
    marginLeft: theme.spacing(3)
  }
}));
const Weather = (props) => {
  const { currentWeather, onCityChange } = props;
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("london");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedTerm = useDebounced(searchTerm, 1000);

  useEffect(() => {
    if (debouncedTerm) {
      onCityChange(debouncedTerm);
      setIsSearching(false);
    }
  }, [debouncedTerm, isSearching, onCityChange]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  let classImg = [];
  if (currentWeather.humidity < 50 && currentWeather.temperature > 20) {
    classImg.push(dynamicImg.SunnySky);
  } else if (currentWeather.humidity < 50 && currentWeather.temperature < 20) {
    classImg.push(dynamicImg.ClearSky);
  } else {
    classImg.push(dynamicImg.UnionJack);
  }

  return (
    <div className={classImg.join("  ")}>
      <AppBar
        position="static"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography style={{ flex: "1", color: "black" }}>Home</Typography>

          <Link href="https://github.com/samcesa45" target="_blank">
            <GitHubIcon color="secondary" />
          </Link>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={2}
        justify="center"
        className={classes.root}
        alignItems="center"
      >
        <Grid item>
          <SearchIcon />
          <TextField
            placeholder="Search City"
            onChange={handleChange}
            value={searchTerm}
            inputProps={{ className: classes.MuiInputBase }}
          />
        </Grid>

        <Grid item container justify="center">
          <Grid>
            <Typography variant="h4" gutterBottom>
              Weather Forecast for {searchTerm},{currentWeather.country}
            </Typography>

            <Card
              variant="outlined"
              style={{ background: "transparent", border: "0" }}
            >
              <CardMedia
                image={`http://openweathermap.org/img/w/${currentWeather.icon}.png`}
                className={classes.iconImage}
              />
              <CardContent>
                <Typography variant="h5">Date:{currentWeather.date}</Typography>
                <Typography variant="h5">
                  Humidity:{currentWeather.humidity}%
                </Typography>
                <Typography variant="h5">
                  Temperature:{Math.round(currentWeather.temperature)}&deg;C
                </Typography>
                <Typography variant="h5">
                  Sunrise:{currentWeather.sunrise}
                </Typography>
                <Typography variant="h5">
                  Sunset:{currentWeather.sunset}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Weather;
