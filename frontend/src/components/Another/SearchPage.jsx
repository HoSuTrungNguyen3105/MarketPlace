import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import Posts from "../Post/Posts";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation();
  // const searchText = params?.search?.slice(3);

  // useEffect(() => {
  //   fetchData();
  // }, [page, searchText]);

  console.log("page", page);

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((preve) => preve + 1);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length} </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
            {data.map((p, index) => {
              return <Posts data={p} key={p?._id + "searchProduct" + index} />;
            })}

            {/***loading data */}
            {loading &&
              loadingArrayCard.map((_, index) => {
                return <Loading key={"loadingsearchpage" + index} />;
              })}
          </div>
        </InfiniteScroll>

        {
          //no data
          !data[0] && !loading && (
            <div className="flex flex-col justify-center items-center w-full mx-auto">
              <img className="w-full h-full max-w-xs max-h-xs block" />
              <p className="font-semibold my-2">No Data found</p>
            </div>
          )
        }
      </div>
    </section>
  );
};

export default SearchPage;
