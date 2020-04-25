import React, { Component } from "react";
import Item from "./../Item/Item";

import "./Grid.css";

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ data: nextProps.data });
    }
  }

  reorderItemsByOverallPopularity(
    item_id,
    upVote,
    downVote,
    overallPopularity
  ) {
    let newOrderedData = this.state.data.map((item) => {
      if (item.id === item_id) {
        item.up_vote = upVote;
        item.down_vote = downVote;
        item.overall_vote = overallPopularity;
        return item;
      } else {
        return item;
      }
    });
    this.setState({ data: newOrderedData });
  }

  render() {
    //passed its prop from parent route component
    const { pathname } = this.props;

    // TODO with data that has either name or title
    let filteredItems = this.state.data.filter((item) => {
      if (
        "name" in item &&
        item.name
          .toLowerCase()
          .indexOf(this.props.characterFilter.toLowerCase()) !== -1
      ) {
        return item;
      } else if (
        "title" in item &&
        item.title
          .toLowerCase()
          .indexOf(this.props.characterFilter.toLowerCase()) !== -1
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
          reorderItemsByOverallPopularity={this.reorderItemsByOverallPopularity.bind(
            this
          )}
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

    return <div className="gridContainer">{rows}</div>;
  }
}

export default Grid;
