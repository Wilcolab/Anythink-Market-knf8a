import { create } from "react-test-renderer";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "../../components/Header";

describe("Header component", () => {
  it("Snapshot testing with no user", () => {
    const component = create(
      <Router>
        <Header />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Snapshot testing with user", () => {
    const component = create(
      <Router>
        <Header currentUser={{ username: "user name", image: "image.png" }} />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Check link to main page", () => {
    const header = mount(
      <Router>
        <Header />
      </Router>
    );
    expect(header.find("Link").first().prop("to")).toEqual("/");
  });

  it("Render register button when there's no user", () => {
    const header = mount(
      <Router>
        <Header />
      </Router>
    );
    expect(header.find("li > Link").first().text()).toEqual("Sign in");
  });

  it("Render user name when there's a user", () => {
    const user = { username: "user name", image: "image.png" };
    const header = mount(
      <Router>
        <Header currentUser={user} />
      </Router>
    );
    expect(header.find("li > Link").last().text()).toEqual(user.username);
  });
});
