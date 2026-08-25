import { RouterProvider } from "react-router-dom";
import { appRouter } from "./App.routes";

function App() {
	return <RouterProvider router={appRouter} />;
}

export default App;
