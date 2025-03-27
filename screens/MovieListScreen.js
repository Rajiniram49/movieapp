import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import SearchBar from '../Components/SearchBar';


const MovieListScreen = ({ navigation }) => {
  const [term, setTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);       // track the current page
  const [loading, setLoading] = useState(false);

  // Fetch movies (pass in a page number)
  const fetchMovies = async (searchTerm, pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: 'http://www.omdbapi.com/?i=tt3896198&apikey=d814c14d',
          s: searchTerm,
          page: pageNumber, // Use page param for OMDb pagination
        },
      });

      // OMDb returns { Search: [...], totalResults: 'XXX', ... }
      if (response.data.Search) {
        // If pageNumber is 1, reset; otherwise append
        if (pageNumber === 1) {
          setMovies(response.data.Search);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...response.data.Search]);
        }
      } else {
        // No results found or an error occurred
        if (pageNumber === 1) {
          setMovies([]); 
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Called when user submits the search
  const onSearchSubmit = () => {
    setPage(1);                 // reset to page 1
    fetchMovies(term, 1);
  };

  // Called when FlatList hits the end
  const loadMore = () => {
    // Prevent spamming new requests if we’re already loading
    if (!loading && movies.length > 0) {
      // Increase page count
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(term, nextPage);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={onSearchSubmit}
      />
      <FlatList
        data={movies}
        keyExtractor={(movie) => movie.imdbID}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MovieDetails', { imdbID: item.imdbID })}
          >
            <View style={styles.itemContainer}>
              {item.Poster !== 'N/A' && (
                <Image source={{ uri: item.Poster }} style={styles.poster} />
              )}
              <Text style={styles.title}>{item.Title}</Text>
            </View>
          </TouchableOpacity>
        )}
        // Infinite scroll props
        onEndReached={loadMore}
        onEndReachedThreshold={0.5} // Adjust how early to call loadMore (0.5 = halfway)
        ListFooterComponent={
          loading ? <Text style={{ textAlign: 'center' }}>Loading...</Text> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  poster: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
});

export default MovieListScreen;
