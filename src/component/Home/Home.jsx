import React, { useState, useEffect } from "react";
import Form from "./../Form/Form";
import Grid from "./../Grid/Grid";
import Pagination from "./../Pagination/Pagination";
import * as SWAPI from "./../../services/api";

const Home = ({ location }) => {
  const [homePage, setHomePage] = useState({
    data: [],
    characterFilter: "",
    pagination: null,
    queryType: "people",
  });

  useEffect(() => {
    const { queryType } = homePage;
    let url = queryType ? SWAPI.fetchURLBy(queryType) : SWAPI.defaultURL;

    fetchData(url);
  }, []);

  const fetchData = (url = SWAPI.defaultURL) => {
    fetch(url, SWAPI.initHeaders())
      .then((response) => {
        return response.json();
      })
      .then((myJSON) => {
        return refineData(myJSON);
      })
      .then((refinedData) => {
        setHomePage({
          data: refinedData.newList,
          pagination: refinedData.pagination,
        });
      });
  };

  const refineData = (rawJSONData) => {
    // assuming this are the correct SWAPI raw data
    const { count, next, previous, results } = rawJSONData;
    const { queryType } = homePage;

    // TODO - will probably scrape for the SWAPI resources and generate the unique ids for navigating individual resources as a workaround
    const newList = results.map((item, i) => {
      item.id = i;
      item.up_vote = 0;
      item.down_vote = 0;
      item.overall_vote = 0;
      item.data_type = queryType;
      return item;
    });

    const pagination = {
      count: count,
      next: next,
      previous: previous,
    };

    console.log("Home newList", newList);
    console.log("Home pagination", pagination);
    return {
      newList: newList,
      pagination: pagination,
    };
  };

  const handleCharacterFilter = (characterFilter) => {
    console.log("homePage characterFilter", characterFilter);
    setHomePage({
      ...homePage,
      characterFilter,
    });
  };

  const handleNextPage = (page_url) => {
    console.log("next page", page_url);
    fetchData(page_url);
  };

  const handlePreviousPage = (page_url) => {
    console.log("prev page", page_url);
    fetchData(page_url);
  };

  const handleDropdownQueryType = (queryType) => {
    setHomePage({
      ...homePage,
      queryType,
    });
  };

  const constructPaginationData = (data, pagination) => {
    let total_pages = null,
      next = null,
      previous = null,
      total_count = null,
      max_per_page = null;

    if (pagination) {
      total_pages = Math.ceil(pagination.count / data.length);
      next = pagination.next;
      previous = pagination.previous;
      total_count = pagination.count;
      max_per_page = data.length;
    }

    return {
      total_pages,
      next,
      previous,
      total_count,
      max_per_page,
    };
  };

  const { pathname } = location;

  const { data, characterFilter, pagination } = homePage;

  const paginationData = constructPaginationData(data, pagination);

  return (
    <div>
      <Form
        data={data}
        characterFilter={characterFilter}
        onHandleCharacterFilter={handleCharacterFilter}
        onHandleDropdownQueryType={handleDropdownQueryType}
      />
      <Grid pathname={pathname} data={data} characterFilter={characterFilter} />
      <Pagination
        paginationData={paginationData}
        onHandleNextPage={handleNextPage}
        onHandlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};

export default Home;
