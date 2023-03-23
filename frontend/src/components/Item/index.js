import ItemMeta from "./ItemMeta";
import CommentContainer from "./CommentContainer";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import marked from "marked";
import {
  ITEM_PAGE_LOADED,
  ITEM_PAGE_UNLOADED,
} from "../../constants/actionTypes";
import { getItemAndComments } from "./utils/ItemFetcher";
import { useParams } from "react-router-dom";

const mapStateToProps = (state) => ({
  ...state.item,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload) => dispatch({ type: ITEM_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ITEM_PAGE_UNLOADED }),
});

const Item = (props) => {
  const params = useParams();
  const {onLoad, onUnload} = props;
  useEffect(() => {
    getItemAndComments(
      params.id
    ).then(([item, comments]) => {
      onLoad([item, comments]);
    });
    return onUnload;
  }, [onLoad, onUnload, params]);

    if (!props.item) {
      return null;
    }

    const markup = {
      __html: marked(props.item.description, { sanitize: true }),
    };
    const canModify =
      props.currentUser &&
      props.currentUser.username === props.item.seller.username;
    return (
      <div className="container page" id="item-container">
        <div className="text-dark">
          <div className="row bg-white p-4">
            <div className="col-6">
              <img
                src={props.item.image}
                alt={props.item.title}
                className="item-img"
                style={{ height: "500px", width: "100%", borderRadius: "6px" }}
              />
            </div>

            <div className="col-6">
              <h1 id="card-title">{props.item.title}</h1>
              <ItemMeta item={props.item} canModify={canModify} />
              <div dangerouslySetInnerHTML={markup}></div>
              {props.item.tagList.map((tag) => {
                return (
                  <span className="badge badge-secondary p-2 mx-1" key={tag}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="row bg-light-gray p-4">
            <CommentContainer
              comments={props.comments || []}
              errors={props.commentErrors}
              slug={params.id}
              currentUser={props.currentUser}
            />
          </div>
        </div>
      </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
