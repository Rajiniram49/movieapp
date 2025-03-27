import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const MovieDetailsScreen = ({ route }) => {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get('https://www.omdbapi.com/', {
          params: {
            apikey: 'd814c14d',
            i: imdbID,
          },
        });
        setMovie(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovieDetails();
  }, [imdbID]);

  if (!movie) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {movie.Poster !== 'N/A' && (
        <Image source={{ uri: movie.Poster }} style={styles.poster} />
      )}
      <Text style={styles.title}>{movie.Title}</Text>
      <Text>Year: {movie.Year}</Text>
      <Text>Genre: {movie.Genre}</Text>
      <Text>Rating: {movie.imdbRating}</Text>
      <Text style={styles.plot}>{movie.Plot}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
  },
  poster: {
    width: 200,
    height: 300,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plot: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieDetailsScreen;
