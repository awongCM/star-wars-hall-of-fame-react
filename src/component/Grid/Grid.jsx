import React, { useState, useEffect } from "react";
import Item from "./../Item/Item";

import "./Grid.css";

const Grid = (props) => {
  const { data, pathname, characterFilter } = props;
  const [gridPage, setGridPage] = useState({ data: data });

  useEffect(() => {
    setGridPage({ data: data });
  }, [data]);

  const reorderItemsByOverallPopularity = (
    item_id,
    upVote,
    downVote,
    overallPopularity
  ) => {
    let newOrderedData = gridPage.data.map((item) => {
      if (item.id === item_id) {
        item.up_vote = upVote;
        item.down_vote = downVote;
        item.overall_vote = overallPopularity;
        return item;
      } else {
        return item;
      }
    });
    setGridPage({ data: newOrderedData });
  };

  const renderGridDataLayout = () => {
    const lowerCaseCharacterFilter = characterFilter
      ? characterFilter.toLowerCase()
      : "";

    /**
     * TEACHING NOTE - Array.filter() Proper Usage:
     * 
     * filter() expects a boolean return value for each item.
     * We now explicitly return true/false instead of item/undefined.
     * 
     * Also, we use includes() which is more modern than indexOf() !== -1
     */
    let filteredItems = (gridPage.data || []).filter((item) => {
      const itemName = (item.name || item.title || "").toLowerCase();
      return itemName.includes(lowerCaseCharacterFilter);
    });

    //sort array in descending order
    filteredItems.sort((a, b) => {
      return b.overall_vote - a.overall_vote;
    });

    let rows = [],
      cols = [],
      row_index = 0;
    //Params to control number of items per row in a grid
    const item_per_row = 4,
      remainder_diff = item_per_row - 1;

    filteredItems.forEach((item, i) => {
      /**
       * TEACHING NOTE - Passing Resource Type:
       * 
       * Each item now has a data_type property (set in Home.jsx)
       * that tells us what kind of resource it is.
       * 
       * We pass this to Item so it knows how to:
       * 1. Fetch the right trivia
       * 2. Display the right properties
       * 3. Link to the right detail page
       */
      //Item Component
      cols.push(
        <Item
          key={i}
          item_id={item.id}
          pathname={pathname}
          itemData={item}
          resourceType={item.data_type || "people"}
          reorderItemsByOverallPopularity={reorderItemsByOverallPopularity}
        />
      );

      //setup up each row of items in the grid
      if (i % item_per_row === remainder_diff) {
        rows.push(
          <div className="gridContainer--row flex-center" key={row_index}>
            {cols}
          </div>
        );
        cols = [];
        row_index++;
      }
    });

    //for the remaining items
    if (cols.length > 0) {
      rows.push(
        <div className="gridContainer--row flex-center" key={row_index}>
          {cols}
        </div>
      );
    }

    return rows;
  };

  const gridDataLayout = renderGridDataLayout();

  return <div className="gridContainer">{gridDataLayout}</div>;
};

export default Grid;
