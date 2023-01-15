import { create } from "react-test-renderer";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import CommentInput from "../../components/Item/CommentInput";
import agent from "../../agent";
import { ADD_COMMENT } from "../../constants/actionTypes";

const mockStore = configureMockStore();
agent.Comments.create = jest.fn();

describe("CommentInput component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it("Snapshot testing with no user", () => {
    const component = create(
      <CommentInput
        store={store}
        slug={"slug"}
        currentUser={{ username: "name", image: "" }}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Submit text", () => {
    const user = { username: "name", image: "" };
    const component = mount(
      <CommentInput store={store} slug={"slug"} currentUser={user} />
    );
    const comment = { id: 1 };
    agent.Comments.create.mockResolvedValue(comment);

    const event = { target: { value: "sometext" } };
    component.find("textarea").simulate("change", event);
    component.find("form").simulate("submit");

    setImmediate(async () => {
      expect(store.getActions()).toHaveLength(1);
      expect(store.getActions()[0].type).toEqual(ADD_COMMENT);
      expect(await store.getActions()[0].payload).toEqual(comment);
    });
  });

  it("Clear text after submit", async () => {
    const user = { username: "name", image: "" };

    const component = mount(
      <CommentInput store={store} slug={"slug"} currentUser={user} />
    );

    const comment = { id: 1 };
    agent.Comments.create.mockResolvedValue(comment);

    const event = { target: { value: "sometext" } };
    component.find("textarea").simulate("change", event);
    component.find("form").simulate("submit");
    expect(component.find("textarea").text()).toHaveLength(0);
  });
});
