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

    // TODO with data that has either name or title
    let filteredItems = (gridPage.data || []).filter((item) => {
      if (
        "name" in item &&
        item.name.toLowerCase().indexOf(lowerCaseCharacterFilter) !== -1
      ) {
        return item;
      } else if (
        "title" in item &&
        item.title.toLowerCase().indexOf(lowerCaseCharacterFilter) !== -1
      ) {
        return item;
      }
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
      //Item Component
      cols.push(
        <Item
          key={i}
          item_id={item.id}
          pathname={pathname}
          characterData={item}
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
