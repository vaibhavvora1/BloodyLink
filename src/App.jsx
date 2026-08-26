import { RouterProvider } from "react-router-dom";
import { appRouter } from "./App.routes";
import { NotificationContainer } from "./Components/NotificationToast";

function App() {
	return (
		<>
			<RouterProvider router={appRouter} />
			<NotificationContainer />
		</>
	);
}

export default App;
