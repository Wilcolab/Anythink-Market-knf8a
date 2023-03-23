import { useParams } from "react-router-dom";

export function withRouterParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}
