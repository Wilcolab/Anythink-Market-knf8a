import React from "react";
import logo from "../../imgs/logo.png";
import agent from "../../agent";

const Banner = (props) => {
  let [searchTerm, setSearchTerm] = React.useState("");

  if (searchTerm.length >= 3)
    props.onSearch(searchTerm, agent.Items.bySearch(searchTerm));

  return (
    <div className="banner text-white">
      <div className="container p-4 text-center">
        <img src={logo} alt="banner" />
        <div>
          <span id="get-part">A place to get</span>
          <span>
            <input type="text" id="search-box" className="m-1 p-1 pl-2" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="search" />
          </span>
          <span> the cool stuff.</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
